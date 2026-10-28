"use client";

import { useEffect, useRef, useState } from "react";

export type SpecSectionView = {
  key: string;
  title: string;
  html: string;
};

export type SpecView = {
  specId: number;
  specName: string;
  specNameEn: string;
  role: string;
  title: string;
  updatedAt: string;
  icon: string;
  sections: SpecSectionView[];
};

type Props = {
  specs: SpecView[];
  accent: string;
  className: string;
};

export function ClassSpecGuide({ specs, accent, className }: Props) {
  const [specId, setSpecId] = useState(specs[0]?.specId);
  const [sectionKey, setSectionKey] = useState("sec-overview");
  const [selected, setSelected] = useState<{
    name: string;
    icon: string;
    description: string;
  } | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    function openSkill(target: HTMLElement) {
      const name = target.dataset.skill;
      if (!name) return;
      let description = "";
      try {
        description = decodeURIComponent(target.dataset.skillDesc ?? "");
      } catch {
        description = "";
      }
      setSelected({
        name,
        icon: target.dataset.skillIcon ?? "",
        description,
      });
    }

    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest<HTMLElement>(".inline-skill");
      if (!target) return;
      event.preventDefault();
      openSkill(target);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = (event.target as HTMLElement).closest<HTMLElement>(".inline-skill");
      if (!target) return;
      event.preventDefault();
      openSkill(target);
    }

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selected]);

  const activeSpec = specs.find((spec) => spec.specId === specId) ?? specs[0];
  if (!activeSpec) return null;

  const activeSection =
    activeSpec.sections.find((section) => section.key === sectionKey) ??
    activeSpec.sections[0];

  function selectSpec(nextId: number) {
    setSpecId(nextId);
    setSectionKey("sec-overview");
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-line/70 p-4">
        <div className="flex flex-wrap gap-2">
          {specs.map((spec) => {
            const selected = spec.specId === activeSpec.specId;
            return (
              <button
                key={spec.specId}
                type="button"
                onClick={() => selectSpec(spec.specId)}
                aria-pressed={selected}
                className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                  selected
                    ? "bg-white/[0.04]"
                    : "border-line/70 hover:border-line hover:bg-white/[0.02]"
                }`}
                style={selected ? { borderColor: `${accent}99` } : undefined}
              >
                <span className="flex items-center gap-2">
                  {spec.icon ? (
                    <img
                      src={`/talents/icons/${spec.icon}.jpg`}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded border border-line/80"
                    />
                  ) : null}
                  <span>
                    <span className="block text-sm text-parchment">{spec.specName}</span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-muted">
                      {spec.role}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tablist"
        aria-label={`${className} guide sections`}
        className="flex overflow-x-auto border-b border-line/70"
      >
        {activeSpec.sections.map((section) => {
          const selected = section.key === activeSection.key;
          return (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSectionKey(section.key)}
              className={`shrink-0 border-b-2 px-4 py-3 text-xs transition-colors md:px-5 ${
                selected
                  ? "border-gold text-parchment"
                  : "border-transparent text-muted hover:text-gold-soft"
              }`}
            >
              {section.title}
            </button>
          );
        })}
      </div>

      <article
        ref={articleRef}
        className="prose prose-infinite prose-invert max-w-none px-5 py-6 text-sm md:px-7 md:py-8"
        dangerouslySetInnerHTML={{ __html: activeSection.html }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-5 py-4 text-[11px] leading-relaxed text-muted/70 md:px-7">
        <p>
          Source: Blue Hermit mini-program · Class Guides (Forever) · Updated{" "}
          {activeSpec.updatedAt} · Personal, non-commercial use
        </p>
        <p className="text-muted/50">
          {activeSpec.title}
        </p>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            className="panel w-full max-w-md p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              {selected.icon ? (
                <img
                  src={selected.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-lg border border-line/80"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="eyebrow">Skill detail</p>
                <h2 className="display mt-1 text-xl text-parchment">{selected.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-muted transition-colors hover:text-parchment"
                aria-label="Close skill detail"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
              {selected.description || "暂无详细说明。"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
