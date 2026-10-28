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
        <img
          src={`/classes/icons/${wowClass.id}.jpg`}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-lg border object-cover"
          style={{
            borderColor: `${wowClass.accent}66`,
            boxShadow: `0 0 24px -14px ${wowClass.accent}`,
          }}
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
