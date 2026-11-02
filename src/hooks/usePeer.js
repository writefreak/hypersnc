import { useCallback, useRef, useState } from "react";
import {
  decodeDescription,
  encodeDescription,
  primeCameraPermission,
  waitForIce,
} from "../lib/signalling.js";

const RTC_CONFIG = { iceServers: [] };

export default function usePeer() {
  const pcRef = useRef(null);
  const lockRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [localCode, setLocalCode] = useState("");
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState("");

  const fail = useCallback((message) => {
    lockRef.current = false;
    setError(message);
    setStatus("failed");
  }, []);

  const close = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    lockRef.current = false;
    setChannel(null);
    setLocalCode("");
    setError("");
    setStatus("idle");
  }, []);

  const bindChannel = useCallback((ch) => {
    ch.binaryType = "arraybuffer";
    ch.onopen = () => {
      setChannel(ch);
      setStatus("connected");
    };
    ch.onclose = () => {
      setChannel(null);
      setStatus("disconnected");
    };
  }, []);

  const createConnection = useCallback(() => {
    pcRef.current?.close();
    const pc = new RTCPeerConnection(RTC_CONFIG);
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") {
        fail("Could not connect. Try making the other phone the hotspot.");
      }
    };
    pcRef.current = pc;
    return pc;
  }, [fail]);

  const createOffer = useCallback(async () => {
    let pc;
    try {
      lockRef.current = false;
      setError("");
      setLocalCode("");
      setStatus("preparing");
      await primeCameraPermission();
      pc = createConnection();
      bindChannel(pc.createDataChannel("files"));
      await pc.setLocalDescription(await pc.createOffer());
      await waitForIce(pc);
      if (pcRef.current !== pc) return;
      setLocalCode(encodeDescription(pc.localDescription));
      setStatus("waiting");
    } catch {
      if (pcRef.current === pc)
        fail("Could not create your code. Reload the page and try again.");
    }
  }, [bindChannel, createConnection, fail]);

  const acceptOffer = useCallback(
    async (code) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try {
        setError("");
        setStatus("preparing");
        const pc = createConnection();
        pc.ondatachannel = (event) => bindChannel(event.channel);
        await pc.setRemoteDescription(decodeDescription(code));
        await pc.setLocalDescription(await pc.createAnswer());
        await waitForIce(pc);
        setLocalCode(encodeDescription(pc.localDescription));
        setStatus("waiting");
      } catch {
        fail("That code could not be read. Scan the sender's code again.");
      }
    },
    [bindChannel, createConnection, fail],
  );

  const acceptAnswer = useCallback(
    async (code) => {
      if (lockRef.current || !pcRef.current) return;
      lockRef.current = true;
      try {
        setStatus("connecting");
        await pcRef.current.setRemoteDescription(decodeDescription(code));
      } catch {
        fail("That reply code could not be read. Scan it again.");
      }
    },
    [fail],
  );

  return {
    status,
    localCode,
    channel,
    error,
    createOffer,
    acceptOffer,
    acceptAnswer,
    close,
  };
}
