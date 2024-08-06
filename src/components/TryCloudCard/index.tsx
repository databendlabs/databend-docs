// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement } from "react";
import styles from "./styles.module.scss";
import Close from "../Icons/close.svg";
import { useSessionStorageState } from "ahooks";
import CheckIcon from "./CheckIcon";
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
  const features = [
    $t("Low-cost"),
    $t("Fast Analytics"),
    $t("Easy Data Ingestion"),
    $t("Elastic Scaling"),
  ];
  return (
    <>
      {!hidden && (
        <div className={styles.card}>
          <div className={styles.header}>
            <h6>{$t("Explore Databend Cloud for FREE")}</h6>
            <span onClick={closeCard} className={styles.close}>
              <Close />
            </span>
          </div>
          <div className={styles.desc}>
            {features?.map((item, index) => {
              return (
                <div className={styles.descItem} key={index}>
                  <span>
                    {" "}
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </div>
              );
            })}
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
