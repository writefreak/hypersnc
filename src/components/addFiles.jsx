import { Plus } from "lucide-react";
import { buttonClasses } from "./ui/Button";

export default function AddFilesDock({ disabled, wakeLocked, onFiles }) {
  const label = buttonClasses({
    full: true,
    className: "min-h-14 cursor-pointer text-lg 2xl:min-h-16 2xl:text-xl",
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] 2xl:pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="pointer-events-auto mx-auto max-w-2xl space-y-2 rounded-3xl border border-line bg-paper/85 p-2 shadow-lg shadow-ink/10 backdrop-blur-md 2xl:max-w-4xl 2xl:p-3">
        <label
          className={`${label} has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <Plus className="size-6" /> Add files
          <input
            type="file"
            multiple
            disabled={disabled}
            className="sr-only"
            onChange={(e) => {
              onFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
        </label>
        <p className="text-center text-xs text-muted 2xl:text-base">
          {wakeLocked
            ? "Your screen will stay on while connected."
            : "Keep this screen on while files are moving."}
        </p>
      </div>
    </div>
  );
}
