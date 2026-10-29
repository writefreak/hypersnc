import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button.jsx";

const TIPS = [
  "Both phones must be on the same hotspot or Wi-Fi network. Internet is not needed.",
  "If pairing fails, switch which phone shares the hotspot and try again.",
  "Keep both screens on while files are moving. Locking the screen can pause a transfer.",
  "Allow camera access when asked, so the app can read the other phone's code.",
  "On iPhone, very large videos may fail to save. Send them from iPhone to Android instead.",
];

export default function HelpSheet({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 md:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connection help"
        className="w-full max-w-lg rounded-t-3xl bg-surface p-6 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Connection help</h2>
          <button aria-label="Close help" onClick={onClose} className="rounded-full p-2 hover:bg-ink/5">
            <X className="size-5" />
          </button>
        </div>
        <ul className="space-y-3 text-base leading-relaxed text-muted">
          {TIPS.map((tip) => (
            <li key={tip} className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-accent-strong" />
              {tip}
            </li>
          ))}
        </ul>
        <Button full className="mt-6" onClick={onClose}>Got it</Button>
      </div>
    </div>
  );
}
