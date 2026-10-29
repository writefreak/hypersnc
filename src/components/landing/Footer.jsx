import { Github } from "lucide-react";
import Container from "../layout/Container.jsx";
import { REPO_URL } from "../../config.js";

export default function Footer() {
  return (
    <footer className="border-t border-line pb-[env(safe-area-inset-bottom)]">
      <Container className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Offline Share, built by TageLabs Digital Solutions.</p>
        <a href={REPO_URL} className="flex items-center gap-2 font-semibold text-ink hover:underline">
          <Github className="size-4" /> View on GitHub
        </a>
      </Container>
    </footer>
  );
}
