import React from 'react';
import DocPage from '@theme-original/DocPage';
import styles from './styles.module.scss';
import ProgressBar from "react-scroll-progress-bar";

export default function DocPageWrapper(props) {
  return (
    <>
      <div className={styles.ProgressBar}><ProgressBar height="2px" bgcolor="var(--ifm-color-primary)" duration="0.2"/></div>
      <div className={styles.fakeBg}></div>
      <div className={styles.cell}></div>
      <DocPage {...props} />
    </>
  );
}