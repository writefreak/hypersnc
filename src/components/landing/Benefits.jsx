import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Ban, Smartphone, WifiOff } from "lucide-react";
import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";
import hero from "../../public/hero.jpg";

const BENEFITS = [
  {
    icon: Smartphone,
    title: "Your files never touch a server",
    description:
      "Files travel directly from one phone to the other over your local network.",
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

function BenefitItem({ benefit, threshold, fill, reduceMotion, isLast }) {
  const Icon = benefit.icon;

  // Lights up as the fill reaches this item's position on the line
  const lit = useTransform(fill, [threshold - 0.15, threshold], [0, 1]);
  const textOpacity = useTransform(
    fill,
    [threshold - 0.25, threshold],
    [0.35, 1],
  );
  const textY = useTransform(fill, [threshold - 0.25, threshold], [16, 0]);
  const nodeScale = useTransform(
    fill,
    [threshold - 0.15, threshold],
    [1, 1.12],
  );

  return (
    <li
      className={`relative flex gap-5 md:flex-col md:items-center md:gap-6 md:px-6 md:text-center 2xl:px-10 ${
        isLast ? "" : "pb-10 md:pb-0"
      }`}
    >
      {/* Node */}
      <motion.span
        style={reduceMotion ? undefined : { scale: nodeScale }}
        className="relative z-10 grid size-12 shrink-0 place-items-center rounded-xl bg-white text-ink/40 shadow-sm ring-8 ring-[#E9EEFB] 2xl:size-16"
      >
        <Icon className="size-6 2xl:size-7" strokeWidth={1.75} />
        <motion.span
          style={{ opacity: reduceMotion ? 1 : lit }}
          className="absolute inset-0 grid place-items-center rounded-xl bg-accent-strong text-white"
        >
          <Icon className="size-6 2xl:size-7" strokeWidth={1.75} />
        </motion.span>
      </motion.span>

      {/* Text */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: textOpacity, y: textY }}
        className="max-w-sm pt-1 md:pt-0 2xl:max-w-md"
      >
        <h3 className="mb-2 text-lg font-bold tracking-tight text-ink lg:text-xl 2xl:text-2xl">
          {benefit.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted md:text-base 2xl:text-lg">
          {benefit.description}
        </p>
      </motion.div>
    </li>
  );
}

export default function Benefits() {
  const reduceMotion = useReducedMotion();
  const listRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Background image parallax, tracks the section as it passes through the screen
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothSection = useSpring(sectionProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const bgY = useTransform(
    smoothSection,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-7%", "7%"],
  );

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#E9EEFB] py-16 lg:py-28"
    >
      {/* Parallax background image */}
      <motion.img
        src={hero}
        alt=""
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute inset-x-0 -top-[20%] -z-20 h-[140%] w-full object-cover object-center opacity-70 will-change-transform"
      />

      {/* Left to right fade of the old background color */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#E9EEFB] via-[#E9EEFB]/80 to-transparent"
      />

      <Container className="space-y-12 2xl:space-y-16">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading title="Why use this tool?" />
        </div>

        <ol ref={listRef} className="relative grid md:grid-cols-3">
          {/* Horizontal track (md and up), runs from first node to last node */}
          <div
            aria-hidden="true"
            className="absolute left-[16.667%] right-[16.667%] top-7 hidden h-0.5 bg-ink/15 md:block 2xl:top-8"
          >
            <motion.div
              style={{ scaleX: reduceMotion ? 1 : fill }}
              className="h-full origin-left bg-accent-strong"
            />
          </div>

          {/* Vertical track (mobile only) */}
          <div
            aria-hidden="true"
            className="absolute bottom-7 left-7 top-7 w-0.5 -translate-x-1/2 bg-ink/15 md:hidden"
          >
            <motion.div
              style={{ scaleY: reduceMotion ? 1 : fill }}
              className="h-full origin-top bg-accent-strong"
            />
          </div>

          {BENEFITS.map((benefit, i) => (
            <BenefitItem
              key={benefit.title}
              benefit={benefit}
              threshold={i / (BENEFITS.length - 1)}
              fill={fill}
              reduceMotion={reduceMotion}
              isLast={i === BENEFITS.length - 1}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
