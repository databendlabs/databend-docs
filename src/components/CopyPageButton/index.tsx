import React, { useState, useMemo, useCallback } from "react";
import { Button, Dropdown, Flex, Spin } from "antd";
import styles from "./styles.module.scss";
import DownArrow from "@site/static/icons/down.svg";
import MarkdownSvg from "@site/static/icons/markdown.svg";
import CopySvg from "@site/static/icons/copy.svg";
import CopiedSvg from "@site/static/icons/copied.svg";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import axios from "axios";
import $t from "@site/src/utils/tools";
// mark
// import TurndownService from "turndown";
// const turndownService = new TurndownService();
// const getPageContentAsHtml = (): string | null => {
//   const contentElement = document.querySelector("article");
//   return contentElement ? contentElement.innerHTML : null;
// };

// const convertHtmlToMarkdown = (html: string): string => {
//   return turndownService.turndown(html);
// };
const CopyDropdownButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { metadata } = useDoc();
  const sourceUrl = useMemo(() => {
    return (
      metadata?.source?.replace(
        "@site",
        "https://raw.githubusercontent.com/databendlabs/databend-docs/refs/heads/main"
      ) || ""
    );
  }, [metadata]);
  const handleCopy = useCallback((url: string) => {
    if (!url) return;
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setIsCopied(true);
        if (response.status === 200) {
          navigator.clipboard.writeText(response.data);
        } else {
          alert($t("Failed to copy markdown"));
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
  }, []);
  const menu = useMemo(() => {
    const items = [
      {
        key: "copy",
        icon: <CopySvg width={16} />,
        label: $t("Copy Page"),
        description: $t("Copy page as Markdown for LLMs"),
      },
      {
        key: "markdown",
        icon: <MarkdownSvg width={18} />,
        label: $t("View as Markdown"),
        description: $t("View this page as plain text"),
      },
    ];

    return {
      items: items.map(({ key, icon, label, description }) => ({
        key,
        label: (
          <div>
            <div style={{ fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{description}</div>
          </div>
        ),
        icon: <Button icon={icon} />,
      })),
      onClick: ({ key }: { key: string }) => {
        if (key === "copy") handleCopy(sourceUrl);
        if (key === "markdown") window.open(sourceUrl, "_blank");
      },
    };
  }, [sourceUrl, handleCopy]);
  const renderButtonContent = useMemo(
    () => (
      <Flex align="center" gap={6}>
        {loading ? (
          <Spin size="small" />
        ) : isCopied ? (
          <CopiedSvg width={16} />
        ) : (
          <CopySvg width={16} />
        )}
        <span>{loading ? $t("Copying...") : $t("Copy Page")}</span>
      </Flex>
    ),
    [loading, isCopied]
  );

  return (
    <Dropdown.Button
      onClick={() => handleCopy(sourceUrl)}
      menu={menu}
      placement="bottomRight"
      icon={<DownArrow width={18} height={"auto"} />}
      className={styles.buttonCainter}
      trigger={["click"]}
    >
      {renderButtonContent}
    </Dropdown.Button>
  );
};

export default CopyDropdownButton;
