import { useEffect, useState } from "react"; // CHANGED: added useEffect
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QrCode, RotateCw, ScanLine } from "lucide-react"; // CHANGED: added RotateCw
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

// NEW: picks the status text from the connection state
function statusLabel({ status, error }, scanning) {
  if (error) return error;
  if (status === "preparing") return "Creating your code";
  if (status === "connecting") return "Connecting";
  return scanning
    ? "Looking for their reply code"
    : "Waiting for the other phone";
}

// CHANGED: receives `peer` from App. onConnected now only serves the dev skip button
export default function PairSend({ peer, onConnected }) {
  const [scanning, setScanning] = useState(false);
  const reduceMotion = useReducedMotion();
  const { createOffer, acceptAnswer, localCode, status } = peer; // NEW

  // NEW: build the offer code as soon as this screen opens
  useEffect(() => {
    createOffer();
  }, [createOffer]);

  // NEW: after a failure, return to the QR view and build a fresh code
  const retry = () => {
    setScanning(false);
    createOffer();
  };

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
              <QRScanner onScan={acceptAnswer} /> // CHANGED: reads the receiver's reply code
            ) : (
              <QRDisplay
                value={localCode} // CHANGED: the real offer instead of the placeholder
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
        {statusLabel(peer, scanning)} {/* CHANGED: was a fixed ternary */}
      </p>

      <div className="w-full max-w-sm space-y-4 2xl:max-w-xl 2xl:space-y-5">
        <PairProgress steps={STEPS} current={scanning ? 1 : 0} />

        {/* CHANGED: disabled until the code exists, and retries after a failure */}
        <Button
          full
          disabled={!localCode && status !== "failed"}
          onClick={status === "failed" ? retry : () => setScanning((s) => !s)}
        >
          {status === "failed" ? (
            <>
              <RotateCw className="size-5" /> Try again
            </>
          ) : scanning ? (
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
