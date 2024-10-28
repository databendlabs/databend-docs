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
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// import ProgressBar from "react-scroll-progress-bar";

function Footer() {
  const year = new Date().getFullYear();
  const { footer } = useThemeConfig();
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  return (
    <footer className={clsx("footer", styles.footer)}>
      {!isChina && (
        <Head>
          <script async src={useBaseUrl("/Koala/index.js")}></script>
          <script type="application/ld+json">
            {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Databend",
              "url": "https://www.databend.com/",
              "logo": "https://www.databend.com/img/resource/png/light-databend-single.png",
              "description": "Databend is a cloud-native, open-source data warehouse platform optimized for data ingestion, AI-driven analytics, and SQL compatibility.",
              "sameAs": [
                "https://github.com/databendlabs",
                "https://github.com/databendcloud",
                "https://x.com/DatabendLabs",
                "https://www.linkedin.com/company/databendlabs/",
                "https://medium.com/@databend",
                "https://www.reddit.com/r/DatafuseLabs/",
                "https://www.youtube.com/@DatabendLabs",
                "https://link.databend.com/join-slack",
                "https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6",
                "https://www.facebook.com/databendcloud"
              ],
              "mainEntityOfPage": [
                { "@type": "WebPage", "url": "https://www.databend.com/", "name": "Databend" },
                { "@type": "WebPage", "url": "https://www.databend.com/databend-cloud/", "name": "Databend Cloud" },
                { "@type": "WebPage", "url": "https://www.databend.com/databend-enterprise/", "name": "Databend Enterprise" },
                { "@type": "WebPage", "url": "https://www.databend.com/databend/", "name": "Databend Community" },
                { "@type": "WebPage", "url": "https://www.databend.com/security/", "name": "Databend Security" },
                { "@type": "WebPage", "url": "https://www.databend.com/apply/", "name": "Join the Databend Cloud for FREE" },
                { "@type": "WebPage", "url": "https://www.databend.com/contact-us/", "name": "Databend Support" },
                { "@type": "WebPage", "url": "https://www.databend.com/blog/", "name": "Databend Blog" },
                { "@type": "WebPage", "url": "https://www.databend.com/about/", "name": "About Databend" },
                { "@type": "WebPage", "url": "https://www.databend.com/download/", "name": "Databend Download" },
                { "@type": "WebPage", "url": "https://www.databend.com/use-cases/", "name": "Databend Use Cases" },
                { "@type": "WebPage", "url": "https://www.databend.com/comparison/", "name": "Comparisons between Databend Cloud and Snowflake" },
                { "@type": "WebPage", "url": "https://www.databend.com/join-us/", "name": "Join Us" },
                { "@type": "WebPage", "url": "https://www.databend.com/resource/", "name": "Databend Resources & Logos" },
                { "@type": "WebPage", "url": "https://docs.databend.com/guides/", "name": "Databend Guides" },
                { "@type": "WebPage", "url": "https://docs.databend.com/tutorials/", "name": "Databend Tutorials" },
                { "@type": "WebPage", "url": "https://docs.databend.com/developer/", "name": "Databend Developer Resources" },
                { "@type": "WebPage", "url": "https://docs.databend.com/sql/", "name": "Databend SQL Reference" },
                { "@type": "WebPage", "url": "https://docs.databend.com/release-notes/", "name": "Databend Release Notes" }
              ],
              "foundingDate": "2021",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "areaServed": "Worldwide",
                "email": "hi@databend.com",
                "url": "https://www.databend.com/contact-us/"
              },
              "offers": [
                {
                  "@type": "Product",
                  "name": "Databend Cloud",
                  "description": "Databend is a Cost-Effective Cloud Data Warehouse, pay-as-you-use cloud data warehouse with enterprise features.",
                  "url": "https://www.databend.com/databend-cloud/",
                  "priceCurrency": "USD",
                  "offers": {
                    "@type": "Offer",
                    "price": "Varies by usage",
                    "url": "https://www.databend.com/pricing/"
                  },
                   "potentialAction": {
                    "@type": "Action",
                    "name": "Join the private beta for FREE",
                    "url": "https://www.databend.com/apply/"
                  }
                },
                {
                  "@type": "Product",
                  "name": "Databend Enterprise",
                  "description": "Self-hosted version with advanced enterprise features and support.",
                  "url": "https://www.databend.com/databend-enterprise/"
                },
                {
                  "@type": "Product",
                  "name": "Databend Community",
                  "description": "Free, self-hosted version for community-driven use.",
                  "url": "https://www.databend.com/databend/"
                }
              ],
              {
                "@type": "PostalAddress",
                "streetAddress": "401 RYLAND ST. STE 200-A",
                "addressLocality": "Reno",
                "addressRegion": "NV",
                "postalCode": "89502",
                "addressCountry": "USA"
              }
            }
          `}
          </script>
        </Head>
      )}
      <div className={clsx("footer-items", styles.footerItems)}>
        {(footer.links[0].items as any[])?.map((item, index) => {
          return (
            <Link to={item.to} key={index}>
              <h6>{item.label}</h6>
            </Link>
          );
        })}
        {/* <span>|</span>
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
        })} */}
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
