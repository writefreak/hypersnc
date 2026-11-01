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
    icon: Smartphone,
    title: "Your files never touch a server",
    description:
      " Files travel directly from one phone to the other over your local network.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    description:
      "Open the site once with internet and it is saved on your phone. After that, no data or router is needed.",
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
    <div className="w-full rounded-2xl bg-ink/5 p-4 lg:max-w-sm 2xl:max-w-md 2xl:p-6">
      {/* The server we never use */}
      <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-semibold text-ink/50 2xl:mb-5 2xl:text-sm">
        <Server className="size-3.5 2xl:size-4" />
        <span className="line-through">Server</span>
      </div>
    </div>
  );
}

function NotchButton({ icon: Icon }) {
  return (
    <div
      aria-hidden="true"
      className="absolute right-2 top-2 grid size-12 place-items-center rounded-2xl bg-accent-strong text-white transition-transform duration-300 group-hover:scale-105 2xl:right-3 2xl:top-3 2xl:size-14"
    >
      <Icon className="size-6 2xl:size-7" strokeWidth={1.75} />
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="why" className="scroll-mt-20 bg-[#E9EEFB] py-16 lg:py-28">
      <Container className="space-y-12">
        <SectionHeading title="Why use this tool?" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
          {/* Benefit cards */}
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative drop-shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="notch-card flex min-h-52 md:min-h-56 flex-col justify-start pt-20 rounded-3xl bg-white p-6 text-ink md:min-h-56 2xl:min-h-64 2xl:p-10">
                  <div>
                    <h3 className="mb-2 text-lg font-bold tracking-tight lg:text-xl 2xl:text-2xl">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted md:text-base 2xl:text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                <NotchButton icon={Icon} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
