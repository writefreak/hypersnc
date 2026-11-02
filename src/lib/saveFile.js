const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// iPhone: open the share sheet, so photos and videos can go to the Photos app.
// Everything else: a normal download.
export async function saveFile({ blob, name }) {
  if (!blob) return;

  if (isIOS()) {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
