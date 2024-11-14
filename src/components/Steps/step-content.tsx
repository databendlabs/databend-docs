// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement, ReactNode, useEffect, useRef } from "react";
import LinkSvg from "../../../static/icons/link";
import copy from "copy-to-clipboard";
import Tooltip from "../BaseComponents/Tooltip";
// import { MDXProvider } from '@mdx-js/react';
interface IProps {
  number: number | string;
  children: ReactNode;
  title: string;
  outLink?: string;
}
const StepContent: FC<IProps> = ({
  number,
  children,
  title,
  outLink,
}): ReactElement => {
  const wrapRef = useRef<any>(null);
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
  }, []);
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
        {children}
      </div>
    </div>
  );
};
export default StepContent;
