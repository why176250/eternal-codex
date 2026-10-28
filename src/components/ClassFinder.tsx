"use client";

import Link from "next/link";
import { useState } from "react";
import {
  recommendClasses,
  type ClassMatch,
  type Complexity,
  type Faction,
  type Pace,
  type Priority,
  type QuizAnswers,
  type Role,
} from "@/lib/class-finder";

const optionIcons: Record<string, string> = {
  Tank: "inv_shield_04",
  Healer: "spell_holy_heal",
  DPS: "inv_sword_01",
  Flexible: "ability_druid_balanceofpower",
  "Fast solo": "ability_mount_whitedirewolf",
  "Dungeon groups": "ability_hunter_huntingparty",
  "Slow and steady": "ability_hunter_pet_turtle",
  Simple: "inv_misc_book_08",
  Medium: "inv_scroll_03",
  High: "inv_misc_gear_01",
  Survivability: "inv_shield_04",
  "Group utility": "spell_holy_prayerofhealing",
  Damage: "ability_rogue_eviscerate",
  Alliance: "faction_alliance",
  Horde: "faction_horde",
  "No preference": "ability_druid_balanceofpower",
};

const questions: {
  key: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: { value: string; label: string; note: string }[];
}[] = [
  {
    key: "role",
    title: "What do you want to do?",
    subtitle: "Pick the job you enjoy most.",
    options: [
      { value: "Tank", label: "Tank", note: "Set the pace and hold the line." },
      { value: "Healer", label: "Healer", note: "Keep the group alive." },
      { value: "DPS", label: "Damage", note: "Kill things and control the fight." },
      { value: "Flexible", label: "Flexible", note: "I want options." },
    ],
  },
  {
    key: "pace",
    title: "How do you want to level?",
    subtitle: "Solo speed, dungeon groups, or a slower road?",
    options: [
      { value: "Fast solo", label: "Fast solo", note: "I want to reach 60 without waiting." },
      { value: "Dungeon groups", label: "Dungeon groups", note: "I want to be wanted by groups." },
      { value: "Slow and steady", label: "Slow and steady", note: "I enjoy the journey." },
    ],
  },
  {
    key: "complexity",
    title: "How much complexity do you want?",
    subtitle: "Be honest about the class you will actually play.",
    options: [
      { value: "Simple", label: "Simple", note: "Few buttons, clear job." },
      { value: "Medium", label: "Medium", note: "Some depth, not a second job." },
      { value: "High", label: "High", note: "I like a high ceiling." },
    ],
  },
  {
    key: "priority",
    title: "What matters most to you?",
    subtitle: "Pick the thing you do not want to compromise on.",
    options: [
      { value: "Survivability", label: "Survivability", note: "I want to stay alive." },
      { value: "Group utility", label: "Group utility", note: "I want to be useful." },
      { value: "Damage", label: "Damage", note: "I want to hit hard." },
      { value: "Flexibility", label: "Flexibility", note: "I want to switch roles." },
    ],
  },
  {
    key: "faction",
    title: "Which faction?",
    subtitle: "This changes the race recommendations.",
    options: [
      { value: "Alliance", label: "Alliance", note: "Night Elf, Human, Dwarf, Gnome, Draenei." },
      { value: "Horde", label: "Horde", note: "Orc, Undead, Tauren, Troll, Blood Elf." },
      { value: "No preference", label: "No preference", note: "Show me both." },
    ],
  },
];

export function ClassFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<ClassMatch[] | null>(null);

  function choose(value: string) {
    const question = questions[step];
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResults(recommendClasses(next as QuizAnswers));
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  if (results) {
    return (
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Your matches</p>
            <h2 className="display mt-1 text-2xl text-parchment">Start with one of these</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-line px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-parchment"
          >
            Retake
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {results.map((result, index) => (
            <article key={result.id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={`/classes/icons/${result.id}.jpg`}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-lg border border-line/80"
                />
                <span className="display text-sm text-gold/50">0{index + 1}</span>
              </div>
              <h3 className="display mt-4 text-xl text-parchment">{result.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                {result.roles.join(" · ")}
              </p>
              <p className="mt-2 text-xs text-gold-soft">{result.match}% match</p>
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted">
                {result.reasons.map((reason) => (
                  <li key={reason}>· {reason}</li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-muted/70">
                Races: {result.races.join(", ")}
              </p>
              <Link
                href={`/classes/${result.id}`}
                className="mt-4 inline-flex text-xs text-gold/85 underline-offset-4 hover:text-gold-soft hover:underline"
              >
                Open class guide →
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted/60">
          Forever can change race combinations; confirm the final list on the
          character-creation screen.
        </p>
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="panel p-5 md:p-7">
      <div className="flex items-center justify-between gap-3 text-xs text-muted">
        <span>
          Question {step + 1} / {questions.length}
        </span>
        <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-deep">
        <div
          className="h-full rounded-full bg-gold"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="display mt-6 text-2xl text-parchment">{question.title}</h2>
      <p className="mt-1 text-sm text-muted">{question.subtitle}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => choose(option.value)}
            className="flex items-start gap-3 rounded-xl border border-line/70 bg-deep/40 p-4 text-left transition-colors hover:border-gold/45 hover:bg-gold/[0.04] md:p-5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line/70 bg-abyss/60">
              <img
                src={`/talents/icons/${optionIcons[option.value] ?? "inv_misc_questionmark"}.jpg`}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded"
              />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block text-base text-parchment">{option.label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{option.note}</span>
            </span>
          </button>
        ))}
      </div>

      {step > 0 ? (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-4 text-xs text-muted hover:text-parchment"
        >
          ← Back
        </button>
      ) : null}
    </div>
  );
}
