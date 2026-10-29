const VARIANTS = {
  primary: "bg-accent text-ink hover:bg-accent-strong active:bg-accent-strong",
  secondary: "bg-surface text-ink border border-line hover:border-ink",
  ghost: "text-ink hover:bg-ink/5",
};

export default function Button({ variant = "primary", full = false, className = "", children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
