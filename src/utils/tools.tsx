import dayjs from 'dayjs';
import React from 'react';
import {translate} from '@docusaurus/Translate';
import Translate from '@docusaurus/Translate';
import generatedInfo from '@generated/i18n';
import relativeTime from 'dayjs/plugin/relativeTime';
import isYesterday from 'dayjs/plugin/isYesterday';
dayjs.extend(relativeTime);
dayjs.extend(isYesterday);

// Calculate the time between now and before
export function timeFormatAgo(time: Date | string) {
  if (!time) return '-';
  const t = dayjs(time);
  return t.isYesterday() ? 'yesterday' : t.fromNow();
}

export function isChinaArea() {
  return generatedInfo?.currentLocale === 'zh';
}

export function $t(text: string, isText=false) {
  if (isText) {
    return translate({
      message: text
    });
  }
  return (
    <Translate>{text}</Translate>
  );
}
export default $t;