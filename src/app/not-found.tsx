import Link from "next/link";
import type { Metadata } from "next";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className={`sec ${styles.page}`}>
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1 className={styles.title}>This branch doesn’t exist.</h1>
        <p className="lede">The page you asked for isn’t here. Main is fine, though.</p>
        <Link href="/" className="btn primary">
          Back to main
        </Link>
      </div>
    </section>
  );
}
