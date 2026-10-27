import React, { ReactNode } from "react";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

import TOC from "@theme/TOC";
import TryCloudCard from "@site/src/components/TryCloudCard";
import {
  LatencyCards,
  LatencyCardData,
} from "@site/src/components/LatencyCard";

export default function DocItemTOCDesktop(): ReactNode {
  const { toc, frontMatter } = useDoc();
  // Benchmark pages can show latency cards below the TOC.
  const latencyCards = (frontMatter as { latency_cards?: LatencyCardData[] })
    .latency_cards;
  return (
    <div
      className="databend-right-table-contents"
      style={{
        position: "sticky",
        top: "76px",
      }}
    >
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={ThemeClassNames.docs.docTocDesktop}
      />
      <LatencyCards cards={latencyCards} />
      {/* Pages with latency cards show the promo card in the body instead. */}
      {!latencyCards?.length && <TryCloudCard />}
    </div>
  );
}
