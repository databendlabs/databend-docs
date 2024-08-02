// Copyright 2024 DatabendLabs.
import { FC, ReactElement, ReactNode } from "react";
import styles from "./styles.module.scss";
import Title from "./title";
import clsx from "clsx";
interface IProps {
  children: ReactNode | ReactNode[];
  isNeedLogo?: boolean;
  title?: string;
  description?: string;
  link?: {
    to: string;
    text: string;
  };
  className?: string;
}
const ContentCardWrap: FC<IProps> = ({
  children,
  isNeedLogo = false,
  title = "",
  description,
  link,
  className,
}): ReactElement => {
  return (
    <div className={clsx(styles.cardWrap, className)}>
      <Title
        isNeedLogo={isNeedLogo}
        title={title}
        description={description}
        link={link}
      ></Title>
      <div className={styles.content} style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};
export default ContentCardWrap;
