"use client";

import { useState } from "react";

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
                      {spec.specNameEn} · {spec.role}
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
        className="prose prose-infinite prose-invert max-w-none px-5 py-6 text-sm md:px-7 md:py-8"
        dangerouslySetInnerHTML={{ __html: activeSection.html }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-5 py-4 text-[11px] leading-relaxed text-muted/70 md:px-7">
        <p>
          内容来源：蓝色隐士小程序「职业攻略（无限服）」· 更新于{" "}
          {activeSpec.updatedAt} · 仅供个人学习，非商用
        </p>
        <p className="text-muted/50">
          {activeSpec.title}
        </p>
      </div>
    </div>
  );
}
