import { useState } from "react";
import { QrCode, ScanLine } from "lucide-react";
import Shell from "../components/layout/Shell.jsx";
import QRDisplay from "../components/QRDisplay.jsx";
import QRScanner from "../components/QRScanner.jsx";
import StepList from "../components/StepList.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import Button from "../components/ui/Button.jsx";

const STEPS = [
  { title: "Show your code", description: "Hold your screen up so the other phone can scan it." },
  { title: "Scan their reply", description: "The other phone will show a code back. Scan it with this phone." },
  { title: "Start sending", description: "Once connected, pick the files you want to send." },
];

// Replace with the compressed WebRTC offer from your connection hook.
const OFFER_PLACEHOLDER = "offline-share:offer:placeholder";

export default function PairSend({ onBack, onConnected }) {
  const [scanning, setScanning] = useState(false);

  return (
    <Shell title="Send files" onBack={onBack}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <section className="space-y-5">
          {scanning ? <QRScanner onScan={onConnected} /> : <QRDisplay value={OFFER_PLACEHOLDER} caption="Ask the other phone to scan this code" />}
          <div className="flex justify-center">
            <StatusPill tone="active" pulse>
              {scanning ? "Looking for their reply code" : "Waiting for the other phone"}
            </StatusPill>
          </div>
        </section>

        <section className="space-y-6">
          <StepList steps={STEPS} current={scanning ? 1 : 0} />
          <Button full onClick={() => setScanning((s) => !s)}>
            {scanning ? <><QrCode className="size-5" /> Show my code again</> : <><ScanLine className="size-5" /> Scan their reply</>}
          </Button>
          {import.meta.env.DEV && (
            <Button full variant="ghost" onClick={onConnected}>Skip pairing (dev only)</Button>
          )}
        </section>
      </div>
    </Shell>
  );
}
