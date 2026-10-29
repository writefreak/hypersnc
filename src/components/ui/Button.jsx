const VARIANTS = {
  primary: "bg-accent text-ink hover:bg-accent-strong active:bg-accent-strong",
  dark: "bg-ink text-white hover:bg-ink/85",
  secondary: "bg-surface text-ink border border-line hover:border-ink",
  ghost: "text-ink hover:bg-ink/5",
};

export function buttonClasses({ variant = "primary", full = false, className = "" } = {}) {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${full ? "w-full" : ""} ${className}`;
}

export default function Button({ variant, full, className, children, ...props }) {
  return (
    <button type="button" className={buttonClasses({ variant, full, className })} {...props}>
      {children}
    </button>
  );
}
