import { FilePlus2 } from "lucide-react";

const TYPES = ["Photos", "Videos", "PDFs", "Music", "Documents", "APK files"];

export default function EmptyFeed() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 py-16 text-center">
      <span className="grid size-20 place-items-center rounded-[2rem] bg-accent 2xl:size-28">
        <FilePlus2 className="size-9 2xl:size-12" />
      </span>
      <div className="max-w-xs space-y-2 2xl:max-w-md">
        <h2 className="text-2xl font-extrabold tracking-tight 2xl:text-4xl">
          Nothing sent yet
        </h2>
        <p className="leading-relaxed text-muted 2xl:text-lg">
          Add files below, or drop them anywhere on this screen. Files from the
          other phone show up here too.
        </p>
      </div>
      <ul className="flex flex-wrap justify-center gap-2">
        {TYPES.map((type) => (
          <li
            key={type}
            className="rounded-full border border-line bg-white px-3 py-1 text-sm font-medium text-muted 2xl:text-base"
          >
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
}
