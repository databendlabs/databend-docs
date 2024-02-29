/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import CookiesConsent from '../../components/CookiesConsent';
import styles from './index.module.scss';
import * as icons from "../../components/Icons"
import RedirectComponent from '@site/src/components/RedirectComponent';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const GLOBAL_SEARCH_ID = 'GLOBAL-ID-SEARCH-229';
function Footer() {
  const year = new Date().getFullYear()
  const {footer} = useThemeConfig();
  const {siteConfig: {customFields: {algolia}}} = useDocusaurusContext();
  useEffect(() => {
    const id = document.getElementById(GLOBAL_SEARCH_ID);
    if (!id) {
      const script = document.createElement('script');
      script.id = GLOBAL_SEARCH_ID;
      script.src = "https://cdn.jsdelivr.net/npm/@docsearch/js@3";
      script.async = true;
      script.onload = () => {
        setSearch();
      };
      document.body.appendChild(script);
    } else {
      setSearch();
    }

    function setSearch() {
      const container = document.querySelector('[class^="searchBox_"]');
      docsearch({
        ...algolia,
        container
      });
    }
  }, []);
  return (
     <footer className={clsx('footer', styles.footer)}>
        <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"/>
        </Head>
        <div className={clsx('footer-items', styles.footerItems)}>
          {footer.links[0].items.map((item,index)=>{
            return <Link to={item.to} key={index}><h6>{item.label}</h6></Link>
          })}<span>|</span>
          {footer.links[1].items.map((item,index)=>{
            const Icon = icons[item.label]
            return<Link to={item.href} key={index}><h6><span className={clsx('icon', styles.icon)}><Icon size={20}/></span>{item.label}</h6></Link>
          })}
          </div>
        <div className={styles.footerCopyright}>
          <p>Copyright © {year} The Databend Community. Built with Docusaurus. Apache, Apache OpenDAL and OpenDAL are either registered trademarks or trademarks of the Apache Software Foundation.</p>
        </div>
      <RedirectComponent to="https://docs.databend.com" />
      <CookiesConsent />
    </footer>
  );
}

export default React.memo(Footer);
