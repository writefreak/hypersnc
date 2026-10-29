import { Download, Send, WifiOff } from "lucide-react";
import Shell from "../components/layout/Shell.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";

function ActionCard({ icon: Icon, title, description, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-3xl p-5 text-left transition-colors lg:flex-col lg:items-start lg:gap-8 lg:p-8 ${
        primary ? "bg-accent hover:bg-accent-strong" : "border border-line bg-surface hover:border-ink"
      }`}
    >
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${primary ? "bg-ink text-accent" : "bg-accent-soft"}`}>
        <Icon className="size-7" />
      </span>
      <span>
        <span className="block text-xl font-bold">{title}</span>
        <span className={`block text-sm leading-relaxed ${primary ? "text-ink/75" : "text-muted"}`}>{description}</span>
      </span>
    </button>
  );
}

export default function Home({ onSend, onReceive, offlineReady = true }) {
  return (
    <Shell title="Offline Share">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <section className="space-y-4">
          {offlineReady && (
            <StatusPill tone="active">
              <WifiOff className="size-4" /> Ready for offline use
            </StatusPill>
          )}
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            Send files to any phone without internet
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-muted lg:text-lg">
            Pair two phones with a QR code, then move photos, videos, PDFs, music and APK files straight from one to the other. It works on Android and iPhone.
          </p>
        </section>

        <section className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <ActionCard primary icon={Send} title="Send" description="Show a code for the other phone to scan." onClick={onSend} />
          <ActionCard icon={Download} title="Receive" description="Scan the code on the sender's screen." onClick={onReceive} />
        </section>
      </div>
    </Shell>
  );
}
