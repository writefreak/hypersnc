import Container from "../layout/Container.jsx";
import LinkButton from "../ui/LinkButton.jsx";
import { TOOL_PATH } from "../../config.js";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="size-3 rounded-full bg-accent-strong" />
          Offline Share
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
          <a href="#how-it-works" className="hover:text-ink">How it works</a>
          <a href="#why" className="hover:text-ink">Why use it</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
        </nav>
        <LinkButton href={TOOL_PATH} className="min-h-10 px-4 text-sm">Open the tool</LinkButton>
      </Container>
    </header>
  );
}
