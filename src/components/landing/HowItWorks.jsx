import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { ArrowUpRight, QrCode, ScanLine, Send } from "lucide-react";

const STEPS = [
  {
    icon: QrCode,
    title: "Show your QR code",
    description:
      "Open the tool on the sending phone and tap Send. A QR code appears on the screen.",
  },
  {
    icon: ScanLine,
    title: "Scan and reply",
    description:
      "The other phone scans it with its camera, then shows a reply code of its own.",
  },
  {
    icon: Send,
    title: "Send anything",
    description:
      "Scan the reply code and the phones connect. Pick your files and they move directly.",
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.18 } },
  };

  const card = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 48, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const button = {
    hidden: reduceMotion ? { scale: 1 } : { scale: 0, rotate: -45 },
    show: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 18,
        delay: reduceMotion ? 0 : 0.3,
      },
    },
  };

  const heading = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-paper py-16 lg:py-28">
      <Container className="space-y-12">
        <motion.div
          variants={heading}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <SectionHeading title="How it works">
            Both phones join the same hotspot or Wi-Fi network. After that,
            three steps.
          </SectionHeading>
        </motion.div>

        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-6 md:grid-cols-3 2xl:gap-8"
        >
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={card}
                className="group relative drop-shadow-lg"
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  {/* Card with the notch cut out of it */}
                  <div className="notch-card flex min-h-52 md:min-h-56  flex-col justify-end rounded-3xl bg-ink p-6 text-white 2xl:p-10">
                    <div>
                      <h3 className="mb-2 text-lg font-bold tracking-tight lg:text-xl 2xl:text-2xl">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/70 lg:text-base 2xl:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Button sits in the empty notch, outside the masked card */}
                  <motion.div
                    variants={button}
                    aria-hidden="true"
                    className="absolute right-2 top-2 grid size-12 place-items-center rounded-2xl bg-accent-strong text-white 2xl:right-3 2xl:top-3 2xl:size-14"
                  >
                    <Icon className="size-6 2xl:size-7" strokeWidth={1.75} />

                    {/* <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 2xl:size-6" /> */}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
