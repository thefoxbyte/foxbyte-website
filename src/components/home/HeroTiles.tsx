"use client";

import { useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { Icon, type FeatureIcon } from "@/components/ui/icons";
import styles from "./Hero.module.css";

const tiles: { icon: FeatureIcon; x: number; y: number; depth: number; size: number }[] = [
  { icon: "db", x: 52, y: 15, depth: 0.9, size: 58 },
  { icon: "import", x: 76, y: 5, depth: 0.7, size: 46 },
  { icon: "branch", x: 99, y: 13, depth: 0.5, size: 46 },
  { icon: "shield", x: 101, y: 60, depth: 0.85, size: 54 },
  { icon: "rewind", x: 92, y: 97, depth: 1, size: 60 },
  { icon: "pulse", x: 56, y: 93, depth: 0.6, size: 48 },
  { icon: "box", x: 47, y: 3, depth: 0.35, size: 38 },
];

type Motion = { nx: MotionValue<number>; ny: MotionValue<number>; sy: MotionValue<number> };

function Tile({ icon, x, y, depth, size, i, nx, ny, sy }: (typeof tiles)[number] & Motion & { i: number }) {
  const tx = useTransform(nx, (v) => v * -46 * depth);
  const ty = useTransform([ny, sy], ([a, b]: number[]) => a * -34 * depth - b * 0.14 * depth);
  const base = typeof document !== "undefined" && document.documentElement.dataset.intro ? 2 : 0.6;
  return (
    <m.div
      className={styles.tile}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, x: tx, y: ty, zIndex: depth > 0.75 ? 3 : 1, filter: depth < 0.5 ? "blur(1.4px)" : "none" }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: base + i * 0.12, type: "spring", stiffness: 120, damping: 13 }}
      whileHover={{ scale: 1.14, rotate: -8 }}
    >
      <m.div className={styles.tileIn} animate={{ y: [0, -(6 + 10 * depth), 0], rotate: [0, i % 2 ? 5 : -5, 0] }} transition={{ duration: 4.2 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}>
        <Icon name={icon} />
      </m.div>
    </m.div>
  );
}

export function HeroTiles(props: Motion) {
  return (
    <div className={styles.tiles} aria-hidden="true">
      {tiles.map((t, i) => (
        <Tile key={t.icon} {...t} i={i} {...props} />
      ))}
    </div>
  );
}
