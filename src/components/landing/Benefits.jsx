import {
  Ban,
  Globe,
  ShieldCheck,
  Smartphone,
  WifiOff,
  Server,
} from "lucide-react";
import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { motion, useReducedMotion } from "framer-motion";

const BENEFITS = [
  {
    icon: WifiOff,
    title: "Works offline",
    description:
      "Open the site once with internet and it is saved on your phone. After that, no data or router is needed.",
  },
  {
    icon: Smartphone,
    title: "Nothing to install",
    description:
      "It runs in the browser. Add it to your home screen if you want an icon, or skip that.",
  },
  {
    icon: Globe,
    title: "Android and iPhone",
    description:
      "Send from Android to iPhone, iPhone to Android, or between two of the same.",
  },
  {
    icon: Ban,
    title: "No ads and no tracking",
    description: "No pop-ups between transfers and no account to sign up for.",
  },
];

function DirectTransfer() {
  const reduceMotion = useReducedMotion();
  const packets = [0, 0.6, 1.2];

  return (
    <div className="rounded-2xl bg-ink/10 p-4 2xl:p-6">
      {/* The server we never use */}
      <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/50 2xl:mb-5 2xl:text-sm">
        <Server className="size-3.5 2xl:size-4" />
        <span className="line-through">Server</span>
      </div>

      {/* Phone to phone */}
      <div className="flex items-center gap-3 2xl:gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-accent 2xl:size-14">
          <Smartphone className="size-6 2xl:size-7" />
        </span>

        <div className="relative h-6 flex-1">
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-ink/30" />

          {packets.map((delay) => (
            <motion.span
              key={delay}
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink 2xl:size-3.5"
              style={
                reduceMotion ? { left: `${20 + delay * 40}%` } : { left: "0%" }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }
              }
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
              }}
            />
          ))}
        </div>

        <motion.span
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-accent 2xl:size-14"
          animate={reduceMotion ? undefined : { scale: [1, 1, 1.08, 1] }}
          transition={{
            duration: 1.8,
            ease: "easeOut",
            repeat: Infinity,
            times: [0, 0.75, 0.9, 1],
          }}
        >
          <Smartphone className="size-6 2xl:size-7" />
        </motion.span>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="why" className="scroll-mt-20 bg-surface py-16 lg:py-28">
      <Container className="space-y-12">
        <SectionHeading title="Why use it" />
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="flex flex-col justify-between gap-8 rounded-3xl bg-accent p-8 lg:col-span-2 lg:p-10 2xl:p-12">
            <div className="space-y-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-accent 2xl:size-16">
                <ShieldCheck className="size-7 2xl:size-8" />
              </span>
              <h3 className="text-2xl font-extrabold 2xl:text-3xl">
                Your files never touch a server
              </h3>
              <p className="leading-relaxed text-ink/80 2xl:text-lg">
                Files travel directly from one phone to the other over your
                local network. We do not receive them, store them or see them.
              </p>
            </div>

            <DirectTransfer />
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
