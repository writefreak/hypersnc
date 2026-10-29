import { WifiOff } from "lucide-react";
import Container from "../layout/Container.jsx";
import LinkButton from "../ui/LinkButton.jsx";
import StatusPill from "../ui/StatusPill.jsx";
import PhoneMockup from "./PhoneMockup.jsx";
import { TOOL_PATH } from "../../config.js";

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div className="space-y-6">
          <StatusPill tone="active">
            <WifiOff className="size-4" /> Works with no internet
          </StatusPill>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Send files between any two phones without internet
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted 2xl:text-xl">
            Photos, videos, PDFs, music and APK files go straight from one phone to the other. There is no app to install, no account to create and no ads.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href={TOOL_PATH} className="min-h-14 px-8 text-lg">Open the tool</LinkButton>
            <LinkButton href="#how-it-works" variant="secondary" className="min-h-14 px-8 text-lg">See how it works</LinkButton>
          </div>
          <p className="text-sm text-muted">Free to use. Works on Android and iPhone.</p>
        </div>
        <PhoneMockup />
      </Container>
    </section>
  );
}
