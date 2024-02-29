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


function Footer() {
  const year = new Date().getFullYear()
  const {footer} = useThemeConfig();
  const {siteConfig: {customFields: {isChina}}} = useDocusaurusContext();

  const algolia = isChina
    ? {
        appId: 'FUCSAUXK2Q',
        apiKey: '0f200c10999f19584ec9e31b5caa9065',
        indexName: 'databend',
        contextualSearch: true
    }
    : {
      appId: 'XA8ZCKIEYU',
      apiKey: '81e5ee11f82ed1c5de63ef7ea0551abf',
      indexName: 'databend',
      contextualSearch: true
    }
  useEffect(() => {
    const script = document.createElement('script');
    const searchElements = document.querySelector('[class^="searchBox_"]');
    script.src = "https://cdn.jsdelivr.net/npm/@docsearch/js@3";
    script.async = false; // 由于你不想异步加载，设置为 false
    script.onload = () => {
      // 确保脚本加载完成后再执行 docsearch 初始化代码
      // 这里初始化你的 docsearch
      docsearch({
        ...algolia,
        container: searchElements
      });
    };

    // 将脚本元素添加到 document 中
    document.body.appendChild(script);
    // 组件卸载时移除脚本
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
     <footer className={clsx('footer', styles.footer)}>
        <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"/>
          <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script>
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
