// Copyright 2023 Datafuse Labs.
import React from "react";
import { type FC, type ReactElement } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { type ICommonProps } from "@site/src/types";
interface IProps extends ICommonProps {
  href?: string;
  isDownload?: boolean;
  padding?: number[];
  onClick?: () => void;
}
const Card: FC<IProps> = ({
  children,
  padding,
  className,
  href,
  isDownload,
  style,
  onClick,
}): ReactElement => {
  const p = padding || [28, 24];
  const props = {
    style: { padding: `${p[0]}px ${p[1]}px`, ...style },
    className: clsx(styles.wrap, className),
  };
  return (
    <>
      {href ? (
        <a onClick={onClick} download={isDownload} href={href} {...props}>
          {children}
        </a>
      ) : (
        <div onClick={onClick} {...props}>
          {children}
        </div>
      )}
    </>
  );
};
Card.defaultProps = {
  padding: [28, 24],
  isDownload: false,
};
export default Card;
