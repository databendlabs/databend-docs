import React, { ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

import TOC from "@theme/TOC";
import TryCloudCard from "@site/src/components/TryCloudCard";
import {
  LatencyCards,
  LatencyCardData,
} from "@site/src/components/LatencyCard";
import BenchmarkCard, {
  BenchmarkCardData,
} from "@site/src/components/BenchmarkCard";
import styles from "./styles.module.scss";

export default function DocItemTOCDesktop(): ReactNode {
  const { toc, frontMatter } = useDoc();
  // Benchmark pages provide summary measurements in front matter.
  const { latency_cards: latencyCards, benchmark_card: benchmarkCard } =
    frontMatter as {
      latency_cards?: LatencyCardData[];
      benchmark_card?: BenchmarkCardData;
    };
  const hasCards = !!(latencyCards?.length || benchmarkCard);
  return (
    <div
      className={clsx(
        "databend-right-table-contents",
        benchmarkCard && [styles.benchmarkSidebar, "thin-scrollbar"],
      )}
      style={{
        position: "sticky",
        top: "76px",
      }}
    >
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={clsx(
          ThemeClassNames.docs.docTocDesktop,
          benchmarkCard && styles.staticToc,
        )}
      />
      <BenchmarkCard card={benchmarkCard} />
      <LatencyCards cards={latencyCards} />
      {/* Pages with benchmark cards show the promo card in the body instead. */}
      {!hasCards && <TryCloudCard />}
    </div>
  );
}
