// Copyright 2023 DatabendLabs.
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MDXA from "@site/src/theme/MDXComponents/A";
import React, { FC } from "react";
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
  const components = {
    a: MDXA,
  };
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {isChina ? cn : en}
    </ReactMarkdown>
  );
};
export default LanguageDocs;
