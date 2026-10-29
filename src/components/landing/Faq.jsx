import { ChevronDown } from "lucide-react";
import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";

const QUESTIONS = [
  { q: "Does it need internet?", a: "Only for the first visit, so the site can save itself to your phone. After that, transfers work with no internet, no mobile data and no router connection." },
  { q: "Which files can I send?", a: "Any file. Photos, videos, PDFs, documents, music and APK files all work. An APK can be sent to an iPhone, but it can only be installed on Android." },
  { q: "Can I send between iPhone and Android?", a: "Yes. Both phones just need a modern browser and a shared hotspot or Wi-Fi network." },
  { q: "Are my files stored anywhere?", a: "No. Files go directly between the two phones and are never uploaded to a server." },
  { q: "Is it free?", a: "Yes, it is free to use." },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-surface py-16 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading title="Questions people ask" />
        <div className="divide-y divide-line border-y border-line">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
