import { Download, File, FileAudio, FileImage, FileText, FileVideo, Package } from "lucide-react";
import { fileKind, formatBytes } from "../lib/format.js";
import ProgressBar from "./ui/ProgressBar.jsx";
import StatusPill from "./ui/StatusPill.jsx";
import Button from "./ui/Button.jsx";

const ICONS = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  doc: FileText,
  apk: Package,
  other: File,
};

function statusPill(transfer) {
  const incoming = transfer.direction === "in";
  switch (transfer.status) {
    case "active":
      return <StatusPill tone="active" pulse>{incoming ? "Receiving" : "Sending"}</StatusPill>;
    case "done":
      return <StatusPill tone="success">{incoming ? "Received" : "Sent"}</StatusPill>;
    case "failed":
      return <StatusPill tone="danger">Failed</StatusPill>;
    default:
      return <StatusPill>Queued</StatusPill>;
  }
}

export default function TransferRow({ transfer, onSave }) {
  const Icon = ICONS[fileKind(transfer.name)];
  const canSave = transfer.direction === "in" && transfer.status === "done";

  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{transfer.name}</p>
          <p className="text-sm text-muted">{formatBytes(transfer.size)}</p>
        </div>
        {statusPill(transfer)}
      </div>

      {transfer.status === "active" && (
        <div className="mt-3">
          <ProgressBar value={transfer.progress} label={`${transfer.name} progress`} />
        </div>
      )}

      {canSave && (
        <Button variant="secondary" full className="mt-3 min-h-11" onClick={() => onSave?.(transfer)}>
          <Download className="size-4" /> Save to phone
        </Button>
      )}
    </li>
  );
}
