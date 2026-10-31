import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Share2, X } from "lucide-react";
import Container from "../layout/Container.jsx";
import { TOOL_PATH } from "../../config.js";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why use it", href: "#why" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [active, setActive] = useState(LINKS[0].href);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLink = (href) => {
    setActive(href);
    setOpen(false);
  };

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none sticky top-0 z-20 pt-3 2xl:pt-6"
    >
      <Container>
        <div className="pointer-events-auto relative ">
          {/* Floating bar */}
          <div className="flex h-16 mx-auto md:w-4xl items-center justify-between gap-4 rounded-2xl border bg-paper/70 border-line py-2 px-2 2xl:px-4 shadow-lg shadow-ink/5 backdrop-blur-md 2xl:h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.5 text-lg font-extrabold text-ink 2xl:text-xl"
            >
              <span className="grid size-9 place-items-center rounded-full bg-accent-strong text-white 2xl:size-10">
                <Share2 className="size-4 2xl:size-5" strokeWidth={2.5} />
              </span>
              Offline Share
            </a>

            {/* Desktop pill nav */}
            <nav className="hidden items-center gap-1 rounded-2xl bg-ink/5 p-1.5 md:flex">
              {LINKS.map((link) => {
                const isActive = active === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLink(link.href)}
                    className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors 2xl:px-5 2xl:py-2.5 2xl:text-base ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl bg-white shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <motion.a
                href={TOOL_PATH}
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="hidden min-h-11 items-center gap-1.5 rounded-xl bg-accent-strong px-5 text-sm font-semibold text-white shadow-sm sm:inline-flex 2xl:min-h-12 2xl:px-6 2xl:text-base"
              >
                Open the tool
                <ArrowUpRight className="size-4" />
              </motion.a>

              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="grid size-11 place-items-center rounded-xl bg-ink/5 text-ink md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {open ? (
                      <X className="size-5" />
                    ) : (
                      <Menu className="size-5" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile menu, floats under the bar with the same inset */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-x-0 top-full mt-2 origin-top rounded-2xl border border-line bg-paper p-2 shadow-xl shadow-ink/10 md:hidden"
              >
                <motion.nav
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                  className="flex flex-col gap-1 rounded-xl bg-ink/5 p-1.5"
                >
                  {LINKS.map((link) => {
                    const isActive = active === link.href;
                    return (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        onClick={() => handleLink(link.href)}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          show: { opacity: 1, x: 0 },
                        }}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive
                            ? "bg-white text-ink shadow-sm"
                            : "text-muted"
                        }`}
                      >
                        {link.label}
                      </motion.a>
                    );
                  })}
                </motion.nav>

                <a
                  href={TOOL_PATH}
                  onClick={() => setOpen(false)}
                  className="mt-2 flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-accent-strong px-5 text-sm font-semibold text-white sm:hidden"
                >
                  Open the tool
                  <ArrowUpRight className="size-4" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </motion.header>
  );
}
