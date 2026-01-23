"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  open,
  onClose,
  durationMs = 1800,
}: {
  message: string;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(t);
  }, [open, onClose, durationMs]);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <div className="card px-4 py-3 text-sm shadow-lg">
        {message}
      </div>
    </div>
  );
}
