// Copyright 2024 DatabendLabs.
import { FC, ReactElement, ReactNode } from "react";
import styles from "./styles.module.scss";
interface IProps {
  children: ReactNode | ReactNode[];
  width?: number;
}
const ButtonWithIcon: FC<IProps> = ({ children, width = 48 }): ReactElement => {
  return (
    <div
      className={styles.wrap}
      style={{ width: width + "px", height: width + "px" }}
    >
      {children}
    </div>
  );
};
export default ButtonWithIcon;
