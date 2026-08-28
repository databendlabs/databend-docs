import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.scss";
import { FaAngleDown } from "react-icons/fa6";

import { useDoc } from "@docusaurus/plugin-content-docs/client";
import axios from "axios";
import $t from "@site/src/utils/tools";
import TurndownService from "turndown";
import { LiaMarkdown } from "react-icons/lia";
import { RiClaudeFill, RiOpenaiFill } from "react-icons/ri";
import { SiPerplexity } from "react-icons/si";
import { LuCopy, LuCopyCheck } from "react-icons/lu";

const SPECIAL_LINKS = [
  "/guides/",
  "/guides/cloud/overview/platforms",
  "/guides/cloud/overview/pricing",
  "/guides/self-hosted/deployment/non-production/deploying-databend",
  "/guides/cloud/getting-started",
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
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { metadata } = useDoc();

  const sourceUrl = useMemo(
    () =>
      metadata?.source?.replace(
        "@site",
        "https://raw.githubusercontent.com/databendlabs/databend-docs/refs/heads/main",
      ) || "",
    [metadata],
  );

  const markAsCopied = useCallback(() => {
    setIsCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setIsCopied(false), 3000);
  }, []);

  const copyHtml = useCallback(async () => {
    const htmlContent = getPageContentAsHtml();
    if (!htmlContent) return;

    const markdownContent = convertHtmlToMarkdown(htmlContent);
    await navigator.clipboard.writeText(
      markdownContent.replace("Copy Page", ""),
    );
    markAsCopied();
  }, [markAsCopied]);

  const copyMarkdown = useCallback(
    async (url: string) => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          await navigator.clipboard.writeText(response.data);
          markAsCopied();
        } else {
          await copyHtml();
        }
      } catch {
        await copyHtml();
      } finally {
        setLoading(false);
      }
    },
    [copyHtml, markAsCopied],
  );

  const handleCopy = useCallback(() => {
    if (SPECIAL_LINKS.includes(metadata?.permalink || "")) {
      void copyHtml();
      return;
    }
    if (sourceUrl) void copyMarkdown(sourceUrl);
  }, [copyHtml, copyMarkdown, metadata?.permalink, sourceUrl]);

  const openExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const menuItems = useMemo(
    () => [
      {
        key: "copy",
        icon: <LuCopy size={20} />,
        label: $t("Copy Page"),
        description: $t("Copy page as Markdown for LLMs"),
        action: handleCopy,
      },
      {
        key: "markdown",
        icon: <LiaMarkdown size={21} />,
        label: $t("View as Markdown"),
        description: $t("View this page as plain text"),
        action: () => openExternal(sourceUrl),
      },
      {
        key: "gpt",
        icon: <RiOpenaiFill size={20} />,
        label: `${$t("Open in")} ChatGPT`,
        description: $t("Ask questions about this page"),
        action: () =>
          openExternal(
            `https://chat.openai.com/?hints=search&q=${encodeURIComponent(
              `Read from ${window.location.href} so I can ask questions about it.`,
            )}`,
          ),
      },
      {
        key: "claude",
        icon: <RiClaudeFill size={20} />,
        label: `${$t("Open in")} Claude`,
        description: $t("Ask questions about this page"),
        action: () =>
          openExternal(
            `https://claude.ai/new?q=${encodeURIComponent(
              `Read from ${window.location.href} so I can ask questions about it.`,
            )}`,
          ),
      },
      {
        key: "perplexity",
        icon: <SiPerplexity size={20} />,
        label: `${$t("Open in")} Perplexity`,
        description: $t("Ask questions about this page"),
        action: () =>
          openExternal(
            `https://www.perplexity.ai/search/new?q=${encodeURIComponent(
              `Read from ${window.location.href} so I can ask questions about it`,
            )}`,
          ),
      },
    ],
    [handleCopy, openExternal, sourceUrl],
  );

  const closeMenu = useCallback((returnFocus = false) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>("button") || [],
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  return (
    <div className={styles.copyPage} ref={rootRef}>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopy}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : isCopied ? (
            <LuCopyCheck size={18} aria-hidden="true" />
          ) : (
            <LuCopy size={18} aria-hidden="true" />
          )}
          <span>{loading ? $t("Copying...") : $t("Copy Page")}</span>
        </button>
        <button
          ref={triggerRef}
          type="button"
          className={styles.menuTrigger}
          aria-label={$t("Copy Page")}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="copy-page-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <FaAngleDown
            className={isOpen ? styles.chevronOpen : styles.chevron}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          id="copy-page-menu"
          ref={menuRef}
          className={styles.menu}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
        >
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={() => {
                closeMenu();
                item.action();
              }}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.menuText}>
                <span className={styles.menuLabel}>{item.label}</span>
                <span className={styles.menuDescription}>{item.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CopyDropdownButton;
