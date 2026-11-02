import {
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Package,
} from "lucide-react";
import { fileKind } from "../lib/format.js";

const ICONS = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  doc: FileText,
  apk: Package,
  other: File,
};

export default function FileIcon({ name, className = "size-5" }) {
  const Icon = ICONS[fileKind(name)];
  return <Icon className={className} />;
}
