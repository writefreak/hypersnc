import LZString from "lz-string";

const PREFIX = "OS1:";
const MAX_WAIT_MS = 4000;

// With no signaling server, the code must contain every ICE candidate,
// so wait until the browser has finished collecting them.
export function waitForIce(pc) {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    const done = () => {
      pc.removeEventListener("icegatheringstatechange", onChange);
      clearTimeout(timer);
      resolve();
    };
    const onChange = () => pc.iceGatheringState === "complete" && done();
    const timer = setTimeout(done, MAX_WAIT_MS);
    pc.addEventListener("icegatheringstatechange", onChange);
  });
}

// Keep only IPv4 UDP candidates so the QR code stays small and easy to scan.
function slim(sdp) {
  return sdp
    .split("\r\n")
    .filter((line) => {
      if (!line.startsWith("a=candidate")) return true;
      const parts = line.split(" ");
      return parts[2].toLowerCase() === "udp" && !parts[4].includes(":");
    })
    .join("\r\n");
}

export function encodeDescription({ type, sdp }) {
  return (
    PREFIX +
    LZString.compressToEncodedURIComponent(
      JSON.stringify({ t: type, s: slim(sdp) }),
    )
  );
}

export function decodeDescription(code) {
  if (!code.startsWith(PREFIX)) throw new Error("Not an Offline Share code");
  const json = LZString.decompressFromEncodedURIComponent(
    code.slice(PREFIX.length),
  );
  const { t, s } = JSON.parse(json);
  return { type: t, sdp: s };
}

// Browsers hide real local IPs behind .local names unless camera permission
// has been granted. Those names often fail on hotspots, so ask first.
export async function primeCameraPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
  } catch {
    // Pairing can still work without it, so ignore a denied prompt.
  }
}
