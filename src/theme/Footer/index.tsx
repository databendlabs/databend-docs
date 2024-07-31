/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";
import CookiesConsent from "../../components/CookiesConsent";
import styles from "./index.module.scss";
import * as icons from "../../components/Icons";
// import ProgressBar from "react-scroll-progress-bar";

function Footer() {
  const year = new Date().getFullYear();
  const { footer } = useThemeConfig();
  return (
    <footer className={clsx("footer", styles.footer)}>
      <Head>
        <script async src={useBaseUrl("/Koala/index.js")}></script>
      </Head>
      <div className={clsx("footer-items", styles.footerItems)}>
        {(footer.links[0].items as any[])?.map((item, index) => {
          return (
            <Link to={item.to} key={index}>
              <h6>{item.label}</h6>
            </Link>
          );
        })}
        <span>|</span>
        {(footer.links[1].items as any[])?.map((item, index) => {
          const Icon = icons[item.label];
          return (
            <Link to={item.href} key={index}>
              <h6>
                <span className={clsx("icon", styles.icon)}>
                  <Icon size={20} />
                </span>
                {item.label}
              </h6>
            </Link>
          );
        })}
      </div>
      <div className={styles.footerCopyright}>
        <p>
          Copyright © {year} The Databend Community. Apache, Apache OpenDAL and
          OpenDAL are either registered trademarks or trademarks of the Apache
          Software Foundation.
        </p>
      </div>
      <CookiesConsent />
      {/* <div className={styles.ProgressBar}>
        <ProgressBar
          height="2px"
          bgcolor="var(--ifm-color-primary)"
          duration="0.2"
        />
      </div> */}
    </footer>
  );
}

export default React.memo(Footer);
