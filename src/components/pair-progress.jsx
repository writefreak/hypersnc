import { motion, useReducedMotion } from "framer-motion";

export default function PairProgress({ steps, current }) {
  const reduceMotion = useReducedMotion();
  const step = steps[current];

  return (
    <div className="w-full space-y-3 2xl:space-y-4">
      <div className="flex gap-1.5 2xl:gap-2">
        {steps.map((s, i) => (
          <span
            key={s.title}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10 2xl:h-2"
          >
            <motion.span
              className="block h-full origin-left rounded-full bg-accent-strong"
              initial={false}
              animate={{ scaleX: i <= current ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
            />
          </span>
        ))}
      </div>

      <div className="text-left">
        <p className="text-sm font-bold 2xl:text-xl">
          {current + 1}. {step.title}
        </p>
        <p className="text-sm leading-relaxed text-muted 2xl:text-lg">
          {step.description}
        </p>
      </div>
    </div>
  );
}
