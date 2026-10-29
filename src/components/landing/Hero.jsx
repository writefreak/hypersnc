import {
  WifiOff,
  Smartphone,
  Image as ImageIcon,
  Film,
  FileText,
  Music,
  Package,
  Check,
} from "lucide-react";
import Container from "../layout/Container.jsx";
import LinkButton from "../ui/LinkButton.jsx";
import { TOOL_PATH } from "../../config.js";
import phone from "../../public/phone.jpg";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/*
  Palette
  mist  #E9EEFB  page background (light periwinkle, replaces the off-white)
  lime  #8DEB4B  your brand lime
  moss  #2F6B0B  readable lime-family text on light backgrounds
  ink   #12141F  text + dark surfaces
*/

const FILE_TYPES = [
  {
    label: "Photos",
    icon: ImageIcon,
    pos: "left-[4%] top-[8%]",
    delay: "[animation-delay:0s]",
  },
  {
    label: "Videos",
    icon: Film,
    pos: "right-[6%] top-[4%]",
    delay: "[animation-delay:-1.2s]",
  },
  {
    label: "PDFs",
    icon: FileText,
    pos: "left-[10%] bottom-[10%]",
    delay: "[animation-delay:-2.4s]",
  },
  {
    label: "Music",
    icon: Music,
    pos: "right-[4%] bottom-[22%]",
    delay: "[animation-delay:-3.6s]",
  },
  {
    label: "APKs",
    icon: Package,
    pos: "left-[42%] bottom-[2%]",
    delay: "[animation-delay:-4.8s]",
  },
];

function ParallaxImage({ className }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-7%", "7%"],
  );

  return (
    <div ref={ref} className={className}>
      <motion.img
        src={phone}
        alt="Two phones sharing a file directly, with no internet connection"
        style={{ y }}
        className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
      />
    </div>
  );
}

const PROMISES = ["No app to install", "No account", "No ads"];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#E9EEFB] text-[#12141F]">
      <Container className="grid items-center gap-12 py-12 md:py-16 md:grid-cols-[1fr_1.05fr]">
        {/* Copy */}
        <div className="space-y-7">
          <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl 2xl:text-7xl">
            Send files between any two phones without internet
          </h1>

          <p className="max-w-xl text-sm md:text-base leading-relaxed text-[#12141F]/70 2xl:text-xl">
            Share Photos, videos, PDFs, music and APK files straight from one
            phone to the other, even without signal or data.
          </p>
          {/* Phone image */}
          <ParallaxImage className="relative h-[500px] w-full overflow-hidden rounded-[2rem] border-2 border-[#12141F] bg-white md:hidden" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href={TOOL_PATH}
              className="min-h-14 bg-[#8DEB4B] px-8 text-lg font-semibold text-[#12141F] shadow-[0_6px_0_0_#12141F] transition-transform hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#12141F] active:translate-y-[6px] active:shadow-none"
            >
              Open the tool
            </LinkButton>
            <LinkButton
              href="#how-it-works"
              variant="secondary"
              className="min-h-14 border-2 border-[#12141F] bg-transparent px-8 text-lg font-semibold text-[#12141F] hover:bg-white/60"
            >
              See how it works
            </LinkButton>
          </div>
        </div>

        {/* Phone image */}
        <ParallaxImage className="relative hidden h-[500px] w-full overflow-hidden rounded-[2rem] border-2 border-[#12141F] bg-white md:block" />
      </Container>
    </section>
  );
}
