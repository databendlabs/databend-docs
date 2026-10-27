// Copyright 2026 DatabendLabs.
import React, { FC, ReactElement, useState } from "react";
import clsx from "clsx";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.scss";

interface BenchmarkRow {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BenchmarkGroup {
  label?: string;
  rows: BenchmarkRow[];
}

// One switchable view, such as load time or cost.
interface BenchmarkView {
  tab: string;
  headline: string;
  summary: string;
  context?: string;
  prefix?: string;
  unit?: string;
  decimals?: number;
  compact?: boolean;
  groups: BenchmarkGroup[];
  note?: string;
}

export interface BenchmarkCardData {
  title: string;
  views: BenchmarkView[];
}

const formatValue = (value: number, view: BenchmarkView): string =>
  value.toLocaleString("en-US", {
    notation: view.compact ? "compact" : "standard",
    minimumFractionDigits: view.decimals ?? 0,
    maximumFractionDigits: view.compact ? 1 : view.decimals ?? 0,
  });

// One-glance summary of a benchmark page, rendered below the TOC.
const BenchmarkCard: FC<{ card?: BenchmarkCardData }> = ({
  card,
}): ReactElement | null => {
  const [selected, setSelected] = useState(0);
  const logoLight = useBaseUrl("/img/logo/databend-cloud-logo-horizontal.svg");
  const logoDark = useBaseUrl(
    "/img/logo/databend-cloud-logo-horizontal-reverse.svg",
  );
  const view = card?.views?.[selected];
  if (!card || !view) return null;

  return (
    <section className={styles.card} aria-label={card.title}>
      <header className={styles.header}>
        <span className={styles.title}>{card.title}</span>
      </header>

      {card.views.length > 1 && (
        <div className={styles.tabs} role="group" aria-label={card.title}>
          {card.views.map((item, index) => (
            <button
              key={item.tab}
              type="button"
              className={clsx(styles.tab, index === selected && styles.active)}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              {item.tab}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        <div className={styles.hero}>
          <strong className={styles.headline}>{view.headline}</strong>
          <span className={styles.summary}>{view.summary}</span>
        </div>
        {view.context && <p className={styles.context}>{view.context}</p>}

        <div className={styles.groups}>
          {view.groups.map((group, index) => {
            // Scale bars per group so each comparison stays readable.
            const max = Math.max(...group.rows.map((row) => row.value), 1);
            return (
              <dl className={styles.group} key={group.label ?? index}>
                {group.label && (
                  <dt className={styles.groupLabel}>{group.label}</dt>
                )}
                {group.rows.map((row) => (
                  <dd className={styles.row} key={row.label}>
                    <span
                      className={clsx(
                        styles.label,
                        row.highlight && styles.strong,
                      )}
                    >
                      {row.label}
                    </span>
                    <span
                      className={clsx(
                        styles.value,
                        row.highlight && styles.strong,
                      )}
                    >
                      {view.prefix}
                      {formatValue(row.value, view)}
                      {view.unit && (
                        <span className={styles.unit}>{view.unit}</span>
                      )}
                    </span>
                    <span className={styles.track} aria-hidden="true">
                      <span
                        className={clsx(
                          styles.bar,
                          row.highlight && styles.highlight,
                        )}
                        style={{ width: `${(row.value / max) * 100}%` }}
                      />
                    </span>
                  </dd>
                ))}
              </dl>
            );
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        {view.note && <span className={styles.note}>{view.note}</span>}
        <ThemedImage
          className={styles.logo}
          alt="Databend Cloud"
          sources={{ light: logoLight, dark: logoDark }}
        />
      </footer>
    </section>
  );
};

export default BenchmarkCard;
