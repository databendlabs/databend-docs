import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import {
  useDocById,
  findFirstSidebarItemLink,
} from "@docusaurus/plugin-content-docs/client";
import { usePluralForm } from "@docusaurus/theme-common";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";
import DocsSvg from "@site/static/icons/docs.svg";
import FolderSvg from "@site/static/icons/folder.svg";

// import Heading from "@theme/Heading";
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";

import styles from "./styles.module.css";

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: "1 item|{count} items",
          id: "theme.docs.DocCard.categoryDescription.plurals",
          description:
            "The default description for a category card in the generated index about how many items this category includes",
        },
        { count }
      )
    );
}

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link
      href={href}
      className={clsx("card padding--lg", styles.cardContainer)}
    >
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}): ReactNode {
  return (
    <CardContainer href={href}>
      <div className={styles.databendCard}>
        <div className={styles.iconWrap}>{icon}</div>
        <div className={styles.description}>
          <h4 style={{ marginBottom: 0 }}>{title}</h4>
          <div
            className={clsx("text--truncate", styles.cardDescription)}
            title={description}
          >
            {description}
          </div>
        </div>
      </div>
    </CardContainer>
  );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon={<FolderSvg></FolderSvg>}
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({ item }: { item: PropSidebarItemLink }): ReactNode {
  const icon = isInternalUrl(item.href) ? <DocsSvg /> : "🔗";
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({ item }: any): ReactNode {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
