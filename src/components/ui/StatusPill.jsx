const TONES = {
  neutral: "bg-line/60 text-muted",
  active: "bg-accent-soft text-ink",
  success: "bg-accent text-ink",
  danger: "bg-red-100 text-red-800",
};

export default function StatusPill({ tone = "neutral", pulse = false, children }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${TONES[tone]}`}>
      {pulse && <span className="size-2 animate-pulse rounded-full bg-accent-strong motion-reduce:animate-none" />}
      {children}
    </span>
  );
}
