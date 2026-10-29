import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";

const STEPS = [
  { title: "Show your code", description: "Open the tool on the sending phone and tap Send. A QR code appears on the screen." },
  { title: "Scan and reply", description: "The other phone scans it with its camera, then shows a reply code of its own." },
  { title: "Send anything", description: "Scan the reply code and the phones connect. Pick your files and they move directly." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 lg:py-28">
      <Container className="space-y-12">
        <SectionHeading title="How it works">
          Both phones join the same hotspot or Wi-Fi network. After that, three steps.
        </SectionHeading>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t-2 border-ink pt-6">
              <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-accent font-bold">{i + 1}</span>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
