import { useState } from "react";
import { FilePlus2 } from "lucide-react";

export default function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging ? "border-accent-strong bg-accent-soft" : "border-line bg-surface hover:border-ink"
      }`}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent">
        <FilePlus2 className="size-7" />
      </span>
      <span className="text-lg font-semibold">Choose files to send</span>
      <span className="text-sm text-muted">Photos, videos, PDFs, music, documents and APK files</span>
      <input
        type="file"
        multiple
        className="sr-only"
        onChange={(e) => {
          onFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </label>
  );
}
