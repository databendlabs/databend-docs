// Copyright 2024 DatabendLabs.
import { FC, ReactElement } from "react";
// import styles from "./styles.module.less";
interface IProps {
  thead: string[];
  tbody: string[][];
  width?: string[];
}
const DatabendTable: FC<IProps> = ({
  thead = [],
  tbody = [],
  width = [],
}): ReactElement => {
  return (
    <table style={{ display: "table", width: "100%" }}>
      {width?.length > 0 && (
        <colgroup>
          {width?.map((w, index) => {
            return <col key={index} style={{ width: w }}></col>;
          })}
        </colgroup>
      )}
      <thead>
        <tr>
          {thead?.map((th, index) => {
            return <th key={index}>{th}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tbody?.map((tr, index) => {
          return (
            <tr key={index}>
              {tr?.map((td, i) => {
                return <td key={i}>{td}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default DatabendTable;
