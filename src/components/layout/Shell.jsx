import { useState } from "react";
import { ChevronLeft, CircleHelp } from "lucide-react";
import HelpSheet from "../HelpSheet.jsx";

export default function Shell({ title, onBack, children }) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-md items-center gap-2 px-3 md:max-w-2xl lg:max-w-5xl 2xl:max-w-6xl">
          {onBack ? (
            <button aria-label="Go back" onClick={onBack} className="rounded-full p-2 hover:bg-ink/5">
              <ChevronLeft className="size-6" />
            </button>
          ) : (
            <span className="ml-2 inline-block size-3 rounded-full bg-accent-strong" />
          )}
          <h1 className="flex-1 truncate text-lg font-bold">{title}</h1>
          <button aria-label="Open help" onClick={() => setHelpOpen(true)} className="rounded-full p-2 hover:bg-ink/5">
            <CircleHelp className="size-6" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 md:max-w-2xl lg:max-w-5xl lg:py-12 2xl:max-w-6xl">
        {children}
      </main>

      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
