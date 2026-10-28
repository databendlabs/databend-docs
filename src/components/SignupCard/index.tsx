// Copyright 2025 DatabendLabs.
// Body sign-up card for doc pages. Based on the blog card
// (website/src/components/blog-signup-ad), with theme variables for light and dark.
import React, { FC, ReactElement } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import $t from "@site/src/utils/tools";
import styles from "./styles.module.scss";

interface SignupCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

const SignupCard: FC<SignupCardProps> = ({
  title,
  description,
  buttonText,
}): ReactElement => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  const url = isChina
    ? "https://app.databend.cn/register?loc=doc-body"
    : "https://app.databend.com/register?loc=doc-body";

  return (
    <aside className={styles.card} aria-label="Databend Cloud sign-up">
      <div className={styles.text}>
        <h3 className={styles.title}>{title ?? $t("Get started today")}</h3>
        <p className={styles.desc}>
          {description ??
            $t(
              "Get started in minutes with Databend Cloud—the agent-ready data warehouse for analytics, search, AI, and Python Sandbox—and receive $200 in free credits.",
            )}
        </p>
      </div>
      <a className={styles.button} href={url} target="_blank" rel="noreferrer">
        {buttonText ?? $t("Sign up")}
      </a>
    </aside>
  );
};

export default SignupCard;
