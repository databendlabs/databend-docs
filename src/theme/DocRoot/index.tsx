import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import {
  DocsSidebarProvider,
  useDocRootMetadata,
} from "@docusaurus/plugin-content-docs/client";
import DocRootLayout from "@theme/DocRoot/Layout";
import NotFoundContent from "@theme/NotFound/Content";
import type { Props } from "@theme/DocRoot";
import styles from "./style.module.scss";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
const cache = createCache();
export default function DocRoot(props: Props): ReactNode {
  const currentDocRouteMetadata = useDocRootMetadata(props);
  if (!currentDocRouteMetadata) {
    // We only render the not found content to avoid a double layout
    // see https://github.com/facebook/docusaurus/pull/7966#pullrequestreview-1077276692
    return <NotFoundContent />;
  }
  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;
  return (
    <StyleProvider hashPriority="high" cache={cache}>
      <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
        <div className={styles.fakeBg}></div>
        <div className={styles.cell}></div>
        <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
          <DocRootLayout>{docElement}</DocRootLayout>
        </DocsSidebarProvider>
      </HtmlClassNameProvider>
    </StyleProvider>
  );
}
