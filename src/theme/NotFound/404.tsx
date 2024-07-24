import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import { useMount } from "ahooks";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import Content from "./Content";

export default function NotFound404() {
  const pathname = ExecutionEnvironment.canUseDOM ? window?.location?.href : "";
  const redirectsMap = {
    "/doc/sql-reference": "/sql/sql-reference",
    "/doc/sql-commands": "/sql/sql-commands",
    "/doc/sql-functions": "/sql/sql-functions",
    "/doc/develop": "/developer/drivers",
    "/doc/deploy": "/guides/deploy",
    "/doc/cloud": "/guides/cloud",
    "/cloud/develop": "/developer/drivers",
    "/doc/sql-clients": "/guides/sql-clients",
    "/doc/load-data": "/guides/load-data",
    "/doc/visualize": "/guides/visualize",
    "/doc/monitor": "/guides/monitor",
    "/doc/overview": "/guides/overview",
    "/cloud/getting-started/new-account": "/guides/cloud/new-account",
  };
  useMount(() => {
    for (const [oldPath, newPath] of Object.entries(redirectsMap)) {
      if (pathname?.includes(oldPath)) {
        window.open(pathname.replace(oldPath, newPath), "_self");
      }
    }
  });
  return (
    <Layout
      title={translate({
        id: "theme.NotFound.title",
        message: "Page Not Found",
      })}
      description="Page Not Found"
    >
      <Content />
    </Layout>
  );
}
