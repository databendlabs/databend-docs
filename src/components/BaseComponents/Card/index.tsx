// Copyright 2023 Datafuse Labs.
import React from "react";
import { type FC, type ReactElement } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { type ICommonProps } from "@site/src/types";
import Link from "@docusaurus/Link";
interface IProps extends ICommonProps {
  href?: string;
  isDownload?: boolean;
  padding?: number[];
  onClick?: () => void;
  title?: string;
}
const Card: FC<IProps> = ({
  children,
  padding = [28, 24],
  className,
  href,
  isDownload = false,
  style,
  onClick,
  title,
}): ReactElement => {
  const p = padding || [28, 24];
  const props = {
    style: { padding: `${p[0]}px ${p[1]}px`, ...style },
    className: clsx(styles.wrap, className),
  };
  return (
    <>
      {href ? (
        <Link
          title={title}
          onClick={onClick}
          download={isDownload}
          to={href}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <div onClick={onClick} {...props}>
          {children}
        </div>
      )}
    </>
  );
};
export default Card;
