import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, FileText, Smartphone } from "lucide-react";
import Container from "../layout/Container.jsx";
import LinkButton from "../ui/LinkButton.jsx";
import { TOOL_PATH } from "../../config.js";

const PROMISES = ["Free", "No account", "No ads"];

function TransferVisual() {
  const reduceMotion = useReducedMotion();
  const packets = [0, 0.6, 1.2];

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 2xl:max-w-xl 2xl:p-8">
      <div className="flex items-center gap-3 2xl:gap-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-accent 2xl:size-20">
          <Smartphone className="size-7 2xl:size-10" strokeWidth={1.75} />
        </span>

        <div className="relative h-8 flex-1">
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/25" />
          {packets.map((delay) => (
            <motion.span
              key={delay}
              className="absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-accent text-ink 2xl:size-8"
              style={
                reduceMotion ? { left: `${20 + delay * 40}%` } : { left: "0%" }
              }
              animate={
                reduceMotion
                  ? undefined
                  : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }
              }
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                delay,
              }}
            >
              <FileText className="size-3.5 2xl:size-5" />
            </motion.span>
          ))}
        </div>

        <motion.span
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-ink 2xl:size-20"
          animate={reduceMotion ? undefined : { scale: [1, 1, 1.08, 1] }}
          transition={{
            duration: 2,
            ease: "easeOut",
            repeat: Infinity,
            times: [0, 0.75, 0.9, 1],
          }}
        >
          <Smartphone className="size-7 2xl:size-10" strokeWidth={1.75} />
        </motion.span>
      </div>

      <p className="mt-5 text-center text-sm font-medium text-white/60 2xl:text-base">
        Phone to phone, no internet needed
      </p>
    </div>
  );
}

export default function CtaBand() {
  return (
    <section className="bg-surface py-16 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto grid max-w-4xl items-center gap-10 overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:p-16 2xl:max-w-7xl 2xl:gap-20 2xl:p-24"
        >
          {/* Soft glow behind the visual */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/20 blur-3xl 2xl:size-[32rem]"
          />

          <div className="relative space-y-7 2xl:space-y-9">
            <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight md:text-3xl lg:text-5xl 2xl:text-6xl">
              Open the tool and send your first file
            </h2>

            <ul className="flex flex-col gap-4 md:flex-row text-sm font-medium text-white/80 2xl:text-lg">
              {PROMISES.map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <Check
                    className="size-4 text-accent 2xl:size-5"
                    strokeWidth={3}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <LinkButton
                href={TOOL_PATH}
                className="min-h-14 gap-2 bg-accent px-8 text-lg font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 2xl:min-h-16 2xl:px-10 2xl:text-xl"
              >
                Open the tool
                <ArrowUpRight className="size-5 2xl:size-6" />
              </LinkButton>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
