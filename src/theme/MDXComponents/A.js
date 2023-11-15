import React from 'react';
import Link from '@docusaurus/Link';
import LinkSvg from '@site/src/icons/link';
import styles from './styles.module.scss';
import Tooltip from 'rc-tooltip';
function hasProtocolPrefix(str) {
  return str.startsWith('http://') || str.startsWith('https://');
}
export default function MDXA(props) {
  if (hasProtocolPrefix(props?.href)) {
    return <Tooltip
      placement='top'
      destroyTooltipOnHide
      overlayClassName={styles.tooltip} 
      showArrow={false}
      trigger={['hover']} 
      overlay="Open in the new tab">
    <span className={styles.linkWrap}>
      <a {...props} target="_blank" rel="noopener noreferrer" />
      <LinkSvg/>
    </span>
  </Tooltip>
  } else {
    return <Link {...props} />;
  }
}