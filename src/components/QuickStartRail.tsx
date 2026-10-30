import Link from "next/link";

const steps = [
  { n: "01", title: "Pick a class", body: "Five questions, one class and race.", href: "/class-finder" },
  { n: "02", title: "Browse builds", body: "Start from a proven build, then make it yours.", href: "/tools/builds" },
  { n: "03", title: "Browse gear", body: "See what other players are wearing.", href: "/tools/gear" },
];

export function QuickStartRail() {
  return (
    <aside className="quick-start-rail fixed hidden min-[1800px]:block">
      <p className="eyebrow mb-2">Start here</p>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link key={step.n} href={step.href} className="panel panel-hover group flex items-start gap-2.5 p-3">
            <span className="display mt-0.5 text-[10px] text-gold/45">{step.n}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-parchment">{step.title}</span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-muted">{step.body}</span>
            </span>
            <span className="mt-1 text-[11px] text-gold/70 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
