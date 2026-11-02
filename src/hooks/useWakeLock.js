import { useEffect, useState } from "react";

// Asks the browser to keep the screen on. Browsers drop the lock when the tab
// is hidden, so it is requested again when the tab comes back.
export default function useWakeLock(enabled = true) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;
    let lock = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (cancelled) return lock.release();
        setActive(true);
        lock.addEventListener("release", () => setActive(false));
      } catch {
        setActive(false);
      }
    };
    const onVisible = () => document.visibilityState === "visible" && acquire();

    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release();
    };
  }, [enabled]);

  return active;
}
