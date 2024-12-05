import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Content from "./Content";

export default function NotFound404() {
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
