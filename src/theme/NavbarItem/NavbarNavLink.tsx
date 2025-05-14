import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { isRegexpStringMatch } from "@docusaurus/theme-common";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/NavbarItem/NavbarNavLink";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
const EN_DOCS_HOME_LINK = "https://docs.databend.com/";
const CN_DOCS_HOME_LINK = "https://docs.databend.cn/";

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): ReactNode {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext();

  function replacePathname(url: string) {
    if (isChina) {
      if (url?.startsWith("pathname:///en/")) {
        return url.replace("pathname:///en/", EN_DOCS_HOME_LINK);
      } else if (url?.startsWith("pathname:///")) {
        return url.replace("pathname:///", CN_DOCS_HOME_LINK);
      }
    } else {
      if (url?.startsWith("pathname:///zh/")) {
        return url.replace("pathname:///zh/", CN_DOCS_HOME_LINK);
      } else if (url?.startsWith("pathname:///")) {
        return url.replace("pathname:///", EN_DOCS_HOME_LINK);
      }
    }

    return url;
  }

  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  // console.log(toUrl);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
        children: (
          <>
            {label}
            {isExternalLink && (
              <IconExternalLink
                {...(isDropdownLink && { width: 12, height: 12 })}
              />
            )}
          </>
        ),
      };

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    );
  }

  return (
    <Link
      to={replacePathname(toUrl)}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
