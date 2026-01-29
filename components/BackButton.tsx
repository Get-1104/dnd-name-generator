"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  /** Fallback path if there is no browser history (e.g. direct visit). */
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export default function BackButton({
  fallbackHref = "/",
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`btn-ghost ${className}`}
      onClick={() => {
        // router.back() will restore scroll position when returning to the previous page.
        // If the user landed directly on this page, there may be no meaningful history.
        try {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
          }
        } catch {
          // ignore
        }
        router.push(fallbackHref);
      }}
      aria-label={label}
    >
      <span aria-hidden>←</span>
      <span>{label}</span>
    </button>
  );
}
