import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, CameraOff } from "lucide-react";
import QRDisplay from "../components/QRDisplay.jsx";
import QRScanner from "../components/QRScanner.jsx";
import Button from "../components/ui/Button.jsx";
import PairProgress from "../components/pair-progress.jsx";

const STEPS = [
  {
    title: "Scan their code",
    description: "Point your camera at the code on the sender's screen.",
  },
  {
    title: "Show your reply",
    description: "Hold your screen up so the sender can scan your reply code.",
  },
  {
    title: "Start receiving",
    description: "Once connected, incoming files appear on the next screen.",
  },
];

// Replace with the compressed WebRTC answer from your connection hook.
const ANSWER_PLACEHOLDER = "offline-share:answer:placeholder";

const GATE_COPY = {
  checking: null,
  prompt: {
    icon: Camera,
    title: "Allow camera access",
    text: "The camera is only used to scan the sender's code. Nothing is recorded or uploaded.",
    action: "Allow camera",
  },
  denied: {
    icon: CameraOff,
    title: "Camera is blocked",
    text: "Tap the lock icon in your browser's address bar, set Camera to Allow, then try again.",
    action: "Try again",
  },
  nocamera: {
    icon: CameraOff,
    title: "No camera found",
    text: "This device has no camera the browser can use.",
    action: "Try again",
  },
  unsupported: {
    icon: CameraOff,
    title: "Camera unavailable",
    text: "The browser only allows camera access on secure (https) pages. Open the site using its https address.",
    action: null,
  },
  error: {
    icon: CameraOff,
    title: "Could not start the camera",
    text: "Another app may be using it. Close other apps that use the camera and try again.",
    action: "Try again",
  },
};

function useCameraAccess() {
  const [state, setState] = useState("checking");

  useEffect(() => {
    let status;
    let cancelled = false;

    async function check() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("unsupported");
        return;
      }
      try {
        status = await navigator.permissions.query({ name: "camera" });
        if (cancelled) return;
        const sync = () => setState(status.state);
        sync();
        status.onchange = sync;
      } catch {
        // Some browsers (older iOS Safari) can't query camera permission
        if (!cancelled) setState("prompt");
      }
    }

    check();
    return () => {
      cancelled = true;
      if (status) status.onchange = null;
    };
  }, []);

  const request = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      // Release it straight away so QRScanner can open its own stream
      stream.getTracks().forEach((t) => t.stop());
      setState("granted");
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        setState("denied");
      } else if (
        err.name === "NotFoundError" ||
        err.name === "OverconstrainedError"
      ) {
        setState("nocamera");
      } else {
        setState("error");
      }
    }
  }, []);

  return { state, request };
}

function CameraGate({ state, onRequest }) {
  const copy = GATE_COPY[state];
  if (!copy) return <div className="size-full" />;
  const Icon = copy.icon;

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 px-4 text-center 2xl:gap-5">
      <span className="grid size-14 place-items-center rounded-2xl bg-ink text-accent 2xl:size-20">
        <Icon className="size-7 2xl:size-10" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <p className="text-base font-bold 2xl:text-2xl">{copy.title}</p>
        <p className="text-xs leading-relaxed text-muted 2xl:text-lg">
          {copy.text}
        </p>
      </div>
      {copy.action && (
        <Button onClick={onRequest}>
          <Camera className="size-5" /> {copy.action}
        </Button>
      )}
    </div>
  );
}

export default function PairReceive({ onConnected }) {
  const [offer, setOffer] = useState(null);
  const reduceMotion = useReducedMotion();
  const { state: camera, request } = useCameraAccess();

  const granted = camera === "granted";
  const view = offer ? "show" : granted ? "scan" : "gate";

  const status = offer
    ? "Waiting for the sender to scan"
    : granted
      ? "Looking for the sender's code"
      : "Camera access needed";

  return (
    <div className="flex flex-col items-center gap-6 2xl:gap-8">
      {/* Camera, reply code, or permission prompt */}
      <div className="relative aspect-square w-full max-w-72 overflow-hidden rounded-[2rem] border-2 border-paper bg-white p-3 shadow-xl shadow-ink/10 sm:max-w-80 2xl:max-w-[28rem] 2xl:rounded-[2.5rem] 2xl:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="size-full"
          >
            {view === "show" && (
              <QRDisplay
                value={ANSWER_PLACEHOLDER}
                caption="Let the sender scan this reply code"
              />
            )}
            {view === "scan" && <QRScanner onScan={setOffer} />}
            {view === "gate" && (
              <CameraGate state={camera} onRequest={request} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live status */}
      <p className="flex items-center gap-2 text-sm font-semibold text-ink 2xl:text-lg">
        <span className="relative flex size-2.5 2xl:size-3">
          {!reduceMotion && (offer || granted) && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-strong opacity-60" />
          )}
          <span
            className={`relative inline-flex size-full rounded-full ${
              offer || granted ? "bg-accent-strong" : "bg-ink/30"
            }`}
          />
        </span>
        {status}
      </p>

      <div className="w-full max-w-sm space-y-4 2xl:max-w-xl 2xl:space-y-5">
        <PairProgress steps={STEPS} current={offer ? 1 : 0} />

        {import.meta.env.DEV && (
          <Button full variant="ghost" onClick={onConnected}>
            Skip pairing (dev only)
          </Button>
        )}
      </div>
    </div>
  );
}
