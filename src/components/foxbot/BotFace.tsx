"use client";

import type { MotionValue } from "motion/react";
import * as m from "motion/react-m";
import type { BotMood } from "@/content/home";

type FaceProps = { ex: MotionValue<number>; ey: MotionValue<number>; blink: boolean; mood: BotMood; twitch: number };

export function BotFace({ ex, ey, blink, mood, twitch }: FaceProps) {
  const visor = mood === "alert" ? "#4a1f1a" : "#141922";
  const led = mood === "alert" ? "#ff7b66" : mood === "stream" ? "#ee6c4d" : "#4fd1a1";
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <radialGradient id="foxbot-thruster" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ee6c4d" stopOpacity=".95" />
          <stop offset="1" stopColor="#ee6c4d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <m.ellipse cx="60" cy="134" rx="24" ry="9" fill="url(#foxbot-thruster)" animate={{ scaleX: [1, 0.7, 1], opacity: [0.95, 0.5, 0.95] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ originX: 0.5, originY: 0.5 }} />
      <m.g key={`l${twitch}`} animate={{ rotate: twitch ? [0, -14, 0] : 0 }} transition={{ duration: 0.45 }} style={{ originX: 0, originY: 1 }}>
        <path d="M28 54V17c0-3.4 3.6-5 6-2.9L57 33v14z" fill="var(--ear-left)" />
        <path d="M28 31l17 14" stroke="var(--ear-notch)" strokeWidth="3" />
      </m.g>
      <m.g key={`r${twitch}`} animate={{ rotate: twitch ? [0, 14, 0] : 0 }} transition={{ duration: 0.45, delay: 0.08 }} style={{ originX: 1, originY: 1 }}>
        <path d="M92 54V17c0-3.4-3.6-5-6-2.9L63 33v14z" fill="#ee6c4d" />
        <path d="M92 31l-17 14" stroke="var(--ear-notch)" strokeWidth="3" />
      </m.g>
      <line x1="60" y1="42" x2="60" y2="27" stroke="#293241" strokeWidth="3.5" strokeLinecap="round" />
      <m.circle cx="60" cy="23" r="4.5" fill="#ee6c4d" animate={{ opacity: [1, 0.45, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <rect x="18" y="40" width="84" height="74" rx="30" fill="#293241" stroke="var(--tile-line)" strokeWidth="1.5" />
      {mood === "armour" && <m.rect x="14" y="36" width="92" height="82" rx="34" fill="none" stroke="#ee6c4d" strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 1 }} />}
      <rect x="28" y="57" width="64" height="30" rx="15" fill={visor} />
      {mood === "alert" ? (
        <m.path d="M60 61l9 3.6v6.4c0 5.4-3.6 9.3-9 11.1-5.4-1.8-9-5.7-9-11.1v-6.4z" fill="none" stroke="#ff7b66" strokeWidth="2.4" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: 0.5, originY: 0.5 }} />
      ) : (
        <m.g style={{ x: ex, y: ey }}>
          <m.g animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.12 }} style={{ originX: 0.5, originY: 0.5 }}>
            <ellipse cx="46" cy="72" rx="5.5" ry="6" fill="#ee6c4d" />
            <ellipse cx="74" cy="72" rx="5.5" ry="6" fill="#ee6c4d" />
            <circle cx="47.6" cy="70" r="1.6" fill="#fff" />
            <circle cx="75.6" cy="70" r="1.6" fill="#fff" />
          </m.g>
        </m.g>
      )}
      <m.circle cx="60" cy="100" r="3" fill={led} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: mood === "stream" ? 0.4 : 1.8, repeat: Infinity }} />
    </svg>
  );
}
