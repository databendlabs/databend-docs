import React from "react";
import NotFoundSvg from "./no-found.svg";
import clsx from "clsx";
import $t from "@site/src/utils/tools";
import styles from "./not-found.module.scss";
import { Button, Space } from "antd";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Content() {
  const {
    siteConfig: {
      customFields: { homeLink },
    },
  } = useDocusaurusContext();
  return (
    <div
      className={clsx("g-align-c global-container-width", styles.rowContainer)}
    >
      <NotFoundSvg></NotFoundSvg>
      <Space className={styles.text} direction="vertical" size={20}>
        <div className={styles.notFoundTitle}>{$t("PAGE NOT FOUND")}</div>
        <div className="fontSize20">
          {$t("Please check your link or head Home to regroup.")}
        </div>
        <Space size={16}>
          <Button type="primary" href="/guides">
            {$t("Guides")}
          </Button>
          <Button href={homeLink + "/blog"} target="_blank">
            {$t("Blog")}
          </Button>
        </Space>
      </Space>
    </div>
  );
}
