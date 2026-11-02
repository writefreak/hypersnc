import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Download,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  List,
  Menu,
  Package,
  Plus,
  X,
} from "lucide-react";
import Navbar from "../components/landing/Navbar.jsx";
import useTransfer from "../hooks/useTransfer";
import useWakeLock from "../hooks/useWakeLock";
import { saveFile } from "../lib/file-transfer.js";
import { fileKind, formatBytes } from "../lib/format.js";

const ICONS = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  doc: FileText,
  apk: Package,
  other: File,
};
const FILTERS = [
  { id: "all", label: "All", Icon: List },
  { id: "out", label: "Outgoing", Icon: ArrowUpRight },
  { id: "in", label: "Incoming", Icon: ArrowDownLeft },
];
const floatingButton =
  "fixed top-[calc(env(safe-area-inset-top)+0.75rem)] z-30 grid size-12 place-items-center rounded-2xl border border-line bg-paper text-ink shadow-md shadow-ink/10 backdrop-blur-md hover:border-ink 2xl:top-[calc(env(safe-area-inset-top)+1.5rem)] 2xl:size-16";
const addButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-base font-semibold transition-colors hover:bg-accent-strong active:scale-[0.98] disabled:opacity-50 2xl:min-h-14 2xl:text-lg";

function statusText({ status, progress, speed }) {
  if (status === "queued") return "Waiting";
  if (status === "active")
    return `${progress}%${speed ? `, ${formatBytes(speed)}/s` : ""}`;
  if (status === "done") return "Complete";
  return status === "cancelled" ? "Cancelled" : "Failed";
}

function FloatingControls({ onBack }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const tap = reduceMotion ? undefined : { scale: 0.92 };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-ink/30 backdrop-blur-sm"
          />
          <div className="[&>header]:top-16!">
            <Navbar />
          </div>
        </>
      )}
      <motion.button
        type="button"
        aria-label="Back and disconnect"
        onClick={onBack}
        whileTap={tap}
        className={`${floatingButton} left-4 sm:left-6 2xl:left-10`}
      >
        <ChevronLeft className="size-6 2xl:size-8" />
      </motion.button>
      <motion.button
        type="button"
        aria-label={open ? "Close header" : "Open header"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileTap={tap}
        className={`${floatingButton} right-4 sm:right-6 2xl:right-10`}
      >
        {open ? (
          <X className="size-5 2xl:size-7" />
        ) : (
          <Menu className="size-5 2xl:size-7" />
        )}
      </motion.button>
    </>
  );
}

function Filters({ value, onChange, counts }) {
  return (
    <div
      role="tablist"
      aria-label="Filter files"
      className="flex gap-1 rounded-2xl border border-line bg-white p-1.5 2xl:p-2"
    >
      {FILTERS.map(({ id, label, Icon }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-label={label}
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`relative flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors 2xl:min-h-14 2xl:text-lg ${selected ? "text-white" : "text-muted hover:text-ink"}`}
          >
            {selected && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative z-10 size-5 md:hidden" />
            <span className="relative z-10 hidden md:inline">{label}</span>
            <span
              className={`relative z-10 text-xs ${selected ? "text-accent" : ""}`}
            >
              {counts[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FileRow({ transfer: t, justSaved, onSave, onCancel, reduceMotion }) {
  const out = t.direction === "out";
  const active = t.status === "active";
  const canSave = !out && t.status === "done";
  const canCancel = out && (t.status === "queued" || active);
  const Icon = ICONS[fileKind(t.name)];
  const DirectionIcon = out ? ArrowUpRight : ArrowDownLeft;
  const Tag = canSave ? "button" : "div";
  const tagProps = canSave ? { type: "button", onClick: () => onSave(t) } : {};

  const status = (
    <span
      className={`inline-flex items-center gap-1.5 tabular-nums ${t.status === "failed" ? "font-semibold text-red-700" : "text-muted"}`}
    >
      <DirectionIcon className="size-3.5 shrink-0" />
      {statusText(t)}
    </span>
  );

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <Tag
        {...tagProps}
        className={`group flex w-full items-center gap-4 px-4 py-3.5 text-left 2xl:px-6 2xl:py-5 ${canSave ? "transition-colors hover:bg-ink/5 active:bg-ink/10" : ""}`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-paper 2xl:size-12">
          <Icon className="size-5 text-ink/80 2xl:size-6" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold 2xl:text-lg">
            {t.name}
          </span>
          <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted md:hidden">
            {formatBytes(t.size)}, {status}
          </span>
        </span>

        <span className="hidden w-24 shrink-0 text-right text-sm tabular-nums text-muted md:block 2xl:text-base">
          {formatBytes(t.size)}
        </span>
        <span className="hidden w-44 shrink-0 text-sm md:block 2xl:text-base">
          {status}
        </span>

        <span className="shrink-0 text-right md:w-20">
          {canSave && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:underline 2xl:text-base">
              {justSaved ? (
                <Check className="size-4" />
              ) : (
                <Download className="size-4" />
              )}
              {justSaved ? "Saved" : "Save"}
            </span>
          )}
          {canCancel && (
            <button
              type="button"
              aria-label={`Cancel ${t.name}`}
              onClick={() => onCancel(t.id)}
              className="min-h-9 rounded-lg px-2 text-sm font-semibold text-muted hover:bg-ink/5 hover:text-ink 2xl:text-base"
            >
              Cancel
            </button>
          )}
        </span>
      </Tag>

      {active && (
        <span
          role="progressbar"
          aria-label={`${t.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={t.progress}
          className="absolute inset-x-0 bottom-0 h-0.5 bg-line"
        >
          <span
            className="block h-full bg-accent-strong transition-[width] duration-200"
            style={{ width: `${t.progress}%` }}
          />
        </span>
      )}
    </motion.li>
  );
}

export default function Transfer({ channel, onDisconnect }) {
  const { transfers, addFiles, cancel, canSend } = useTransfer(channel);
  const wakeLocked = useWakeLock(canSend);
  const reduceMotion = useReducedMotion();
  const inputRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [dragging, setDragging] = useState(false);
  const [justSaved, setJustSaved] = useState(null);

  const activeList = transfers.filter((t) => t.status === "active");
  const done = transfers.filter((t) => t.status === "done");
  const sentCount = done.filter((t) => t.direction === "out").length;
  const receivedCount = done.filter((t) => t.direction === "in").length;
  const moved = done.reduce((sum, t) => sum + t.size, 0);
  const speed = activeList.reduce((sum, t) => sum + (t.speed || 0), 0);

  const counts = {
    all: transfers.length,
    out: transfers.filter((t) => t.direction === "out").length,
    in: transfers.filter((t) => t.direction === "in").length,
  };
  // Newest first, like a log
  const rows = (
    filter === "all"
      ? transfers
      : transfers.filter((t) => t.direction === filter)
  )
    .slice()
    .reverse();
  const pick = () => inputRef.current?.click();

  const subtitle = activeList.length
    ? `${activeList.length} in progress${speed ? `, ${formatBytes(speed)}/s` : ""}`
    : canSend
      ? `Connected, ${sentCount} sent, ${receivedCount} received, ${formatBytes(moved)} moved`
      : "Not connected";

  // Gives this screen its own history entry, so the back gesture returns to pairing
  useEffect(() => {
    if (window.history.state?.screen !== "transfer")
      window.history.pushState({ screen: "transfer" }, "");
    window.addEventListener("popstate", onDisconnect);
    return () => window.removeEventListener("popstate", onDisconnect);
  }, [onDisconnect]);

  const handleSave = async (transfer) => {
    await saveFile(transfer);
    setJustSaved(transfer.id);
    setTimeout(() => setJustSaved(null), 1800);
  };

  const handleDragOver = (e) => {
    if (!canSend || !e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    setDragging(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={(e) =>
        !e.currentTarget.contains(e.relatedTarget) && setDragging(false)
      }
      onDrop={handleDrop}
      className="flex min-h-dvh flex-col bg-paper text-ink"
    >
      <FloatingControls onBack={() => window.history.back()} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pb-32 pt-24 md:max-w-3xl md:pb-16 2xl:max-w-5xl 2xl:gap-8 2xl:pb-24 2xl:pt-32">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight 2xl:text-5xl">
            Transfers
          </h1>
          <p className="flex items-center gap-2 text-xs text-muted md:text-sm 2xl:text-lg">
            <span className="relative flex size-2 shrink-0 2xl:size-2.5">
              {activeList.length > 0 && (
                <span className="absolute inline-flex size-full rounded-full bg-accent-strong opacity-60 motion-safe:animate-ping" />
              )}
              <span
                className={`relative inline-flex size-full rounded-full ${canSend ? "bg-accent-strong" : "bg-ink/30"}`}
              />
            </span>
            {subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="md:w-96 2xl:w-[32rem]">
            <Filters value={filter} onChange={setFilter} counts={counts} />
          </div>
          <button
            type="button"
            onClick={pick}
            disabled={!canSend}
            className={`${addButton} hidden md:inline-flex`}
          >
            <Plus className="size-5" /> Add files
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {transfers.length === 0 ? (
            <div className="flex flex-col items-center gap-5 px-6 py-16 text-center 2xl:py-24">
              <div className="space-y-1">
                <p className="text-lg font-semibold 2xl:text-2xl">
                  No transfers yet
                </p>
                <p className="max-w-sm text-xs text-muted md:text-base 2xl:max-w-md 2xl:text-lg">
                  Choose files to send them to the other phone, or drop them
                  anywhere on this screen. Incoming files are listed here too.
                </p>
              </div>
            </div>
          ) : rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-xs text-muted md:text-base 2xl:text-lg">
              Nothing in this view.
            </p>
          ) : (
            <>
              <div className="hidden gap-4 border-b border-line px-4 py-2.5 text-sm text-muted md:flex 2xl:px-6 2xl:text-base">
                <span className="flex-1 pl-14 2xl:pl-16">Name</span>
                <span className="w-24 text-right">Size</span>
                <span className="w-44">Status</span>
                <span className="w-20" />
              </div>
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {rows.map((transfer) => (
                    <FileRow
                      key={transfer.id}
                      transfer={transfer}
                      justSaved={justSaved === transfer.id}
                      onSave={handleSave}
                      onCancel={cancel}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>
      </main>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />

      {/* Phone only: the Add files button sits where the thumb is */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-paper via-paper/90 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-10 md:hidden">
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={pick}
            disabled={!canSend}
            className={`${addButton} w-full`}
          >
            <Plus className="size-5" /> Add files
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            {wakeLocked
              ? "Your screen will stay on while connected."
              : "Keep this screen on while files are moving."}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-3 z-40 grid place-items-center rounded-2xl border-2 border-dashed border-ink/40 bg-paper/85 backdrop-blur-sm"
          >
            <p className="text-xl font-semibold 2xl:text-3xl">
              Drop files to send
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
