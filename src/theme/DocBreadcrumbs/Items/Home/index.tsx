import React from "react";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function HomeBreadcrumbItem() {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();

  // 从配置中获取 navbar items
  const navbarItems =
    (
      siteConfig?.themeConfig?.navbar as {
        items?: { to: string; label: string }[];
      }
    )?.items || [];

  // 计算 menu 和 menuName
  const menu = `/${pathname.split("/")[1] || ""}/`;
  const menuName =
    navbarItems.find((item) => item.to === menu)?.label || "Home";

  // 生成链接
  const homeHref = useBaseUrl(menu);

  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: "theme.docs.breadcrumbs.home",
          message: "Home page",
          description: "The ARIA label for the home page in the breadcrumbs",
        })}
        className="breadcrumbs__link"
        href={homeHref}
      >
        {menuName}
      </Link>
    </li>
  );
}
