import { useCallback, useEffect, useRef, useState } from "react";
import { makeId, percent, sendFile } from "../lib/file-transfer.js";
import { mockTransfers } from "../data/mockTransfers.js";

const UI_INTERVAL_MS = 120; // limit re-renders, since chunks arrive thousands of times
const ACK_TIMEOUT_MS = 20_000; // how long the sender waits for the receiver to confirm

const speedOf = (bytes, startedAt) =>
  bytes / Math.max((performance.now() - startedAt) / 1000, 0.001);

export default function useTransfer(channel) {
  // With no channel (the dev skip button), show mock rows so the UI can be reviewed
  const [transfers, setTransfers] = useState(() =>
    !channel && import.meta.env.DEV ? mockTransfers : [],
  );
  const [open, setOpen] = useState(() => channel?.readyState === "open");
  const queueRef = useRef([]); // files waiting to be sent: { id, file }
  const sendingRef = useRef(false);
  const cancelledRef = useRef(new Set());
  const incomingRef = useRef(null); // the file currently being received
  const acksRef = useRef(new Map()); // file id -> function that settles its delivery wait

  const patch = useCallback((id, changes) => {
    setTransfers((list) =>
      list.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );
  }, []);

  // Track whether the channel is actually usable
  useEffect(() => {
    if (!channel) {
      setOpen(false);
      return;
    }
    const sync = () => setOpen(channel.readyState === "open");
    sync();
    channel.addEventListener("open", sync);
    channel.addEventListener("close", sync);
    channel.addEventListener("error", sync);
    return () => {
      channel.removeEventListener("open", sync);
      channel.removeEventListener("close", sync);
      channel.removeEventListener("error", sync);
    };
  }, [channel]);

  // Receiving
  useEffect(() => {
    if (!channel) return;
    channel.binaryType = "arraybuffer";

    const reply = (t, id) => {
      if (channel.readyState === "open")
        channel.send(JSON.stringify({ t, id }));
    };

    const startReceive = ({ id, name, size, mime }) => {
      incomingRef.current = {
        id,
        name,
        size,
        mime,
        chunks: [],
        received: 0,
        startedAt: performance.now(),
        lastUi: 0,
      };
      setTransfers((list) => [
        ...list,
        {
          id,
          name,
          size,
          direction: "in",
          status: "active",
          progress: 0,
          speed: 0,
        },
      ]);
    };

    const receiveChunk = (buffer) => {
      const current = incomingRef.current;
      if (!current) return;
      current.chunks.push(buffer);
      current.received += buffer.byteLength;

      const now = performance.now();
      if (now - current.lastUi < UI_INTERVAL_MS) return;
      current.lastUi = now;
      patch(current.id, {
        progress: percent(current.received, current.size),
        speed: speedOf(current.received, current.startedAt),
      });
    };

    const finishReceive = (id) => {
      const current = incomingRef.current;
      if (!current || current.id !== id) return;
      incomingRef.current = null;
      if (current.received !== current.size) {
        reply("nack", id);
        return patch(id, { status: "failed", speed: 0 });
      }

      const blob = new Blob(current.chunks, {
        type: current.mime || "application/octet-stream",
      });
      patch(id, { status: "done", progress: 100, speed: 0, blob });
      reply("ack", id); // tells the sender the whole file arrived
    };

    const abortReceive = (id) => {
      if (incomingRef.current?.id === id) incomingRef.current = null;
      patch(id, { status: "cancelled", speed: 0 });
    };

    const onMessage = (event) => {
      if (typeof event.data !== "string") return receiveChunk(event.data);
      const message = JSON.parse(event.data);
      if (message.t === "meta") startReceive(message);
      else if (message.t === "end") finishReceive(message.id);
      else if (message.t === "cancel") abortReceive(message.id);
      else if (message.t === "ack") acksRef.current.get(message.id)?.(true);
      else if (message.t === "nack") acksRef.current.get(message.id)?.(false);
    };

    const onClose = () => {
      if (incomingRef.current)
        patch(incomingRef.current.id, { status: "failed", speed: 0 });
      acksRef.current.forEach((settle) => settle(false)); // stop waiting on a dead channel
    };

    channel.addEventListener("message", onMessage);
    channel.addEventListener("close", onClose);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.removeEventListener("close", onClose);
    };
  }, [channel, patch]);

  // Resolves true when the receiver confirms the file, false on refusal or timeout
  const waitForAck = useCallback(
    (id) =>
      new Promise((resolve) => {
        const settle = (ok) => {
          clearTimeout(timer);
          acksRef.current.delete(id);
          resolve(ok);
        };
        const timer = setTimeout(() => settle(false), ACK_TIMEOUT_MS);
        acksRef.current.set(id, settle);
      }),
    [],
  );

  // Sending: files go out one at a time, in the order they were added
  const pump = useCallback(async () => {
    if (sendingRef.current || !channel) return;
    sendingRef.current = true;

    while (queueRef.current.length && channel.readyState === "open") {
      const { id, file } = queueRef.current.shift();
      const startedAt = performance.now();
      let lastUi = 0;
      patch(id, { status: "active" });

      try {
        const outcome = await sendFile(channel, id, file, {
          waitForAck,
          isCancelled: () => cancelledRef.current.has(id),
          onProgress: (sent) => {
            const now = performance.now();
            if (now - lastUi < UI_INTERVAL_MS && sent < file.size) return;
            lastUi = now;
            patch(id, {
              progress: percent(sent, file.size),
              speed: speedOf(sent, startedAt),
            });
          },
        });
        const finished = {
          done: { status: "done", progress: 100, speed: 0 },
          cancelled: { status: "cancelled", speed: 0 },
          failed: { status: "failed", speed: 0 },
        };
        patch(id, finished[outcome]);
      } catch {
        patch(id, { status: "failed", speed: 0 });
      }
    }

    sendingRef.current = false;
  }, [channel, patch, waitForAck]);

  const addFiles = useCallback(
    (files) => {
      if (!channel || files.length === 0) return;
      const entries = files.map((file) => ({ id: makeId(), file }));
      queueRef.current.push(...entries);
      setTransfers((list) => [
        ...list,
        ...entries.map(({ id, file }) => ({
          id,
          name: file.name,
          size: file.size,
          direction: "out",
          status: "queued",
          progress: 0,
          speed: 0,
        })),
      ]);
      pump();
    },
    [channel, pump],
  );

  const cancel = useCallback(
    (id) => {
      cancelledRef.current.add(id);
      const stillQueued = queueRef.current.some((entry) => entry.id === id);
      if (!stillQueued) return; // already sending, so sendFile notices and stops
      queueRef.current = queueRef.current.filter((entry) => entry.id !== id);
      patch(id, { status: "cancelled" });
    },
    [patch],
  );

  return { transfers, addFiles, cancel, canSend: open };
}
