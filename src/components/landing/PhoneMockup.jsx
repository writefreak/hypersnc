import { QRCodeSVG } from "qrcode.react";
import TransferRow from "../TransferRow.jsx";
import StatusPill from "../ui/StatusPill.jsx";
import { mockTransfers } from "../../data/mockTransfers.js";

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm py-10 lg:max-w-md">
      <div aria-hidden="true" className="absolute inset-x-4 inset-y-0 rounded-[3rem] bg-accent" />

      <div inert aria-hidden="true" className="relative mx-auto w-64 rounded-[2.75rem] border-10 border-ink bg-paper p-3 shadow-xl sm:w-72">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-ink/80" />
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-bold">Connected</span>
          <StatusPill tone="success">Live</StatusPill>
        </div>
        <ul className="space-y-2">
          {mockTransfers.slice(0, 3).map((transfer) => (
            <TransferRow key={transfer.id} transfer={transfer} />
          ))}
        </ul>
      </div>

      <div
        inert
        aria-hidden="true"
        className="absolute -bottom-2 left-0 w-32 -rotate-6 rounded-2xl border border-line bg-surface p-2 shadow-lg sm:-left-6 sm:w-36"
      >
        <QRCodeSVG value="offline-share:demo" size={128} level="L" style={{ width: "100%", height: "auto" }} />
      </div>
    </div>
  );
}
