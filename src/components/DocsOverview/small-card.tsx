// Copyright 2024 DatabendLabs.
import { FC, ReactElement, ReactNode } from "react";
import styles from "./styles.module.scss";
import ButtonWithIcon from "../BaseComponents/ButtonWithIcon";

import Link from "@docusaurus/Link";
interface IProps {
  icon: ReactNode;
  text: string;
  to: string;
}
const SmallCard: FC<IProps> = ({ icon, text, to }): ReactElement => {
  return (
    <div>
      <Link title={text} to={to} className={styles.smallCard}>
        <ButtonWithIcon>{icon}</ButtonWithIcon>
        <span>{text}</span>
      </Link>
    </div>
  );
};
export default SmallCard;
