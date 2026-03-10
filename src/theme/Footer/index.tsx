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
import styles from "./index.module.scss";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useMount } from "ahooks";
import "@ant-design/v5-patch-for-react-19";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import pluginConfig from "@site/src/components/Config/CookieConsentConfig";
import $t, { shouldShowConsent } from "@site/src/utils/tools";
// import ProgressBar from "react-scroll-progress-bar";
const COOKIES_CLASS = "show--consent";

function Footer() {
  const year = new Date().getFullYear();
  const { footer } = useThemeConfig();
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  useMount(() => {
    redirectPathname();
    if (ExecutionEnvironment.canUseDOM) {
      CookieConsent.run(pluginConfig);
      const html = document.documentElement;
      const updateHtmlClass = () => {
        const shouldShow = shouldShowConsent();
        if (shouldShow && !html.classList.contains(COOKIES_CLASS)) {
          html.classList.add(COOKIES_CLASS);
          // html.classList.add("cc--darkmode");
        } else if (!shouldShow && html.classList.contains(COOKIES_CLASS)) {
          html.classList.remove(COOKIES_CLASS);
        }
      };
      updateHtmlClass();
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            updateHtmlClass();
          }
        }
      });
      observer.observe(html, { attributes: true, attributeFilter: ["class"] });
      return () => {
        observer.disconnect();
      };
    }
  });
  function redirectPathname() {
    const pathname = window.location.pathname;
    const redirectRules = isChina
      ? {
          "/en/sql/": "/sql/",
          "/en/developer/": "/developer/",
          "/en/tutorials/": "/tutorials/",
          "/en/guides/": "/guides/",
        }
      : {
          "/zh/sql/": "/sql/",
          "/zh/developer/": "/developer/",
          "/zh/tutorials/": "/tutorials/",
          "/zh/guides/": "/guides/",
        };
    const prefix = isChina ? "/en/" : "/zh/";
    if (!pathname?.startsWith(prefix)) return;
    for (let key in redirectRules) {
      if (pathname.startsWith(key)) {
        const newPathname = pathname.replace(key, redirectRules[key]);
        window.location.href = newPathname;
      }
    }
  }

  return (
    <footer className={clsx("footer", styles.footer)}>
      <Head>
        <meta name="robots" content="index, follow"></meta>
      </Head>
      {!isChina && (
        <Head>
          <script async src={useBaseUrl("/Koala/index.js")}></script>
          <script async src={useBaseUrl("/ReoDev/index.js")}></script>
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
              { "@type": "WebPage", "url": "https://app.databend.com/register/", "name": "Join the Databend Cloud for FREE" },
              { "@type": "WebPage", "url": "https://www.databend.com/contact-us/", "name": "Databend Support" },
              { "@type": "WebPage", "url": "https://www.databend.com/use-cases/", "name": "Databend Use Cases" },
              { "@type": "WebPage", "url": "https://www.databend.com/blog/", "name": "Databend Blog" },
              { "@type": "WebPage", "url": "https://www.databend.com/about/", "name": "About Databend" },
              { "@type": "WebPage", "url": "https://www.databend.com/download/", "name": "Databend Download" },
              { "@type": "WebPage", "url": "https://www.databend.com/comparison/", "name": "Comparisons between Databend Cloud and Snowflake" },
              { "@type": "WebPage", "url": "https://www.databend.com/join-us/", "name": "Join Us" },
              { "@type": "WebPage", "url": "https://www.databend.com/resource/", "name": "Databend Resources & Logos" },
              { "@type": "WebPage", "url": "https://www.databend.com/mcp/", "name": "Connect AI Agents to Databend" }
            ],
            "foundingDate": "2021",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "areaServed": "Worldwide",
              "email": "hi@databend.com",
              "url": "https://www.databend.com/contact-us/"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "401 RYLAND ST. STE 200-A",
              "addressLocality": "Reno",
              "addressRegion": "NV",
              "postalCode": "89502",
              "addressCountry": "USA"
            },
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
      </div>
      <div className={styles.footerCopyright}>
        <p>{$t("All rights reserved.", true, { year })}</p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
