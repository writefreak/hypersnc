const CHUNK_SIZE = 16 * 1024; // the safest message size across browsers
const READ_BLOCK = 256 * 1024; // read from disk in big blocks, send in small chunks
const HIGH_WATER = 1024 * 1024; // pause sending when this much is queued
const LOW_WATER = 256 * 1024; // resume sending when the queue drains to this

export const makeId = () =>
  crypto.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const percent = (done, total) =>
  total === 0 ? 100 : Math.min(100, Math.round((done / total) * 100));

// Resolves when the channel's send buffer has drained, or the channel closes.
function waitForDrain(channel) {
  return new Promise((resolve) => {
    const done = () => {
      channel.removeEventListener("bufferedamountlow", done);
      channel.removeEventListener("close", done);
      resolve();
    };
    channel.bufferedAmountLowThreshold = LOW_WATER;
    channel.addEventListener("bufferedamountlow", done);
    channel.addEventListener("close", done);
  });
}

// Protocol: one "meta" message, then binary chunks, then one "end" message.
// The channel is ordered and reliable, so the receiver can rebuild the file in order.
// After "end", the receiver replies with "ack" (it got everything) or "nack" (it did not).
export async function sendFile(
  channel,
  id,
  file,
  { onProgress, isCancelled, waitForAck }, // CHANGED: added waitForAck
) {
  channel.send(
    JSON.stringify({
      t: "meta",
      id,
      name: file.name,
      size: file.size,
      mime: file.type,
    }),
  );

  let offset = 0;
  while (offset < file.size) {
    if (isCancelled()) {
      channel.send(JSON.stringify({ t: "cancel", id }));
      return "cancelled";
    }

    const block = await file.slice(offset, offset + READ_BLOCK).arrayBuffer();
    for (let i = 0; i < block.byteLength; i += CHUNK_SIZE) {
      if (channel.bufferedAmount > HIGH_WATER) await waitForDrain(channel);
      if (channel.readyState !== "open") throw new Error("Channel closed");
      channel.send(
        new Uint8Array(block, i, Math.min(CHUNK_SIZE, block.byteLength - i)),
      );
    }

    offset += block.byteLength;
    onProgress(offset);
  }

  // CHANGED: only report "done" once the receiver confirms the whole file arrived.
  // The listener is set up before "end" is sent, so a fast reply cannot be missed.
  const acked = waitForAck(id);
  channel.send(JSON.stringify({ t: "end", id }));
  return (await acked) ? "done" : "failed";
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// iPhone: open the share sheet, so photos and videos can go to the Photos app.
// Everything else: a normal download.
export async function saveFile({ blob, name }) {
  if (!blob) return;

  if (isIOS()) {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
