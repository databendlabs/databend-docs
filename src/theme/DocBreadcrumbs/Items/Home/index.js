import React, { useState } from 'react';
import { useMount } from 'ahooks';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import docusaurusConfig from '@generated/docusaurus.config';

export default function HomeBreadcrumbItem() {
  const [menuName, setMenuName] = useState('');
  const pathname = ExecutionEnvironment.canUseDOM ? window?.location?.pathname : '';
  const menu = `/${pathname?.split('/')[1]}`
  const homeHref = useBaseUrl(menu);
  useMount(()=> {
    const menuItems = docusaurusConfig?.themeConfig?.navbar?.items;
    setMenuName(menuItems?.find(item=> item.to === menu)?.label);
  });
  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={homeHref}>
        <span className={styles.breadcrumbHomeIcon}>{menuName}</span>
      </Link>
    </li>
  );
}
