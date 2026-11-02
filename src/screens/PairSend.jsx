import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QrCode, ScanLine } from "lucide-react";
import QRDisplay from "../components/QRDisplay.jsx";
import QRScanner from "../components/QRScanner.jsx";
import Button from "../components/ui/Button.jsx";
import PairProgress from "../components/pair-progress.jsx";

const STEPS = [
  {
    title: "Show your code",
    description: "Hold your screen up so the other phone can scan it.",
  },
  {
    title: "Scan their reply",
    description:
      "The other phone will show a code back. Scan it with this phone.",
  },
  {
    title: "Start sending",
    description: "Once connected, pick the files you want to send.",
  },
];

// Replace with the compressed WebRTC offer from your connection hook.
const OFFER_PLACEHOLDER = "offline-share:offer:placeholder";

export default function PairSend({ onConnected }) {
  const [scanning, setScanning] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-6 2xl:gap-8">
      {/* Code or camera */}
      <div className="relative aspect-square w-full max-w-72 overflow-hidden rounded-[2rem] border-2 border-paper bg-white p-3 shadow-xl shadow-ink/10 sm:max-w-80 2xl:max-w-[28rem] 2xl:rounded-[2.5rem] 2xl:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scanning ? "scan" : "show"}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="size-full"
          >
            {scanning ? (
              <QRScanner onScan={onConnected} />
            ) : (
              <QRDisplay
                value={OFFER_PLACEHOLDER}
                caption="Ask the other phone to scan this code"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live status */}
      <p className="flex items-center gap-2 text-sm font-semibold text-ink 2xl:text-lg">
        <span className="relative flex size-2.5 2xl:size-3">
          {!reduceMotion && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-strong opacity-60" />
          )}
          <span className="relative inline-flex size-full rounded-full bg-accent-strong" />
        </span>
        {scanning
          ? "Looking for their reply code"
          : "Waiting for the other phone"}
      </p>

      <div className="w-full max-w-sm space-y-4 2xl:max-w-xl 2xl:space-y-5">
        <PairProgress steps={STEPS} current={scanning ? 1 : 0} />

        <Button full onClick={() => setScanning((s) => !s)}>
          {scanning ? (
            <>
              <QrCode className="size-5" /> Show my code again
            </>
          ) : (
            <>
              <ScanLine className="size-5" /> Scan their reply
            </>
          )}
        </Button>

        {import.meta.env.DEV && (
          <Button full variant="ghost" onClick={onConnected}>
            Skip pairing (dev only)
          </Button>
        )}
      </div>
    </div>
  );
}
