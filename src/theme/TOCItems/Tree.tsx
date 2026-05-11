/**
 * Swizzled TOCItems/Tree to fix active highlight on click.
 * useTOCHighlight only listens to scroll/resize, so clicking a TOC link
 * that doesn't trigger a scroll won't update the active class.
 */
import React from 'react';
import Link from '@docusaurus/Link';

const LINK_ACTIVE_CLASS = 'table-of-contents__link--active';

function TOCItemTree({toc, className, linkClassName, isChild}: {
  toc: any[];
  className?: string;
  linkClassName?: string;
  isChild?: boolean;
}) {
  if (!toc.length) {
    return null;
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const link = e.currentTarget;
    document.querySelectorAll('.toc-highlight').forEach((el) => {
      el.classList.remove(LINK_ACTIVE_CLASS);
    });
    link.classList.add(LINK_ACTIVE_CLASS);
  }

  return (
    <ul className={isChild ? undefined : className}>
      {toc.map((heading) => (
        <li key={heading.id}>
          <Link
            to={`#${heading.id}`}
            className={linkClassName ?? undefined}
            onClick={handleClick}
            // Developer provided the HTML, so assume it's safe.
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <TOCItemTree
            isChild
            toc={heading.children}
            className={className}
            linkClassName={linkClassName}
          />
        </li>
      ))}
    </ul>
  );
}

export default React.memo(TOCItemTree);
