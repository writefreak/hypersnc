import { motion, useReducedMotion } from "framer-motion";
import { Download, X } from "lucide-react";
import { formatBytes } from "../lib/format.js";
import FileIcon from "./fileIcon.jsx";

function describe({ direction, status, progress, speed }) {
  const out = direction === "out";
  switch (status) {
    case "queued":
      return "Waiting to send";
    case "active":
      return `${out ? "Sending" : "Receiving"} ${progress}%${speed ? `, ${formatBytes(speed)}/s` : ""}`;
    case "done":
      return out ? "Sent" : "Received";
    case "cancelled":
      return "Cancelled";
    default:
      return "Failed";
  }
}

export default function FileBubble({ transfer, onSave, onCancel }) {
  const reduceMotion = useReducedMotion();
  const out = transfer.direction === "out";
  const active = transfer.status === "active";
  const canCancel = out && (transfer.status === "queued" || active);
  const canSave = !out && transfer.status === "done";

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-[88%] max-w-md space-y-3 rounded-3xl p-4 2xl:max-w-xl 2xl:p-5 ${
        out
          ? "self-end rounded-br-lg bg-accent"
          : "self-start rounded-bl-lg border border-line bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl 2xl:size-14 ${
            out ? "bg-ink text-accent" : "bg-accent-soft text-ink"
          }`}
        >
          <FileIcon name={transfer.name} className="size-5 2xl:size-7" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold 2xl:text-lg">{transfer.name}</p>
          <p
            className={`text-sm 2xl:text-base ${
              transfer.status === "failed"
                ? "font-semibold text-red-700"
                : out
                  ? "text-ink/70"
                  : "text-muted"
            }`}
          >
            {formatBytes(transfer.size)}, {describe(transfer)}
          </p>
        </div>

        {canCancel && (
          <button
            type="button"
            aria-label={`Cancel ${transfer.name}`}
            onClick={() => onCancel(transfer.id)}
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-ink/10"
          >
            <X className="size-5" />
          </button>
        )}
        {canSave && (
          <button
            type="button"
            onClick={() => onSave(transfer)}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85 2xl:min-h-12 2xl:text-base"
          >
            <Download className="size-4" /> Save
          </button>
        )}
      </div>

      {active && (
        <div
          role="progressbar"
          aria-label={`${transfer.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={transfer.progress}
          className={`h-2 overflow-hidden rounded-full ${out ? "bg-ink/15" : "bg-line"}`}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-200 ${out ? "bg-ink" : "bg-accent-strong"}`}
            style={{ width: `${transfer.progress}%` }}
          />
        </div>
      )}
    </motion.li>
  );
}
