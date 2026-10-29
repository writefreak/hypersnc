import Container from "../layout/Container.jsx";
import LinkButton from "../ui/LinkButton.jsx";
import { TOOL_PATH } from "../../config.js";

export default function CtaBand() {
  return (
    <section className="py-16 lg:py-28">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-accent p-8 md:flex-row md:items-center md:justify-between lg:p-14">
          <div className="max-w-xl space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Open the tool and send your first file</h2>
            <p className="text-lg text-ink/80">It takes two scans and about a minute.</p>
          </div>
          <LinkButton href={TOOL_PATH} variant="dark" className="min-h-14 px-8 text-lg">Open the tool</LinkButton>
        </div>
      </Container>
    </section>
  );
}
