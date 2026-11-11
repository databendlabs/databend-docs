import React, { useEffect, type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
// @ts-ignore
import Heading from "@theme/Heading";
// @ts-ignore
import MDXContent from "@theme/MDXContent";
import styles from "./styles.module.css";
import CopyPageButton from "@site/src/components/CopyPageButton";

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === "undefined";
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }: any): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    let cancelled = false;
    let frame = 0;
    const cancel = () => {
      cancelled = true;
    };
    const scrollToTarget = () => {
      if (!cancelled) {
        target.scrollIntoView({ block: "start" });
      }
    };

    // Docusaurus details keep React state in addition to the native open flag.
    // Reveal deep-linked content through the summary, then align after expansion.
    const expandedDetails: HTMLDetailsElement[] = [];
    let details = target.closest("details");
    while (details) {
      if (details.dataset.collapsed === "true") {
        details.addEventListener("transitionend", scrollToTarget);
        expandedDetails.push(details);
        details.querySelector<HTMLElement>(":scope > summary")?.click();
      } else if (!details.open) {
        details.open = true;
      }
      details = details.parentElement?.closest("details") ?? null;
    }

    // Client-rendered docs miss the browser's initial hash scroll. Font swaps
    // can then move the heading, so align it again after fonts have settled.
    scrollToTarget();
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        frame = requestAnimationFrame(scrollToTarget);
      }
    });

    // Do not override the reader if they start navigating before fonts load.
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach((event) =>
      window.addEventListener(event, cancel, { passive: true }),
    );
    return () => {
      cancel();
      cancelAnimationFrame(frame);
      expandedDetails.forEach((element) =>
        element.removeEventListener("transitionend", scrollToTarget),
      );
      events.forEach((event) => window.removeEventListener(event, cancel));
    };
  }, [pathname, hash]);

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
      <section className={styles.headerSection}>
        {syntheticTitle ? (
          <header>
            <Heading as="h1">{syntheticTitle}</Heading>
          </header>
        ) : (
          <i />
        )}
        <CopyPageButton />
      </section>
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
