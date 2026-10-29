import Container from "../layout/Container.jsx";
import SectionHeading from "./SectionHeading.jsx";

const LIMITS = [
  { title: "Very large videos on iPhone", description: "iPhones hold a received file in memory before saving it, so files over about 1 GB may fail. Send large files to an Android phone instead." },
  { title: "Keep both screens on", description: "Locking a phone can pause the transfer. The tool asks the screen to stay awake, but it is safest to leave it on." },
  { title: "Same network needed", description: "Both phones must share a hotspot or Wi-Fi network. If pairing fails, make the other phone the hotspot and try again." },
  { title: "One visit with internet", description: "The first time you open the site, it needs internet to save itself. Every visit after that works offline." },
];

export default function Limits() {
  return (
    <section className="py-16 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading title="What to know before you start">
          A few honest limits, so nothing surprises you mid-transfer.
        </SectionHeading>
        <dl className="space-y-6">
          {LIMITS.map(({ title, description }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-5">
              <dt className="font-bold">{title}</dt>
              <dd className="mt-1 leading-relaxed text-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
