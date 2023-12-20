import React from 'react';
import { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import { useMount } from 'ahooks';
import NotFoundSvg from './no-found.svg';
import clsx from 'clsx';
import $t from '@site/src/utils/tools';
import styles from './not-found.module.scss';
import { Button, Spin, Space } from 'antd';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function NotFound() {
  const { siteConfig: { customFields: { homeLink } } } = useDocusaurusContext();
  const pathname = ExecutionEnvironment.canUseDOM ? window?.location?.href : '';
  const redirectsMap = {
    '/doc/sql-reference': '/sql/sql-reference',
    '/doc/sql-commands': '/sql/sql-commands',
    '/doc/sql-functions': '/sql/sql-functions',
    "/doc/develop": '/developer/drivers',
    "/doc/deploy": '/guides/deploy',
    "/doc/cloud": '/guides/cloud',
    '/doc/sql-clients': '/guides/sql-clients',
    "/doc/load-data": '/guides/load-data',
    '/doc/visualize': '/guides/visualize',
    '/doc/monitor': '/guides/monitor',
    '/doc/overview': '/guides/overview',
    "/cloud/getting-started/new-account": '/guides/cloud/new-account'
  };
  useMount(() => {
    for (const [oldPath, newPath] of Object.entries(redirectsMap)) {
      if (pathname?.includes(oldPath)) {
        window.open(pathname.replace(oldPath, newPath), '_self');
      }
    }
  })
  return (
    <Layout 
    title={translate({
     id: 'theme.NotFound.title',
     message: 'Page Not Found',
     })}
    description='Page Not Found'>
     <div className={clsx('g-align-c global-container-width', styles.rowContainer)}>
       <NotFoundSvg></NotFoundSvg>
       <Space className={styles.text} direction='vertical' size={20}>
          <div className={styles.notFoundTitle}>
            {$t('PAGE NOT FOUND')}
          </div>
          <div className='fontSize20'>
            {$t('Please check your link or head Home to regroup.')}
            {
              Object.keys(redirectsMap).find(key => pathname.includes(key)) &&
              <span> {$t('Redirecting to a new link')} <Spin></Spin></span>
            }
          </div>
          <Space size={16}>
            <Button type='primary' href='/guides'>{$t('Guides')}</Button>
            <Button href={homeLink + "/blog"} target='_blank'>{$t('Blog')}</Button>
          </Space>
       </Space>
     </div>
   </Layout>
  );
}  