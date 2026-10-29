export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
}

const KINDS = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "heic", "svg"],
  video: ["mp4", "mov", "mkv", "webm", "avi", "3gp"],
  audio: ["mp3", "wav", "m4a", "aac", "ogg", "flac"],
  pdf: ["pdf"],
  apk: ["apk", "xapk"],
  doc: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"],
};

export function fileKind(name) {
  const ext = name.split(".").pop().toLowerCase();
  const match = Object.entries(KINDS).find(([, list]) => list.includes(ext));
  return match ? match[0] : "other";
}
