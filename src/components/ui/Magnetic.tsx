"use client";

import type { MouseEvent, ReactNode } from "react";
import { useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { scrollToId } from "@/lib/scroll";

type MagneticProps = {
  children: ReactNode;
  className: string;
  href?: string;
  to?: string;
  external?: boolean;
  onPress?: () => void;
};

export function Magnetic({ children, className, href, to, external, onPress }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.22);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };

  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    if (to) {
      e.preventDefault();
      scrollToId(to);
    }
    if (onPress) {
      e.preventDefault();
      onPress();
    }
  };

  return (
    <m.a
      href={href ?? (to ? `#${to}` : "#")}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={click}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </m.a>
  );
}
