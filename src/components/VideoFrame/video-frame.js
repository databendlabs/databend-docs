// Copyright 2023 DatabendLabs.
import React from 'react';
import styles from './styles.module.scss';
import StartSvg from '@site/static/img/cover/start.svg';
import clsx from 'clsx';

function VideoFrame({url, background, img, title}) {
  const bg = background || 'linear-gradient(180deg, #015BCF 0%, #70AEFF 0.01%, #00194D 100%)'
  return (
    <div>
      <a
        style={{ background: bg }}
        target='_blank'
        href={url ? url : undefined}
        className={clsx(styles.videoWrap, !url && styles.videoWrapWait)}>
        <img src={require(`/img/cover/${img}`).default} />
        <div className={styles.star}>
          {
            url
            ? <StartSvg />
            : <span className={styles.wait}>敬请期待</span>
          }
        </div>
      </a>
      {
        title && <div className={clsx(styles.title, !url && styles.titleWait)}>{title}</div>
      }
    </div>
  );
};
export default VideoFrame;