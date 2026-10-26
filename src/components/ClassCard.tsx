import Link from "next/link";
import type { WoWClass } from "@/lib/data";
import { difficultyLabel } from "@/lib/data";

export function ClassCard({ wowClass }: { wowClass: WoWClass }) {
  return (
    <Link
      href={`/classes/${wowClass.id}`}
      className="panel panel-hover group flex h-full flex-col p-5"
    >
      <div className="flex items-start justify-between">
        <span
          className="size-9 rounded-md"
          style={{
            background: `linear-gradient(135deg, ${wowClass.accent}55, ${wowClass.accent}18)`,
            border: `1px solid ${wowClass.accent}66`,
          }}
          aria-hidden="true"
        />
        <span className="text-[11px] uppercase tracking-wider text-muted">
          {difficultyLabel(wowClass.difficulty)}
        </span>
      </div>
      <h3 className="display mt-4 text-xl" style={{ color: wowClass.accent }}>
        {wowClass.name}
      </h3>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted">
        {wowClass.roles.join(" · ")}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {wowClass.tagline}
      </p>
      <span className="mt-auto pt-4 text-xs text-gold/80 transition-colors group-hover:text-gold-soft">
        Class overview →
      </span>
    </Link>
  );
}
