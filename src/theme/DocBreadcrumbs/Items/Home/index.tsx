import React, { useState } from "react";
import { useMount } from "ahooks";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import docusaurusConfig from "@generated/docusaurus.config";
// https://github.com/facebook/docusaurus/issues/6953
// https://github.com/facebook/docusaurus/issues/6096
export default function HomeBreadcrumbItem() {
  const canUseDOM = ExecutionEnvironment.canUseDOM;
  const [menuName, setMenuName] = useState("");
  const pathname = canUseDOM ? window?.location?.pathname : "/";
  const menu = canUseDOM ? `/${pathname?.split("/")[1]}/` : "/";
  const homeHref = useBaseUrl(menu);
  useMount(() => {
    if (canUseDOM) {
      const menuItems = (docusaurusConfig?.themeConfig?.navbar as any)?.items;
      setMenuName(menuItems?.find((item) => item.to === menu)?.label);
    }
  });
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
