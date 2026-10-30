import Link from "next/link";

const steps = [
  { n: "01", title: "Pick a class", body: "Five questions, one class and race.", href: "/class-finder", icon: "compass" },
  { n: "02", title: "Browse builds", body: "Start from a proven build, then make it yours.", href: "/tools/builds", icon: "book" },
  { n: "03", title: "Browse gear", body: "See what other players are wearing.", href: "/tools/gear", icon: "shield" },
];

function StepIcon({ name }: { name: string }) {
  if (name === "compass") return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" /><path d="m14.8 9.2-1.9 3.7-3.7 1.9 1.9-3.7 3.7-1.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
  if (name === "book") return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z" stroke="currentColor" strokeWidth="1.6" /><path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19" stroke="currentColor" strokeWidth="1.4" /></svg>;
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 20 6v5c0 4.6-3.2 8.4-8 10-4.8-1.6-8-5.4-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.6" /><path d="m8.5 12 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function QuickStartRail({ zh = false }: { zh?: boolean }) {
  return (
    <aside className="quick-start-rail fixed hidden min-[1800px]:block">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="eyebrow">{zh ? "从这里开始" : "Start here"}</p>
        <span className="text-[9px] uppercase tracking-[0.16em] text-muted/50">{zh ? "三个步骤" : "Three steps"}</span>
      </div>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link key={step.n} href={step.href} className="panel panel-hover group relative flex items-start gap-3 overflow-hidden p-4">
            <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent opacity-70" />
            <span className="accent-tile grid size-9 shrink-0 place-items-center rounded-lg border" style={{ "--accent": "#e3bd78" } as React.CSSProperties}><StepIcon name={step.icon} /></span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2"><span className="text-base font-medium text-parchment">{zh ? ({ "Pick a class":"选择职业","Browse builds":"浏览天赋","Browse gear":"浏览装备" } as Record<string,string>)[step.title] ?? step.title : step.title}</span><span className="display text-[11px] text-gold/45">{step.n}</span></span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{zh ? ({ "Pick a class":"五个问题，选出职业和种族。","Browse builds":"从成熟 build 开始，再改成自己的。","Browse gear":"看看其他玩家在穿什么。" } as Record<string,string>)[step.title] ?? step.body : step.body}</span>
              <span className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-gold/80">{zh ? "打开" : "Open"} <span className="transition-transform group-hover:translate-x-0.5">→</span></span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
