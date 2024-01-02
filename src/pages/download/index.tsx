// Copyright 2023 Datafuse Labs.
import React, { FC, ReactElement } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { timeFormatAgo } from '@site/src/utils/tools';
import styles from './styles.module.scss';
import useGetReleases from '@site/src/hooks/useGetReleases';
import Card from '@site/src/components/BaseComponents/Card';
import Tag from '@site/src/components/BaseComponents/Tag';
import { Apple, Linux } from '@site/src/components/Icons';
import Ubuntu from '@site/src/components/Icons/Ubuntu';
import Microsoft from '@site/src/components/Icons/Microsoft';
import { IAssets } from '@site/src/types/download';

const Releases: FC = (): ReactElement => {
  const { 
    releasesList, 
    name: releaseName,
    bendsqlRecource
  } = useGetReleases();
  const { filterBody, assets: latestAssets, published_at } = releasesList[0];
  const { name: bendsqlTagName } = bendsqlRecource;
  function Icons({isApple, size = 24, isUbuntu, isWindows}: {isApple: boolean|undefined, size?: number, isUbuntu: boolean|undefined, isWindows?: boolean | undefined}): ReactElement {
    return (
      <>
        {
          isWindows
          ? <Microsoft size={size}/>
          : <>
            {
              isApple
              ? <Apple size={size}/>
              : <>
              {
                isUbuntu
                ? <Ubuntu size={size}></Ubuntu>
                : <Linux size={size}/>
              }
              </>
            }
            </>
        }
      </>
    )
  }
  const buriedPointForDownload = (asset: IAssets)=> {
    const { name, osType, osTypeDesc, id, browser_download_url, created_at, size, isApple, isUbuntu, tag_name   } = asset;
    // @ts-ignore
    if (window?.gtag) {
      // @ts-ignore
      window.gtag('event', 'click', {
        'event_category': 'DownloadPackages',
        'event_label': tag_name + "_" + osTypeDesc,
        'package_download_info': JSON.stringify({ name, osType, osTypeDesc, id, browser_download_url, created_at, size, isApple, isUbuntu, tag_name})
      });
    }
  }
  return (
    <Layout
      title={`Databend - Activate your Object Storage for real-time analytics`}
      description={`A modern Elasticity and Performance Cloud Data Warehouse, activate your Object Storage(S3, Azure Blob, or MinIO) for real-time analytics`}>
      <div className={styles.part}>
        <div className={styles.download}>Download Databend</div>
        <div className={styles.latest}>Latest Version: {releaseName}</div>
        <Card className={styles.latestBlock}>
          <div className={styles.latestVersion}>
            <div className={styles.topTag}>
              <span className={styles.version}>{releaseName}</span>
              <Tag>Latest</Tag>
            </div>
            <div className={styles.updateTime}>
            Released {timeFormatAgo(published_at)}.
              For earlier versions, please refer to <a target='_blank' href='https://github.com/datafuselabs/databend/releases'>GitHub</a>.
            </div>
            <div className={styles.nowAssets}>
              {
                latestAssets?.map((asset, index)=> {
                  const { isApple, browser_download_url, osTypeDesc, formatSize, isUbuntu } = asset;
                  return (
                    <Card 
                      onClick={()=> buriedPointForDownload(asset)}
                      href={browser_download_url}
                      isDownload 
                      key={index} 
                      className={clsx(styles.nowItem, !isApple && styles.nowItemLinux, isUbuntu && styles.nowItemLinuxUbuntu)} 
                      padding={[8, 16]}>
                      <Icons isApple={isApple} isUbuntu={isUbuntu}></Icons>
                      <div className={styles.right}>
                        <div>{osTypeDesc}</div>
                        <div>Size: {formatSize}</div>
                      </div>
                    </Card>
                  )
                })
              }
            </div>
          </div>
          <div className={clsx(styles.submitRecord)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{filterBody}</ReactMarkdown>
          </div>
        </Card>
      </div>
      <div className={clsx(styles.part, styles.part2)}>
        <div className={styles.download}>Download BendSQL</div>
        <div className={styles.latest}>Latest Version: {bendsqlTagName}</div>
        <Card className={styles.latestBlock}>
          <div className={styles.latestVersion}>
            <div className={styles.topTag}>
              <span className={styles.version}>
                {bendsqlTagName}
              </span>
              <Tag>Latest</Tag>
            </div>
            <div className={styles.updateTime}>
            Released {timeFormatAgo(bendsqlRecource?.published_at)}.
              For earlier versions, please refer to <a target='_blank' href='https://github.com/datafuselabs/bendsql/releases'>GitHub</a>.
            </div>
            <div className={styles.nowAssets}>
              {
                bendsqlRecource?.assets?.map((asset: any, index: number)=> {
                  const { isApple, browser_download_url, osTypeDesc, formatSize, isUbuntu, isWindows } = asset;
                  return (
                    <Card 
                      onClick={()=> buriedPointForDownload(asset)}
                      href={browser_download_url}
                      isDownload 
                      key={index} 
                      className={clsx(styles.nowItem, 
                        !isApple && styles.nowItemLinux, 
                        isUbuntu && styles.nowItemLinuxUbuntu,
                        isWindows && styles.nowItemWindows
                      )} 
                      padding={[8, 16]}>
                      <Icons isApple={isApple} isUbuntu={isUbuntu} isWindows={isWindows}></Icons>
                      <div className={styles.right}>
                        <div>{osTypeDesc}</div>
                        <div>Size: {formatSize}</div>
                      </div>
                    </Card>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.submitRecord}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{bendsqlRecource?.filterBody}</ReactMarkdown>
          </div>
        </Card>
      </div>
    </Layout >
  );
};
export default Releases;
