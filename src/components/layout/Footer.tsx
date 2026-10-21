import { footerColumns } from "@/content/site";
import { Wordmark } from "@/components/ui/Mark";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Wordmark height={22} tone="onDark" />
            <p>PostgreSQL you run yourself, with every schema change on record and AI kept safely off main.</p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className={styles.title}>{col.title}</h2>
              <ul className={styles.list}>
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <li key={l.label}>
                      <a href={l.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.base}>
          <span>© {year} FoxByte</span>
          <span>AGPL-3.0 core · Apache-2.0 clients · Enterprise source-available</span>
        </div>
      </div>
    </footer>
  );
}
