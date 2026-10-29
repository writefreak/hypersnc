import { Check } from "lucide-react";

export default function StepList({ steps, current }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.title} className="flex gap-4">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done || active ? "bg-accent text-ink" : "bg-line text-muted"
              }`}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <div className={active || done ? "" : "opacity-60"}>
              <p className="font-semibold">{step.title}</p>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
