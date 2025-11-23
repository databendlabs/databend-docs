// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement } from "react";
import styles from "./styles.module.scss";
import Close from "@site/static/icons/close.svg";
import { useSessionStorageState } from "ahooks";
import $t from "@site/src/utils/tools";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
const TryCloudCard: FC = (): ReactElement => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  const [hidden, setHiddenFlag] = useSessionStorageState("DATABEND_TOC_CARD", {
    defaultValue: "",
  });
  const closeCard = () => {
    setHiddenFlag("closed");
  };
  const lines = [
    $t(
      "Multimodal, object-storage-native warehouse for BI, vectors, search, and geo."
    ),
    $t("Snowflake-compatible SQL with automatic scaling."),
    $t("Sign up and get $200 in credits."),
  ];
  return (
    <>
          {!hidden && (
            <div className={styles.card}>
              <div className={styles.header}>
                <h6>{$t("Try Databend Cloud for FREE")}</h6>
                <span onClick={closeCard} className={styles.close}>
                  <Close />
                </span>
          </div>
          <div className={styles.desc}>
            {lines.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
          <a
            href={
              isChina
                ? "https://app.databend.cn/register?r=doc-card"
                : "https://www.databend.com/apply/?r=doc-card"
            }
            className={styles.button}
          >
            {$t("Try it today")}
          </a>
        </div>
      )}
    </>
  );
};
export default TryCloudCard;
