import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Navbar from "./landing/Navbar.jsx";

export default function TransferHeader({ offlineReady = true }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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
        aria-label={open ? "Close header" : "Open header"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className="fixed right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] z-30 grid size-12 place-items-center rounded-2xl border border-line bg-paper text-ink shadow-md shadow-ink/10 backdrop-blur-md sm:right-6 2xl:right-10 2xl:top-[calc(env(safe-area-inset-top)+1.5rem)] 2xl:size-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? (
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
    </>
  );
}
