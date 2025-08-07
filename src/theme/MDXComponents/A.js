import React from "react";
import Link from "@docusaurus/Link";
import { Tooltip } from "antd";
import LinkSvg from "@site/static/icons/link";
import styles from "./styles.module.scss";
function hasProtocolPrefix(str) {
  return str.startsWith("http://") || str.startsWith("https://");
}
export default function MDXA(props) {
  if (
    props?.href?.includes("https://github.com/databendlabs/databend/pull/") ||
    props?.href?.includes("https://github.com/databendlabs/databend/pull/")
  ) {
    return <Link {...props} />;
  }
  if (hasProtocolPrefix(props?.href)) {
    return (
      <Tooltip
        destroyTooltipOnHide
        overlayClassName={styles.tooltip}
        title="Open in the new tab"
      >
        <span className={styles.linkWrap}>
          <a {...props} target="_blank" rel="noopener noreferrer" />
          <LinkSvg />
        </span>
      </Tooltip>
    );
  } else {
    return <Link {...props} />;
  }
}
