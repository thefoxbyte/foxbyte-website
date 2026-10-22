import styles from "./Architecture.module.css";

const lanes = [
  { y: 70, label: "Commit path", sub: "stock Postgres on local disk; connections through the gateway" },
  { y: 230, label: "Off the commit path", sub: "never waited on by a transaction" },
];

export function Architecture() {
  return (
    <div className={`${styles.wrap} screen`}>
      <svg className={styles.svg} viewBox="0 0 760 320" role="img" aria-labelledby="arch-title arch-desc">
        <title id="arch-title">How FoxByte is put together</title>
        <desc id="arch-desc">
          Applications, tools and agents connect to the FoxByte gateway on port 6432, which routes each connection to stock PostgreSQL 18 on local disk. Beside the commit path, copy-on-write clones on ZFS or btrfs create branches, and wal-g ships write-ahead log and base backups to S3-compatible storage.
        </desc>
        {lanes.map((l) => (
          <g key={l.label}>
            <text x="24" y={l.y - 44} className={styles.lane}>
              {l.label}
            </text>
            <text x="24" y={l.y - 28} className={styles.laneSub}>
              {l.sub}
            </text>
          </g>
        ))}
        <path className={styles.wire} d="M190 80H290" />
        <path className={styles.wire} d="M450 80H550" />
        <path className={`${styles.wire} ${styles.dashed}`} d="M630 108V160C630 180 560 180 520 180H450" />
        <path className={`${styles.wire} ${styles.dashed}`} d="M630 108V196C630 230 700 230 700 230" />
        <path className={styles.flow} d="M190 80H290" />
        <path className={styles.flow} d="M450 80H550" style={{ animationDelay: "-0.6s" }} />
        <path className={`${styles.flow} ${styles.slow}`} d="M630 108V196C630 230 700 230 700 230" />
        <g>
          <rect x="24" y="52" width="166" height="56" rx="12" className={styles.box} />
          <text x="42" y="76" className={styles.title}>
            Your app · psql · ORM
          </text>
          <text x="42" y="94" className={styles.sub}>
            and AI agents
          </text>
        </g>
        <g>
          <rect x="290" y="52" width="160" height="56" rx="12" className={`${styles.box} ${styles.accent}`} />
          <text x="306" y="76" className={styles.title}>
            Gateway :6432
          </text>
          <text x="306" y="94" className={styles.sub}>
            database name = branch
          </text>
        </g>
        <g>
          <rect x="550" y="52" width="186" height="56" rx="12" className={`${styles.box} ${styles.core}`} />
          <text x="566" y="76" className={styles.title}>
            PostgreSQL 18 · main
          </text>
          <text x="566" y="94" className={styles.sub}>
            stock, on local NVMe
          </text>
        </g>
        <g>
          <rect x="270" y="152" width="180" height="56" rx="12" className={styles.box} />
          <text x="286" y="176" className={styles.title}>
            Copy-on-write branches
          </text>
          <text x="286" y="194" className={styles.sub}>
            ZFS or btrfs clones
          </text>
        </g>
        <g>
          <rect x="560" y="230" width="176" height="56" rx="12" className={styles.box} />
          <text x="576" y="254" className={styles.title}>
            Object storage
          </text>
          <text x="576" y="272" className={styles.sub}>
            wal-g: WAL + base backups
          </text>
        </g>
        <g>
          <rect x="24" y="230" width="230" height="56" rx="12" className={styles.box} />
          <text x="40" y="254" className={styles.title}>
            Blackbox and guardrails
          </text>
          <text x="40" y="272" className={styles.sub}>
            event triggers inside Postgres
          </text>
        </g>
      </svg>
    </div>
  );
}
