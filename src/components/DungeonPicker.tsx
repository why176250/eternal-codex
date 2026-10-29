"use client";

import { useRouter } from "next/navigation";

type Option = { id: string; name: string; band: string; isNew: boolean };

export function DungeonPicker({ options }: { options: Option[] }) {
  const router = useRouter();
  return (
    <select
      defaultValue=""
      onChange={(event) => {
        if (event.target.value) router.push(`/dungeons/${event.target.value}`);
      }}
      className="mt-3 w-full rounded-lg border border-gold/35 bg-deep px-3 py-2.5 text-sm text-parchment focus:border-gold/60 focus:outline-none"
    >
      <option value="">Select a dungeon</option>
      {options.map((dungeon) => (
        <option key={dungeon.id} value={dungeon.id}>
          {dungeon.name} · {dungeon.band}{dungeon.isNew ? " · New" : ""}
        </option>
      ))}
    </select>
  );
}
