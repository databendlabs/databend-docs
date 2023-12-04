import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import { useMount } from 'ahooks';
import NotFoundSvg from './NotFound.svg';
import clsx from 'clsx';
import styles from './not-found.module.scss';
import { Button, Spin, Space } from 'antd';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function NotFound() {
  const {siteConfig: {customFields: {homeLink}}} = useDocusaurusContext();
  const pathname = ExecutionEnvironment.canUseDOM ? window?.location?.href : '';
  const redirectsMap = {
    '/doc/sql-reference': '/sql/sql-reference',
    '/doc/sql-commands': '/sql/sql-commands',
    '/doc/sql-functions': '/sql/sql-functions'
  };
  useMount(()=> {
    for (const [oldPath, newPath] of Object.entries(redirectsMap)) {
      if (pathname?.includes(oldPath)) {
        window.open(pathname.replace(oldPath, newPath), '_self');
      }
    }
  })
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className={clsx("col col--6 col--offset-3", styles.notFoundWrap)}>
             <NotFoundSvg />
              <p className={styles.title}>
                <Translate
                  id="theme.NotFound.p1"
                  description="The first paragraph of the 404 page">
                  We could not find what you were looking for.
                </Translate>
                { 
                Object.keys(redirectsMap).find(key => pathname.includes(key)) &&
                  <span> Redirecting to a new link <Spin></Spin></span>
                }
              </p>
              <p style={{marginBottom: '1rem'}}>
                <Translate
                  id="theme.NotFound.p2"
                  description="The 2nd paragraph of the 404 page">
                  Please contact the owner of the site that linked you to the
                  original URL and let them know their link is broken.
                </Translate>
              </p>
             <Space size={16}>
              <Button type='primary' href='/doc'>Docs</Button>
              <Button href={homeLink+"/blog"} target='_blank'>Blog</Button>
             </Space>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
