import React from "react";

export default function MainToolSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto rounded-3xl border border-zinc-200/70 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 md:p-8">
      <div className="text-center">
        <div className="text-xl font-semibold text-zinc-900">Name generator</div>
        <div className="text-sm text-zinc-600 mt-4">Generate a list and copy your favorites.</div>
      </div>

      {/* compact tip bar */}
      <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-3 text-xs text-zinc-600">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>• Click Generate to create a fresh list.</span>
          <span>• Use Copy to copy your favorites.</span>
          <span>• Regenerate until the vibe fits your character.</span>
        </div>
      </div>

      {/* single inner work area */}
      <div className="mt-5 rounded-2xl border border-zinc-200/70 bg-white p-4 md:p-6">
        {children}
      </div>
    </section>
  );
}
