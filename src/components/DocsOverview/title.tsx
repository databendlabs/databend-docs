// Copyright 2024 DatabendLabs.
import { FC, ReactElement } from "react";
import {
  LightDatabendHorizontalSvg,
  DarkDatabendHorizontalSvg,
} from "databend-logos";
import styles from "./styles.module.scss";
import Link from "@docusaurus/Link";
import clsx from "clsx";
interface IProps {
  isNeedLogo?: boolean;
  title?: string;
  description?: string;
  link: {
    to: string;
    text: string;
  };
}
const Title: FC<IProps> = ({
  isNeedLogo = false,
  title = "",
  description,
  link,
}): ReactElement => {
  return (
    <div className={styles.homPpageSectionLeft}>
      {isNeedLogo && (
        <>
          <div className={clsx(styles.logo, "databend-logo-01")}>
            <LightDatabendHorizontalSvg />
          </div>
          <div className={clsx(styles.logo, "databend-logo-02")}>
            <DarkDatabendHorizontalSvg />
          </div>
        </>
      )}
      {title && <h3>{title}</h3>}
      {description && <div>{description}</div>}

      {link?.text && (
        <Link
          title={link?.text}
          style={{ marginTop: "12px", display: "inline-block" }}
          to={link?.to}
        >
          {link?.text} →
        </Link>
      )}
    </div>
  );
};
export default Title;
