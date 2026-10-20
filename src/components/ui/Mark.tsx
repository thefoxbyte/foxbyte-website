import Image from "next/image";
import styles from "./Mark.module.css";

type MarkProps = { size: number; tone?: "auto" | "onDark"; className?: string; priority?: boolean };

const ratioDark = 491 / 595;
const ratioLight = 555 / 702;

function Wings({ variant, size, priority }: { variant: "dark" | "light"; size: number; priority?: boolean }) {
  const ratio = variant === "dark" ? ratioDark : ratioLight;
  const h = Math.round(size * ratio);
  const half = Math.round(size / 2);
  return (
    <>
      <Image className={styles.wingL} src={`/brand/mark-${variant}-l.webp`} alt="" width={half} height={h} priority={priority} />
      <Image className={styles.wingR} src={`/brand/mark-${variant}-r.webp`} alt="" width={half} height={h} priority={priority} />
    </>
  );
}

export function Mark({ size, tone = "auto", className, priority }: MarkProps) {
  if (tone === "onDark") {
    return (
      <span className={`${styles.mark} ${className ?? ""}`} style={{ width: size, height: Math.round(size * ratioDark) }}>
        <Wings variant="dark" size={size} priority={priority} />
      </span>
    );
  }
  return (
    <span className={`${styles.mark} ${className ?? ""}`} style={{ width: size, height: Math.round(size * ratioLight) }}>
      <span className={`${styles.set} light-only`}>
        <Wings variant="light" size={size} priority={priority} />
      </span>
      <span className={`${styles.set} dark-only`}>
        <Wings variant="dark" size={size} priority={priority} />
      </span>
    </span>
  );
}

export function Wordmark({ height, tone = "auto", priority }: { height: number; tone?: "auto" | "onDark"; priority?: boolean }) {
  const darkW = Math.round(height * (606 / 149));
  const lightW = Math.round(height * (639 / 161));
  if (tone === "onDark") {
    return <Image src="/brand/word-dark.webp" alt="FoxByte" width={darkW} height={height} priority={priority} className={styles.word} />;
  }
  return (
    <span className={styles.wordWrap}>
      <Image src="/brand/word-light.webp" alt="FoxByte" width={lightW} height={height} priority={priority} className={`${styles.word} light-only`} />
      <Image src="/brand/word-dark.webp" alt="" width={darkW} height={height} priority={priority} className={`${styles.word} dark-only`} aria-hidden="true" />
    </span>
  );
}
