import { Ban, Globe, ShieldCheck, Smartphone, WifiOff } from "lucide-react";
import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";

const BENEFITS = [
  { icon: WifiOff, title: "Works offline", description: "Open the site once with internet and it is saved on your phone. After that, no data or router is needed." },
  { icon: Smartphone, title: "Nothing to install", description: "It runs in the browser. Add it to your home screen if you want an icon, or skip that." },
  { icon: Globe, title: "Android and iPhone", description: "Send from Android to iPhone, iPhone to Android, or between two of the same." },
  { icon: Ban, title: "No ads and no tracking", description: "No pop-ups between transfers and no account to sign up for." },
];

export default function Benefits() {
  return (
    <section id="why" className="scroll-mt-20 bg-surface py-16 lg:py-28">
      <Container className="space-y-12">
        <SectionHeading title="Why use it" />
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-4 rounded-3xl bg-accent p-8 lg:col-span-2 lg:p-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-accent">
              <ShieldCheck className="size-7" />
            </span>
            <h3 className="text-2xl font-extrabold">Your files never touch a server</h3>
            <p className="leading-relaxed text-ink/80">
              Files travel directly from one phone to the other over your local network. We do not receive them, store them or see them.
            </p>
          </div>

          <ul className="divide-y divide-line lg:col-span-3">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="leading-relaxed text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
