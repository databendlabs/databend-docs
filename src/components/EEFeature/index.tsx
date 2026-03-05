// Copyright 2023 DatabendLabs.
import clsx from "clsx";
import React, { FC, ReactElement, useEffect } from "react";
import styles from "./styles.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
interface IProps {
  featureTitle?: string;
  featureName: string;
  wholeDesc?: string;
}
const EEFeature: FC<IProps> = ({
  featureName,
  wholeDesc,
  featureTitle = "ENTERPRISE EDITION FEATURE",
}): ReactElement => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  function A() {
    return (
      <>
        {isChina ? (
          <>
            如需获取许可证，请
            <a target="_blank" href={"https://www.databend.cn/contact-us"}>
              联系 Databend 支持团队
            </a>
            。
          </>
        ) : (
          <>
            Contact{" "}
            <a target="_blank" href={"https://www.databend.com/contact-us"}>
              Databend Support
            </a>{" "}
            for a license.
          </>
        )}
      </>
    );
  }
  useEffect(() => {
    const h1 = document
      ?.querySelector(".theme-doc-markdown")
      ?.querySelector("header")?.firstChild as HTMLElement;
    if (h1) {
      h1?.classList?.add("DOCITEM-PAGE-EE-TIPS-BEFORE-DOM");
    }
  }, []);
  return (
    <div className="DOCITEM-PAGE-EE-TIPS">
      <div className={clsx(styles.wrap)}>
        <div className={styles.button}>
          {isChina ? "企业版功能" : featureTitle}
        </div>
        <div className={styles.desc}>
          {wholeDesc ? (
            <>
              {wholeDesc} <A />
            </>
          ) : (
            <>
              {isChina ? (
                <>
                  {featureName}是企业版功能。 <A />
                </>
              ) : (
                <>
                  {featureName} is an Enterprise Edition feature. <A />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EEFeature;
