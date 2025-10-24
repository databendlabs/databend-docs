// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import LinkSvg from "../../../static/icons/link";
import copy from "copy-to-clipboard";
import Tooltip from "../BaseComponents/Tooltip";
// import { MDXProvider } from '@mdx-js/react';
interface IProps {
  number: number | string;
  children: ReactNode;
  title: string;
  outLink?: string;
  defaultCollapsed?: boolean;
}
const StepContent: FC<IProps> = ({
  number,
  children,
  title,
  outLink,
  defaultCollapsed = false,
}): ReactElement => {
  const wrapRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    if (!title) {
      const h3 = wrapRef?.current?.getElementsByClassName("anchor")[0];
      if (number == -1 || number === "") {
        h3?.setAttribute(
          "style",
          `position: absolute; top: ${
            number == -1 ? "-10px" : "22px"
          }; left: 20px; cursor: ${outLink ? "pointer" : ""};`
        );
        if (outLink) {
          h3?.addEventListener("click", () => {
            window.open(outLink, "_blank");
          });
        }
      } else {
        h3?.setAttribute(
          "style",
          `position: absolute; top: ${number == 1 ? "0" : "30px"}; left: 20px`
        );
      }
    }

    // Add collapse button after first h2 if defaultCollapsed is defined
    if (defaultCollapsed !== undefined && contentRef?.current) {
      const firstH2 = contentRef.current.querySelector('h2');
      if (firstH2 && !firstH2.nextElementSibling?.classList?.contains('collapse-button-wrapper')) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'collapse-button-wrapper';
        buttonWrapper.style.cssText = 'display: flex; justify-content: flex-start; margin: 8px 0 16px 0;';

        const button = document.createElement('button');
        button.style.cssText = 'padding: 4px 12px; cursor: pointer; background: transparent; border: 1px solid var(--ifm-color-emphasis-300); border-radius: 4px; font-size: 12px; color: var(--ifm-color-emphasis-700);';
        button.textContent = isCollapsed ? '▼ Show Details' : '▲ Hide Details';
        button.onclick = () => setIsCollapsed(prev => !prev);

        buttonWrapper.appendChild(button);
        firstH2.parentNode.insertBefore(buttonWrapper, firstH2.nextSibling);
      }
    }
  }, [defaultCollapsed]);
  useEffect(() => {
    // Update button text and hide/show content after button when collapsed
    if (contentRef?.current) {
      const buttonWrapper = contentRef.current.querySelector('.collapse-button-wrapper');
      if (buttonWrapper) {
        const button = buttonWrapper.querySelector('button');
        if (button) {
          button.textContent = isCollapsed ? '▼ Show Details' : '▲ Hide Details';
          // Re-bind the click event with function form to avoid closure issues
          button.onclick = () => setIsCollapsed(prev => !prev);
        }

        let node = buttonWrapper.nextSibling;
        while (node) {
          if (node.nodeType === 1) { // Element node
            (node as HTMLElement).style.display = isCollapsed ? 'none' : '';
          }
          node = node.nextSibling;
        }
      }
    }
  }, [isCollapsed]);

  return (
    <div
      className="global-step-container"
      style={{ position: "relative" }}
      id={title}
    >
      <span className="global-step-number">
        {number == "" || number == -1 ? (
          <span className="global-step-n global-step-point"></span>
        ) : (
          <span className="global-step-n">{number}</span>
        )}
        {outLink ? (
          <a
            className="anchor global-step-outlink"
            target="_blank"
            href={outLink}
          >
            <span className="databend-step-title">{title}</span>{" "}
            {title && <LinkSvg></LinkSvg>}
          </a>
        ) : (
          <h3 className="anchor">
            <span className="databend-step-title">{title}</span>
            <a href={`#${title}`}>
              {title && (
                <Tooltip content="Copy Link">
                  <LinkSvg
                    onClick={() =>
                      copy(
                        decodeURIComponent(
                          window.location?.origin +
                            window.location.pathname +
                            "#" +
                            title
                        )
                      )
                    }
                  ></LinkSvg>
                </Tooltip>
              )}
            </a>
          </h3>
        )}
      </span>
      <div className="step-content" ref={wrapRef}>
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default StepContent;
