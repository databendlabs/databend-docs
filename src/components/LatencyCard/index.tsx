// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement, useState } from "react";
import clsx from "clsx";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.scss";

type Mode = "warm" | "cold";

// [p50, p90, p99] in milliseconds.
type Percentiles = [number, number, number];

export interface LatencyCardData {
  title: string;
  scale?: string; // For example: "10M docs"
  note?: string; // For example: "Client latency · Top 10"
  warm: Percentiles;
  cold?: Percentiles;
}

const LABELS = ["p50", "p90", "p99"];

// Large values drop the decimal and use a thousands separator.
const format = (v: number): string =>
  v >= 1000
    ? Math.round(v).toLocaleString("en-US")
    : Number.isInteger(v)
      ? `${v}`
      : v.toFixed(1);

// Compact latency card for the right column of a benchmark page.
const LatencyCard: FC<LatencyCardData> = ({
  title,
  scale,
  note,
  warm,
  cold,
}): ReactElement => {
  const [mode, setMode] = useState<Mode>("warm");
  const modes: Mode[] = cold ? ["warm", "cold"] : ["warm"];
  const values = mode === "cold" && cold ? cold : warm;
  const max = Math.max(...values);

  return (
    <section className={styles.card} aria-label={`${title} latency`}>
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
        {scale && <span className={styles.scale}>{scale}</span>}
      </header>

      <div className={styles.modes} role="group" aria-label="Cache state">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            className={clsx(styles.mode, m === mode && styles.active)}
            aria-pressed={m === mode}
            onClick={() => setMode(m)}
          >
            <span className={clsx(styles.dot, styles[m])} />
            {m}
          </button>
        ))}
      </div>

      <dl className={styles.rows}>
        {values.map((v, i) => (
          <div className={styles.row} key={LABELS[i]}>
            <dt className={styles.label}>{LABELS[i]}</dt>
            <dd className={styles.track} aria-hidden="true">
              <span
                className={clsx(styles.bar, styles[mode])}
                style={{ width: `${(v / max) * 100}%` }}
              />
            </dd>
            <dd className={styles.value}>
              {format(v)}
              <span className={styles.unit}>ms</span>
            </dd>
          </div>
        ))}
      </dl>

      <footer className={styles.footer}>
        <span>{note}</span>
        {/* Official Databend Cloud logos from https://www.databend.com/brand/ */}
        <ThemedImage
          className={styles.logo}
          alt="Databend Cloud"
          sources={{
            light: useBaseUrl("/img/logo/databend-cloud-logo-horizontal.svg"),
            dark: useBaseUrl(
              "/img/logo/databend-cloud-logo-horizontal-reverse.svg",
            ),
          }}
        />
      </footer>
    </section>
  );
};

// Stack of cards. Pages set the data in front matter (`latency_cards`).
export const LatencyCards: FC<{ cards?: LatencyCardData[] }> = ({
  cards,
}): ReactElement | null =>
  cards?.length ? (
    <div className={styles.stack}>
      {cards.map((c) => (
        <LatencyCard key={c.title} {...c} />
      ))}
    </div>
  ) : null;

export default LatencyCard;
