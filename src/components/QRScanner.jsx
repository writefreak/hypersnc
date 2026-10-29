import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { CameraOff } from "lucide-react";

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [error, setError] = useState(false);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const scanner = new QrScanner(videoRef.current, (result) => onScanRef.current(result.data), {
      preferredCamera: "environment",
      highlightScanRegion: false,
      highlightCodeOutline: false,
    });
    scanner.start().catch(() => setError(true));
    return () => scanner.destroy();
  }, []);

  if (error) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-3 rounded-3xl bg-line/60 p-6 text-center lg:max-w-sm">
        <CameraOff className="size-8 text-muted" />
        <p className="font-semibold">Camera is blocked</p>
        <p className="text-sm text-muted">Allow camera access in your browser settings, then reload this page.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl bg-ink lg:max-w-sm">
      <video ref={videoRef} className="size-full object-cover" playsInline muted />
      <div className="pointer-events-none absolute inset-8 rounded-2xl border-4 border-accent" />
    </div>
  );
}
