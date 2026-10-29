import { useState } from "react";
import Shell from "../components/layout/Shell.jsx";
import QRDisplay from "../components/QRDisplay.jsx";
import QRScanner from "../components/QRScanner.jsx";
import StepList from "../components/StepList.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import Button from "../components/ui/Button.jsx";

const STEPS = [
  { title: "Scan their code", description: "Point your camera at the code on the sender's screen." },
  { title: "Show your reply", description: "Hold your screen up so the sender can scan your reply code." },
  { title: "Start receiving", description: "Once connected, incoming files appear on the next screen." },
];

// Replace with the compressed WebRTC answer from your connection hook.
const ANSWER_PLACEHOLDER = "offline-share:answer:placeholder";

export default function PairReceive({ onBack, onConnected }) {
  const [offer, setOffer] = useState(null);

  return (
    <Shell title="Receive files" onBack={onBack}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <section className="space-y-5">
          {offer ? <QRDisplay value={ANSWER_PLACEHOLDER} caption="Let the sender scan this reply code" /> : <QRScanner onScan={setOffer} />}
          <div className="flex justify-center">
            <StatusPill tone="active" pulse>
              {offer ? "Waiting for the sender to scan" : "Looking for the sender's code"}
            </StatusPill>
          </div>
        </section>

        <section className="space-y-6">
          <StepList steps={STEPS} current={offer ? 1 : 0} />
          {import.meta.env.DEV && (
            <Button full variant="ghost" onClick={onConnected}>Skip pairing (dev only)</Button>
          )}
        </section>
      </div>
    </Shell>
  );
}
