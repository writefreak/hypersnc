import { QRCodeSVG } from "qrcode.react";

export default function QRDisplay({ value, caption }) {
  return (
    <figure className="mx-auto w-full max-w-xs lg:max-w-sm">
      <div className="rounded-3xl bg-accent p-3">
        <div className="rounded-2xl bg-surface p-4">
          <QRCodeSVG value={value} size={256} level="L" style={{ width: "100%", height: "auto" }} />
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
