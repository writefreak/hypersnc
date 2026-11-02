import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Menu, Send, X } from "lucide-react";
import Navbar from "../components/landing/Navbar.jsx";
import PairSend from "./PairSend.jsx";
import PairReceive from "./PairReceive.jsx";

export default function Home({
  screen = "home",
  peer, // NEW
  onSend,
  onReceive,
  onConnected,
  offlineReady = true,
}) {
  const [headerOpen, setHeaderOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // "home" is the starting state, which shows the Send tab
  const tab = screen === "receive" ? "receive" : "send";

  useEffect(() => {
    if (!headerOpen) return;
    const onKey = (e) => e.key === "Escape" && setHeaderOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [headerOpen]);

  const TABS = [
    { id: "send", label: "Send", icon: Send, onSelect: onSend },
    { id: "receive", label: "Receive", icon: Download, onSelect: onReceive },
  ];

  return (
    <main className="relative flex min-h-dvh flex-col bg-paper text-ink">
      {/* Existing header, opened by the floating button */}
      {headerOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setHeaderOpen(false)}
            className="fixed inset-0 z-10 bg-ink/30 backdrop-blur-sm"
          />
          <div className="[&>header]:top-16!">
            <Navbar />
          </div>
        </>
      )}

      {/* Only the active screen is mounted, so the camera stops when you leave Receive */}
      <div className="flex flex-1 items-start justify-center px-5 pb-32 pt-24 2xl:pb-44">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={tab}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md 2xl:max-w-xl"
          >
            {tab === "send" ? (
              <PairSend peer={peer} onBack={onSend} onConnected={onConnected} /> // CHANGED
            ) : (
              <PairReceive
                peer={peer}
                onBack={onSend}
                onConnected={onConnected}
              /> // CHANGED
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Floating header button, top right */}
      <motion.button
        type="button"
        aria-label={headerOpen ? "Close header" : "Open header"}
        aria-expanded={headerOpen}
        onClick={() => setHeaderOpen((v) => !v)}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className="fixed right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] z-30 grid size-12 place-items-center rounded-2xl border border-line bg-paper text-ink shadow-md shadow-ink/10 backdrop-blur-md sm:right-6 2xl:right-10 2xl:top-[calc(env(safe-area-inset-top)+1.5rem)] 2xl:size-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={headerOpen ? "close" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {headerOpen ? (
              <X className="size-5 2xl:size-7" />
            ) : (
              <Menu className="size-5 2xl:size-7" />
            )}
          </motion.span>
        </AnimatePresence>

        {offlineReady && (
          <>
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 size-3.5 rounded-full bg-accent-strong ring-2 ring-paper"
            />
            <span className="sr-only">Ready for offline use</span>
          </>
        )}
      </motion.button>

      {/* Tab controls */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] 2xl:pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div
          role="tablist"
          aria-label="Choose what to do"
          className="pointer-events-auto mx-auto flex max-w-md gap-1 rounded-2xl border border-line bg-paper/80 p-1.5 shadow-lg shadow-ink/10 backdrop-blur-md 2xl:max-w-xl 2xl:p-2"
        >
          {TABS.map(({ id, label, icon: Icon, onSelect }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={onSelect}
                className={`relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors 2xl:min-h-14 2xl:text-lg ${
                  isActive ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="home-tab-pill"
                    className="absolute inset-0 rounded-xl bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="size-4 2xl:size-5" />
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
