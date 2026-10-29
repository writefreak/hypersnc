import { useState } from "react";
import { Smartphone, Unplug } from "lucide-react";
import Shell from "../components/layout/Shell.jsx";
import DropZone from "../components/DropZone.jsx";
import TransferRow from "../components/TransferRow.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import Button from "../components/ui/Button.jsx";
import { mockTransfers } from "../data/mockTransfers.js";

export default function Transfer({ onDisconnect }) {
  const [transfers, setTransfers] = useState(mockTransfers);

  const queueFiles = (files) => {
    const queued = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      direction: "out",
      status: "queued",
      progress: 0,
    }));
    setTransfers((current) => [...queued, ...current]);
  };

  return (
    <Shell title="Connected">
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-12">
        <section className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-accent-soft p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-6" />
              <div>
                <p className="font-semibold">Other phone</p>
                <StatusPill tone="success">Connected</StatusPill>
              </div>
            </div>
            <Button variant="ghost" className="min-h-10 px-3 text-sm" onClick={onDisconnect}>
              <Unplug className="size-4" /> Disconnect
            </Button>
          </div>
          <DropZone onFiles={queueFiles} />
          <p className="text-center text-sm text-muted">Keep this screen on while files are moving.</p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Transfers</h2>
          {transfers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
              No files yet. Choose files to send them to the other phone.
            </p>
          ) : (
            <ul className="space-y-3">
              {transfers.map((transfer) => (
                <TransferRow key={transfer.id} transfer={transfer} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
