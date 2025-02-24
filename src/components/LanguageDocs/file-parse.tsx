// Copyright 2023 DatabendLabs.
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React, { FC, ReactNode } from "react";
interface IProps {
  cn?: ReactNode;
  en?: ReactNode;
}

const LanguageFileParse: FC<IProps> = ({ cn = "", en = "" }): any => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;

  return <>{isChina ? cn : en}</>;
};
export default LanguageFileParse;
