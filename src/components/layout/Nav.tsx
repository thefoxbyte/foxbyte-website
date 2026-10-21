"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, useMotionValue } from "motion/react";
import * as m from "motion/react-m";
import { navLinks, productLinks, site } from "@/content/site";
import { scrollToTop } from "@/lib/scroll";
import { Mark, Wordmark } from "@/components/ui/Mark";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow, GitHubIcon, Icon } from "@/components/ui/icons";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const pathname = usePathname();
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const progress = useMotionValue(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);

  useEffect(() => {
    const update = () => {
      setSolid(window.scrollY > 40);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.set(Math.min(1, window.scrollY / max));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [progress]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(false);
      setMenu(false);
    }, 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenuSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(false), 160);
  };

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={styles.nav}>
      <m.div className={styles.bg} initial={false} animate={{ opacity: solid || open || menu ? 1 : 0 }} transition={{ duration: 0.3 }} />
      <m.div className={styles.progress} style={{ scaleX: progress }} />
      <div className={`wrap ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="FoxByte home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              scrollToTop();
            }
          }}
        >
          <span data-nav-mark="" className={styles.navMark}>
            <Mark size={30} priority />
          </span>
          <span className={styles.word}>
            <Wordmark height={19} priority />
          </span>
        </Link>
        <nav className={styles.links} aria-label="Main" onMouseLeave={() => setHover(null)}>
          <div ref={menuRef} className={styles.menuWrap} onMouseEnter={openMenu} onMouseLeave={closeMenuSoon}>
            <button
              type="button"
              className={`${styles.link} ${active("/product") ? styles.current : ""}`}
              aria-expanded={menu}
              aria-controls="product-menu"
              onMouseEnter={() => setHover("product")}
              onClick={() => setMenu((v) => !v)}
            >
              {hover === "product" && <m.span layoutId="navpill" className={styles.pill} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span>Product</span>
              <m.svg className={styles.chev} width="10" height="10" viewBox="0 0 10 10" animate={{ rotate: menu ? 180 : 0 }} aria-hidden="true">
                <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </m.svg>
            </button>
            <AnimatePresence>
              {menu && (
                <m.div id="product-menu" className={styles.menu} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.22, ease }}>
                  <div className={styles.menuGrid}>
                    {productLinks.map((p, i) => (
                      <m.div key={p.href} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i, duration: 0.25 }}>
                        <Link href={p.href} className={`${styles.menuItem} ${active(p.href) && p.href !== "/product" ? styles.menuCurrent : ""}`}>
                          <span className={styles.menuIcon}>
                            <Icon name={p.icon} />
                          </span>
                          <span className={styles.menuText}>
                            <b>{p.label}</b>
                            <span>{p.line}</span>
                          </span>
                        </Link>
                      </m.div>
                    ))}
                  </div>
                  <div className={styles.menuFoot}>
                    <span>New to FoxByte?</span>
                    <Link href="/why-foxbyte">Why FoxByte →</Link>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`${styles.link} ${active(l.href) ? styles.current : ""}`} onMouseEnter={() => setHover(l.href)} aria-current={active(l.href) ? "page" : undefined}>
              {hover === l.href && <m.span layoutId="navpill" className={styles.pill} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <a className={styles.gh} href={site.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
            GitHub
          </a>
          <ThemeToggle />
          <Link href="/contact" className={`btn ghost sm ${styles.sales}`}>
            Contact sales
          </Link>
          <Magnetic className={`btn primary sm ${styles.install}`} href="/download">
            Install
            <Arrow />
          </Magnetic>
          <button type="button" className={`${styles.iconBtn} ${styles.menuBtn}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <m.path d="M2 5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" animate={{ d: open ? "M4 4l10 10" : "M2 5h14" }} />
              <m.path d="M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" animate={{ d: open ? "M4 14L14 4" : "M2 13h14" }} />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <m.div className={styles.sheet} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="wrap">
              <span className={styles.sheetLabel}>Product</span>
              <div className={styles.sheetGrid}>
                {productLinks.map((p, i) => (
                  <m.div key={p.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link href={p.href}>{p.label}</Link>
                  </m.div>
                ))}
              </div>
              {navLinks.map((l, i) => (
                <m.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.04 }}>
                  <Link href={l.href} className={styles.sheetLink}>
                    {l.label}
                  </Link>
                </m.div>
              ))}
              <Link href="/contact" className={styles.sheetLink}>
                Contact sales
              </Link>
              <Link href="/download" className={`btn primary ${styles.sheetCta}`}>
                Install FoxByte
                <Arrow />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
