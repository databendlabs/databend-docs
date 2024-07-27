import React, { MouseEvent, useState } from "react";
import clsx from "clsx";
import { useDocsSidebar } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/DocRoot/Layout/Main";

import styles from "./styles.module.css";
import { Image } from "antd";

export default function DocRootLayoutMain({
  hiddenSidebarContainer,
  children,
}: Props): JSX.Element {
  const sidebar = useDocsSidebar();
  const [previewImage, setPreviewImage] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");

  function getImgElement(e: MouseEvent<HTMLElement>) {
    const target = e.target as HTMLImageElement;
    const src = target?.currentSrc;
    if (src) {
      setPreviewImageSrc(src);
      setPreviewImage(true);
    }
  }
  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        onClick={getImgElement}
        className={clsx(
          "container padding-top--md padding-bottom--lg",
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {children}
      </div>
      <Image
        width={200}
        style={{ display: "none" }}
        preview={{
          scaleStep: 0.25,
          visible: previewImage,
          src: previewImageSrc,
          onVisibleChange: (value) => {
            setPreviewImage(value);
          },
        }}
      />
    </main>
  );
}
