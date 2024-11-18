// Copyright 2023 DatabendLabs.
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React, { FC, ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface IProps {
  cn?: string;
  en?: string;
}
const LanguageDocs: FC<IProps> = ({ cn = "", en = "" }): any => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {isChina ? cn : en}
    </ReactMarkdown>
  );
};
export default LanguageDocs;
