"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { botPackets, tourStops, type BotMood } from "@/content/home";
import { site } from "@/content/site";
import { copyText, scrollToId } from "@/lib/scroll";
import { BotFace } from "./BotFace";
import styles from "./FoxBot.module.css";

type Packet = { id: number; text: string; bad?: boolean };

const sectionIds = ["top", "proof", "suit", "story", "data", "pricing", "faq", "start"];
const ease = [0.22, 1, 0.36, 1] as const;

function currentSection(): string {
  let current = "top";
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = id;
  }
  if (current !== "story") return current;
  const story = document.getElementById("story");
  if (!story) return current;
  const tall = story.offsetHeight > window.innerHeight * 1.5;
  const progress = Math.max(0, Math.min(0.999, -story.getBoundingClientRect().top / Math.max(1, story.offsetHeight - window.innerHeight)));
  return `s${tall ? Math.floor(progress * 4) : 0}`;
}

function useSectionKey() {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener("scroll", notify, { passive: true });
      window.addEventListener("resize", notify);
      return () => {
        window.removeEventListener("scroll", notify);
        window.removeEventListener("resize", notify);
      };
    },
    currentSection,
    () => "top",
  );
}

function useIntroDone() {
  return useSyncExternalStore(
    (notify) => {
      const observer = new MutationObserver(notify);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
      return () => observer.disconnect();
    },
    () => !document.documentElement.dataset.intro,
    () => false,
  );
}

function Signal() {
  return (
    <i aria-hidden="true">
      <b style={{ height: 4 }} />
      <b style={{ height: 7 }} />
      <b style={{ height: 10 }} />
    </i>
  );
}

export function FoxBot() {
  const ready = useIntroDone();
  const pathname = usePathname();
  const sectionKey = useSectionKey();
  const onHome = pathname === "/";
  const key = onHome ? sectionKey : `/${pathname.split("/").filter(Boolean).slice(0, pathname.startsWith("/product") ? 2 : 1).join("/")}`;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [mood, setMood] = useState<BotMood>("idle");
  const [blink, setBlink] = useState(false);
  const [twitch, setTwitch] = useState(0);
  const [ghost, setGhost] = useState(0);
  const [ripple, setRipple] = useState(0);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const tour = useRef<number[]>([]);
  const ex = useSpring(0, { stiffness: 200, damping: 20 });
  const ey = useSpring(0, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        setHidden(localStorage.getItem("foxbot-hidden") === "1");
      } catch {}
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const emit = useCallback((text: string, bad?: boolean) => {
    nextId.current += 1;
    const id = nextId.current;
    setRipple(id);
    setPackets((ps) => [...ps.slice(-2), { id, text, bad }]);
    window.setTimeout(() => setPackets((ps) => ps.filter((q) => q.id !== id)), 3400);
  }, []);

  useEffect(() => {
    const look = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.45);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 300);
      ex.set((dx / d) * 4.5 * k);
      ey.set((dy / d) * 3.5 * k);
    };
    window.addEventListener("mousemove", look);
    return () => window.removeEventListener("mousemove", look);
  }, [ex, ey]);

  useEffect(() => {
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        if (Math.random() < 0.35) setTwitch((x) => x + 1);
        loop();
      }, 2600 + Math.random() * 2600);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || hidden || open) return;
    const entry = botPackets[key];
    if (!entry) return;
    const nextMood = entry.mood ?? "idle";
    const timers = entry.packets.map((text, i) => window.setTimeout(() => emit(text, entry.bad), 350 + i * 650));
    timers.push(
      window.setTimeout(() => {
        setMood(nextMood);
        setTwitch((x) => x + 1);
        if (nextMood === "replica") setGhost((g) => g + 1);
      }, 0),
    );
    if (nextMood !== "armour" && nextMood !== "point") timers.push(window.setTimeout(() => setMood("idle"), 3200));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [key, ready, hidden, open, emit]);

  useEffect(() => {
    if (!ready || hidden) return;
    const id = window.setInterval(() => {
      if (!open) emit("ping main · ok");
    }, 16000);
    return () => window.clearInterval(id);
  }, [ready, hidden, open, emit]);

  const stopTour = useCallback(() => {
    tour.current.forEach((t) => window.clearTimeout(t));
    tour.current = [];
  }, []);

  useEffect(() => stopTour, [stopTour]);

  const startTour = () => {
    setOpen(false);
    stopTour();
    tour.current = tourStops.map((id, i) => window.setTimeout(() => scrollToId(id), 300 + i * 3400));
    const cancel = () => {
      stopTour();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
    window.setTimeout(() => {
      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchstart", cancel, { passive: true });
      window.addEventListener("keydown", cancel);
    }, 400);
  };

  const copy = async () => {
    await copyText(navigator.userAgent.toLowerCase().includes("win") ? site.installWindows : site.install);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const hide = (value: boolean) => {
    setHidden(value);
    setOpen(false);
    try {
      localStorage.setItem("foxbot-hidden", value ? "1" : "0");
    } catch {}
  };

  if (!ready) return null;

  if (hidden) {
    return (
      <m.button type="button" className={styles.restore} onClick={() => hide(false)} aria-label="Show FoxBot" initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
        <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden="true">
          <path d="M2 16V3c0-1.4 1.5-2 2.5-1.2L10 7v5z" fill="#fff" />
          <path d="M20 16V3c0-1.4-1.5-2-2.5-1.2L12 7v5z" fill="#ee6c4d" />
        </svg>
      </m.button>
    );
  }

  return (
    <m.div className={styles.bot} ref={ref} initial={{ x: 160, y: 40, rotate: 24, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.8 }}>
      <div className={styles.packets} aria-live="polite">
        <AnimatePresence>
          {!open &&
            packets.map((q) => (
              <m.div key={q.id} layout className={`${styles.packet} ${q.bad ? styles.bad : ""}`} initial={{ opacity: 0, y: 18, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -22, transition: { duration: 0.35 } }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                <Signal />
                {q.text}
              </m.div>
            ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {open && (
          <m.div className={`${styles.panel} screen`} initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.3, ease }} style={{ originX: 1, originY: 1 }}>
            <header>
              <span>
                <b>foxbot</b>@main
              </span>
              <span className={styles.online}>● online</span>
            </header>
            <div className={styles.status}>
              <div>
                <span>gateway</span>
                <span>:6432 · up</span>
              </div>
              <div>
                <span>blackbox</span>
                <span className={styles.online}>✓ verified</span>
              </div>
              <div>
                <span>standby</span>
                <span>streaming</span>
              </div>
              <div>
                <span>branches</span>
                <span>main + 3</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={copy}>
                {copied ? "✓ Install command copied" : "Copy install command"}
              </button>
              {onHome && (
                <button type="button" onClick={startTour}>
                  Take the tour
                </button>
              )}
              <button type="button" onClick={() => hide(true)}>
                Hide FoxBot
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      {ripple > 0 && <m.span key={`r${ripple}`} className={styles.ripple} initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: 3.4, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} />}
      <AnimatePresence>
        {ghost > 0 && mood === "replica" && (
          <m.div key={`g${ghost}`} className={styles.ghost} initial={{ x: 0, opacity: 0.55 }} animate={{ x: -96, opacity: [0.55, 0.45, 0] }} transition={{ duration: 2.4, ease }}>
            <div className={styles.face} style={{ opacity: 0.6 }}>
              <BotFace ex={ex} ey={ey} blink={false} mood="idle" twitch={0} />
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <m.button
        type="button"
        className={styles.face}
        onClick={() => setOpen((o) => !o)}
        aria-label="FoxBot status and menu"
        aria-expanded={open}
        animate={mood === "point" ? { y: [0, -10, 0], rotate: [0, -10, 0] } : { y: [0, -8, 0] }}
        transition={{ duration: mood === "point" ? 1.2 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.06, rotate: -5 }}
        whileTap={{ scale: 0.94 }}
      >
        <BotFace ex={ex} ey={ey} blink={blink} mood={mood} twitch={twitch} />
      </m.button>
    </m.div>
  );
}
