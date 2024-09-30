import React from "react";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/theme-common/internal";

import TOC from "@theme/TOC";
import TryCloudCard from "@site/src/components/TryCloudCard";

export default function DocItemTOCDesktop(): JSX.Element {
  const { toc, frontMatter } = useDoc();
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
      <TryCloudCard />
    </div>
  );
}
