import type { ReactNode } from "react";

export default function ZhLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="border-b border-gold/15 bg-gold/[0.035]">
        <div className="container-x flex items-center justify-between gap-3 py-2 text-[10px] text-muted">
          <span><span className="text-gold-soft">中文版</span> · 游戏数据仍以英文为主</span>
          <a href="/" className="text-gold/80 hover:text-gold-soft">English →</a>
        </div>
      </div>
      {children}
    </>
  );
}
