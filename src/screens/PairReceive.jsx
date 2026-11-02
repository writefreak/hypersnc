export default function PairReceive({ peer, onConnected }) {
  const reduceMotion = useReducedMotion();
  const { state: camera, request } = useCameraAccess();
  const { status, error, localCode, acceptOffer } = peer; // NEW

  const granted = camera === "granted";
  // CHANGED: derived from the connection instead of a local `offer` state.
  // After a failure the camera returns, so the user can scan again.
  const offered = status !== "idle" && status !== "failed";
  const view = offered ? "show" : granted ? "scan" : "gate";

  // CHANGED: shows real errors and the real preparing state
  const label = error
    ? error
    : status === "preparing"
      ? "Creating your reply code"
      : offered
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
                value={localCode} // CHANGED: the real answer code
                caption="Let the sender scan this reply code"
              />
            )}
            {view === "scan" && <QRScanner onScan={acceptOffer} />}{" "}
            {/* CHANGED */}
            {view === "gate" && (
              <CameraGate state={camera} onRequest={request} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live status */}
      <p className="flex items-center gap-2 text-sm font-semibold text-ink 2xl:text-lg">
        <span className="relative flex size-2.5 2xl:size-3">
          {!reduceMotion && (offered || granted) && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-strong opacity-60" />
          )}
          <span
            className={`relative inline-flex size-full rounded-full ${
              offered || granted ? "bg-accent-strong" : "bg-ink/30"
            }`}
          />
        </span>
        {label}
      </p>

      <div className="w-full max-w-sm space-y-4 2xl:max-w-xl 2xl:space-y-5">
        <PairProgress steps={STEPS} current={offered ? 1 : 0} />

        {import.meta.env.DEV && (
          <Button full variant="ghost" onClick={onConnected}>
            Skip pairing (dev only)
          </Button>
        )}
      </div>
    </div>
  );
}
