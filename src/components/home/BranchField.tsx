"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

type Branch = { x: number; y: number; dy: number; bend: number; len: number; p: number; v: number; life: number; hot: boolean; w: number };
type Pulse = { t: number; x: number; v: number };

const coral = "238,108,77";

export function BranchField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--field-line").trim() || "41,50,65";
    const alpha = parseFloat(css.getPropertyValue("--field-alpha")) || 0.08;
    const dark = theme === "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let trunks: number[] = [];
    let branches: Branch[] = [];
    let pulses: Pulse[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (pre: boolean) => {
      const y = trunks[Math.floor(Math.random() * trunks.length)];
      const dy = (Math.random() < 0.5 ? -1 : 1) * rnd(38, 80);
      if (y + dy < 20 || y + dy > h - 20) return;
      branches.push({ x: rnd(-40, w * 0.95), y, dy, bend: rnd(50, 90), len: rnd(140, 380), p: pre ? Math.random() : 0, v: rnd(0.0018, 0.0042), life: 1, hot: Math.random() < 0.6, w: rnd(1.1, 1.8) });
    };

    const init = () => {
      const n = Math.max(4, Math.round(h / 120));
      trunks = Array.from({ length: n }, (_, i) => ((i + 0.5) * h) / n + rnd(-18, 18));
      branches = [];
      pulses = Array.from({ length: n * 2 }, (_, i) => ({ t: i % n, x: rnd(0, w), v: rnd(0.25, 0.7) }));
      for (let i = 0; i < Math.round(w / 90); i++) spawn(true);
    };

    const point = (b: Branch, u: number): [number, number] => {
      const d = u * (b.bend + b.len);
      if (d <= b.bend) {
        const k = d / b.bend;
        return [b.x + d, b.y + b.dy * k * k * (3 - 2 * k)];
      }
      return [b.x + d, b.y + b.dy];
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ink},${alpha})`;
      for (const y of trunks) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (const b of branches) {
        if (!reduce) {
          if (b.p < 1) b.p = Math.min(1, b.p + b.v * dt * 0.06);
          else b.life -= 0.004 * dt * 0.06;
        }
        const life = Math.max(0, b.life);
        const steps = Math.max(6, Math.round(b.p * 40));
        ctx.strokeStyle = b.hot ? `rgba(${coral},${(dark ? 0.55 : 0.5) * life})` : `rgba(${ink},${alpha * 2.2 * life})`;
        ctx.lineWidth = b.w;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const [x, y] = point(b, (b.p * i) / steps);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
        const [hx, hy] = point(b, b.p);
        if (b.hot && life > 0) {
          const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
          g.addColorStop(0, `rgba(${coral},${0.55 * life})`);
          g.addColorStop(1, `rgba(${coral},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(hx, hy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${coral},${0.95 * life})`;
          ctx.beginPath();
          ctx.arc(hx, hy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (!b.hot) {
          ctx.fillStyle = `rgba(${ink},${alpha * 3 * life})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      branches = branches.filter((b) => b.life > 0);
      while (branches.length < Math.round(w / 90)) spawn(false);
      for (const q of pulses) {
        if (!reduce) {
          q.x += q.v * dt * 0.06;
          if (q.x > w + 20) q.x = -20;
        }
        const y = trunks[q.t];
        if (y === undefined) continue;
        const g = ctx.createLinearGradient(q.x - 60, 0, q.x, 0);
        g.addColorStop(0, `rgba(${ink},0)`);
        g.addColorStop(1, `rgba(${ink},${alpha * 4})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(q.x - 60, y);
        ctx.lineTo(q.x, y);
        ctx.stroke();
      }
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      if (reduce) draw(0);
    };

    const loop = (ts: number) => {
      const dt = last ? Math.min(50, ts - last) : 16;
      last = ts;
      if (visible) draw(dt);
      raf = window.requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    if (reduce) draw(0);
    else raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [theme]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
