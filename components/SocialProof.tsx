import React from "react";

export type Quote = {
  text: string;
  author?: string;
};

export default function SocialProof({
  title = "From the table",
  subtitle = "Early feedback from DMs and players we’ve shared the tool with.",
  quotes,
}: {
  title?: string;
  subtitle?: string;
  quotes: Quote[];
}) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-zinc-600">{subtitle}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {quotes.map((q, idx) => (
          <figure
            key={`${idx}-${q.text.slice(0, 16)}`}
            className="rounded-xl border bg-zinc-50 p-4"
          >
            <blockquote className="text-sm text-zinc-800">“{q.text}”</blockquote>
            {q.author ? (
              <figcaption className="mt-2 text-xs text-zinc-600">— {q.author}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
