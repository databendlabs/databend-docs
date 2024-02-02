// Copyright 2023 DatabendLabs.
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { FC, ReactElement, ReactNode } from 'react';
interface IProps {
  cn: ReactNode;
  en: ReactNode;
}
const LanguageDocs: FC<IProps> = ({cn, en}): ReactElement=> {
  const {siteConfig: {customFields: { isChina } } } = useDocusaurusContext() as any;
  return (
    <>
      {
        isChina
        ? <>{cn}</>
        : <>{en}</>
      }
    </>
  );
};
export default LanguageDocs;