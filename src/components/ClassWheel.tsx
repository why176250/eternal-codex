"use client";

import { useEffect, useRef, useState } from "react";
import wheel from "@/data/class-wheel.json";

type ClassEntry = { zh: string; en: string; color: string; icon: string };
const classes = Object.entries(wheel as Record<string, ClassEntry>);
const COUNT = classes.length;
const TAU = Math.PI * 2;
const SIZE = 560;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function winnerAt(rotation: number) {
  const normalized = ((rotation % TAU) + TAU) % TAU;
  const pointer = (-Math.PI / 2 - normalized + TAU * 10) % TAU;
  return Math.floor(pointer / (TAU / COUNT)) % COUNT;
}

export function ClassWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    let cancelled = false;
    const loaded: Record<string, HTMLImageElement> = {};
    let remaining = COUNT;
    classes.forEach(([key]) => {
      const image = new Image();
      image.src = `/classes/icons/${key.toLowerCase()}.jpg`;
      image.onload = () => {
        loaded[key] = image;
        remaining -= 1;
        if (!cancelled && remaining === 0) setImages({ ...loaded });
      };
      image.onerror = () => {
        remaining -= 1;
        if (!cancelled && remaining === 0) setImages({ ...loaded });
      };
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const outer = SIZE * 0.44;
    const inner = SIZE * 0.16;
    const sector = TAU / COUNT;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    classes.forEach(([key, entry], index) => {
      const start = index * sector;
      const end = start + sector;
      const isWinner = winner === index;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outer, start, end);
      ctx.closePath();
      ctx.fillStyle = entry.color;
      ctx.globalAlpha = isWinner ? 1 : 0.72;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = isWinner ? "#fff3cf" : "rgba(5,8,15,.55)";
      ctx.lineWidth = isWinner ? 1.25 : 0.25;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + sector / 2);
      const image = images[key];
      if (image && image.complete && image.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(outer * 0.68, 0, 15, 0, TAU);
        ctx.clip();
        ctx.drawImage(image, outer * 0.68 - 15, -15, 30, 30);
        ctx.restore();
      }
      ctx.fillStyle = "rgba(5,8,15,.88)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 13px Georgia, serif";
      ctx.fillText(entry.en, outer * 0.84, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, inner, 0, TAU);
    ctx.fillStyle = "#07101d";
    ctx.fill();
    ctx.strokeStyle = "rgba(227,189,120,.55)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Pointer at 12 o'clock
    ctx.beginPath();
    ctx.moveTo(cx, cy - outer - 13);
    ctx.lineTo(cx - 10, cy - outer - 27);
    ctx.lineTo(cx + 10, cy - outer - 27);
    ctx.closePath();
    ctx.fillStyle = "#e3bd78";
    ctx.fill();
    ctx.strokeStyle = "#07101d";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [rotation, winner, images]);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    const startRotation = rotationRef.current;
    const turns = 3 + Math.random() * 1.2;
    const finalRotation = startRotation + TAU * turns + Math.random() * TAU;
    const started = performance.now();
    const duration = 3000;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const next = startRotation + (finalRotation - startRotation) * easeOutCubic(progress);
      rotationRef.current = next;
      setRotation(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setWinner(winnerAt(finalRotation));
        setSpinning(false);
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const result = winner !== null ? classes[winner][1] : null;

  return (
    <div className="panel p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <canvas
            ref={canvasRef}
            onClick={spin}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                spin();
              }
            }}
            aria-label="Spin the class wheel"
            className="h-full w-full cursor-pointer rounded-full"
          />
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/55 bg-abyss text-sm font-semibold tracking-wider text-gold-soft shadow-[0_0_30px_-10px_rgba(227,189,120,.8)] transition-colors hover:border-gold/80 hover:bg-deep disabled:cursor-wait disabled:opacity-70"
          >
            {spinning ? "..." : "SPIN"}
          </button>
        </div>
        <div>
          <p className="eyebrow">Random pick</p>
          <h2 className="display mt-1 text-2xl text-parchment">
            {result ? result.en : spinning ? "Spinning…" : "Ready?"}
          </h2>
          {result ? (
            <div className="mt-3 flex items-center gap-3">
              <img src={`/classes/icons/${classes[winner!][0].toLowerCase()}.jpg`} alt="" width={44} height={44} className="size-11 rounded-lg border border-line/80" />
              <div>
                <p className="text-sm text-parchment">{result.en}</p>
                <p className="text-[10px] text-muted">Your class</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted">Click the wheel or the button. Three to four turns, three seconds, one class.</p>
          )}
          <button type="button" onClick={spin} disabled={spinning} className="mt-5 w-full rounded-lg border border-gold/50 bg-gold/[0.1] px-4 py-3 text-sm font-semibold text-gold-soft transition-colors hover:bg-gold/[0.16] disabled:cursor-wait disabled:opacity-50">
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
          <p className="mt-3 text-[10px] leading-relaxed text-muted/60">Runs locally in your browser. No account, no network request, no tracking.</p>
        </div>
      </div>
    </div>
  );
}
