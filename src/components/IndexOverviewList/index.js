// Copyright 2023 DatabendLabs.
import React, { useState } from "react";
import { useDoc, useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import { useMount } from "ahooks";

const IndexOverviewList = () => {
  const { metadata } = useDoc();
  const sidebar = useDocsSidebar();
  const [items, setItems] = useState([]);

  useMount(() => {
    const permalink = metadata?.permalink;
    const targetDoc = findItemByPermalink(sidebar?.items || [], permalink);
    setItems(targetDoc?.items || []);
  });

  function findItemByPermalink(sidebarItems, permalink) {
    const sidebar = sidebarItems.find((item) => item?.href === permalink);
    if (sidebar) {
      return sidebar;
    }
    for (const sidebar of sidebarItems) {
      if (sidebar?.items?.length > 0) {
        const nestedItem = findItemByPermalink(sidebar?.items || [], permalink);
        if (nestedItem) {
          return nestedItem;
        }
      }
    }
    return null;
  }

  return (
    <>
      {items?.length > 0 && (
        <ul>
          {items?.map((item) => (
            <li key={item?.href}>
              <Link to={item?.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default IndexOverviewList;
