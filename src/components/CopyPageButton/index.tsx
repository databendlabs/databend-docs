import React, { useState, useMemo, useCallback } from "react";
import { Button, Dropdown, Flex, Spin } from "antd";
import styles from "./styles.module.scss";
import DownArrow from "@site/static/icons/down.svg";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import axios from "axios";
import $t from "@site/src/utils/tools";
import TurndownService from "turndown";
import { LiaMarkdown } from "react-icons/lia";
import { RiOpenaiFill } from "react-icons/ri";
import { RiClaudeFill } from "react-icons/ri";
import { SiPerplexity } from "react-icons/si";
import { LuCopy } from "react-icons/lu";
import { LuCopyCheck } from "react-icons/lu";

const SPECIAL_LINKS = [
  "/guides/",
  "/guides/products/dc/platforms",
  "/guides/products/dc/pricing",
  "/guides/deploy/deploy/non-production/deploying-databend",
  "/guides/cloud/new-account",
  "/release-notes/",
];

const getPageContentAsHtml = (): string | null => {
  const contentElement = document.querySelector("article");
  return contentElement ? contentElement.innerHTML : null;
};

const convertHtmlToMarkdown = (html: string): string => {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
};
const CopyDropdownButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { metadata } = useDoc();
  function copyHtml() {
    setIsCopied(true);
    const htmlContent = getPageContentAsHtml();
    const markdownContent = convertHtmlToMarkdown(htmlContent);
    navigator.clipboard.writeText(markdownContent?.replace("Copy Page", ""));
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }
  function copyMarkdown(url: string) {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setIsCopied(true);
        if (response.status === 200) {
          navigator.clipboard.writeText(response.data);
        } else {
          copyHtml();
        }
      })
      .catch(() => {
        copyHtml();
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
  }
  const sourceUrl = useMemo(() => {
    return (
      metadata?.source?.replace(
        "@site",
        "https://raw.githubusercontent.com/databendlabs/databend-docs/refs/heads/main"
      ) || ""
    );
  }, [metadata]);
  const handleCopy = useCallback((url: string) => {
    const nowLink = metadata?.permalink;
    if (SPECIAL_LINKS?.some((link) => link === nowLink)) {
      copyHtml();
      return;
    }
    if (!url) return;
    copyMarkdown(url);
  }, []);
  const menu = useMemo(() => {
    const items = [
      {
        key: "copy",
        icon: <LuCopy size={18} />,
        label: $t("Copy Page"),
        description: $t("Copy page as Markdown for LLMs"),
      },
      {
        key: "markdown",
        icon: <LiaMarkdown size={18} />,
        label: $t("View as Markdown"),
        description: $t("View this page as plain text"),
      },
      {
        key: "gpt",
        icon: <RiOpenaiFill size={18} />,
        label: $t("Open in ChatGPT"),
        description: $t("Ask questions about this page"),
      },
      {
        key: "claude",
        icon: <RiClaudeFill size={18} />,
        label: $t("Open in Claude"),
        description: $t("Ask questions about this page"),
      },
      {
        key: "perplexity",
        icon: <SiPerplexity size={18} />,
        label: $t("Open in Perplexity"),
        description: $t("Ask questions about this page"),
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
        if (key === "gpt")
          window.open(
            `https://chat.openai.com/?hints=search&q=Read from ${window.location.href} so I can ask questions about it.`
          );
        if (key === "claude")
          window.open(
            `https://claude.ai/new?q=Read from ${window.location.href} so I can ask questions about it.`
          );
        if (key === "perplexity") {
          window.open(
            `https://www.perplexity.ai/search/new?q=Read from ${window.location.href} so I can ask questions about it`
          );
        }
      },
    };
  }, [sourceUrl, handleCopy]);
  const renderButtonContent = useMemo(
    () => (
      <Flex className={styles.buttonText} align="center" gap={6}>
        {loading ? (
          <Spin size="small" />
        ) : isCopied ? (
          <LuCopyCheck size={18} />
        ) : (
          <LuCopy size={18} />
        )}
        <span className={styles.buttonText}>
          {loading ? $t("Copying...") : $t("Copy Page")}
        </span>
      </Flex>
    ),
    [loading, isCopied]
  );

  return (
    <Dropdown.Button
      onClick={() => handleCopy(sourceUrl)}
      menu={menu}
      placement="bottomRight"
      icon={<DownArrow className={styles.svg} width={18} height={18} />}
      className={styles.buttonCainter}
      trigger={["click"]}
    >
      {renderButtonContent}
    </Dropdown.Button>
  );
};

export default CopyDropdownButton;
