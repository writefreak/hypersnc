import { File, FileAudio, FileImage, FileText, FileVideo, Package } from "lucide-react";
import Container from "../layout/Container.jsx";

const TYPES = [
  { label: "Photos", icon: FileImage },
  { label: "Videos", icon: FileVideo },
  { label: "PDFs", icon: FileText },
  { label: "Documents", icon: File },
  { label: "Music", icon: FileAudio },
  { label: "APK files", icon: Package },
];

export default function FileTypes() {
  return (
    <div className="border-y border-line bg-surface">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        {TYPES.map(({ label, icon: Icon }) => (
          <span key={label} className="flex items-center gap-2 font-semibold">
            <Icon className="size-5 text-accent-strong" />
            {label}
          </span>
        ))}
      </Container>
    </div>
  );
}
