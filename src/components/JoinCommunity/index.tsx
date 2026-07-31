// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement } from "react";
import Link from "@docusaurus/Link";
import useGetReleases from "@site/src/hooks/useGetReleases";
import clsx from "clsx";
import styles from "./styles.module.scss";
import $t from "@site/src/utils/tools";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import GitHub from "@site/static/icons/gitHub.svg";
import Zhihu from "@site/static/icons/zhihu.svg";
import OSChina from "@site/static/icons/os-china.svg";
import X from "@site/static/icons/x.svg";
import Slack from "@site/static/icons/slack.svg";
import YouTube from "@site/static/icons/youtube.svg";
import Bili from "@site/static/icons/bili.svg";
import OfficialAccounts from "@site/static/img/wechat-offical.jpeg";
import SalesImg from "@site/static/img/sales.jpeg";
import { Tooltip } from "antd";
import Contact from "@site/static/icons/contact.svg";
import { LightDatabendCloudSingleSvg } from "databend-logos";
interface TProps {
  titleAlign?:
    | "start"
    | "end"
    | "left"
    | "right"
    | "center"
    | "justify"
    | "match-parent";
  maxWidth?: number;
  justifyContent?: "center" | "flex-start" | "flex-end";
}

const JoinCommunity: FC<TProps> = ({
  titleAlign = "center",
  maxWidth = 720,
  justifyContent = "center",
}): ReactElement => {
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  const { formatStargazersCount } = useGetReleases();
  const community = isChina
    ? [
        {
          icon: <GitHub />,
          star: formatStargazersCount,
          title: "GitHub",
          link: "https://github.com/databendlabs/databend",
        },
        {
          icon: <Zhihu />,
          title: "知乎",
          link: "https://www.zhihu.com/org/datafuse",
        },
        {
          icon: <Bili />,
          title: "bilibili",
          link: "https://space.bilibili.com/275673537",
        },
        {
          icon: <OSChina />,
          title: "开源中国",
          link: "https://my.oschina.net/u/5489811",
        },
      ]
    : [
        {
          icon: <GitHub />,
          star: formatStargazersCount,
          title: "GitHub",
          link: "https://github.com/databendlabs/databend",
        },
        {
          icon: <Slack />,
          title: "Slack",
          link: "https://link.databend.com/join-slack",
        },
        {
          icon: <X />,
          title: "X(Twitter)",
          link: "https://x.com/DatabendLabs",
        },
        {
          icon: <YouTube />,
          title: "YouTube",
          link: "https://www.youtube.com/@DatabendLabs",
        },
      ];
  const QRCode = [
    {
      title: "Databend 公众号",
      icon: (
        <img
          style={{ borderRadius: "6px", height: "100%", width: "100%" }}
          src={OfficialAccounts}
        ></img>
      ),
    },
    {
      title: "销售微信",
      icon: (
        <img
          style={{ borderRadius: "6px", height: "100%", width: "100%" }}
          src={SalesImg}
        ></img>
      ),
    },
  ];
  return (
    <div className={clsx("community", styles.Community)}>
      <h6 style={{ textAlign: titleAlign }}>
        {$t("Join our growing community")}
      </h6>
      <div
        className={clsx("community-group", styles.CommunityGroup)}
        style={{ maxWidth: maxWidth + "px", justifyContent }}
      >
        {community.map((item, index) => {
          return (
            <Link title={item.title} to={item.link} key={index}>
              <div className={clsx("community-item", styles.communityItem)}>
                <div className={clsx("icon", styles.Icon)}>{item.icon}</div>
                <h6>{item.title}</h6>
                {item.star ? (
                  <span className={clsx("tag", styles.tag)}>
                    🌟 {item.star} Stars
                  </span>
                ) : (
                  ""
                )}
              </div>
            </Link>
          );
        })}
        {isChina ? (
          <div>
            <h6 style={{ marginBottom: "8px", textAlign: titleAlign }}>微信</h6>
            <div className={clsx("community-group", styles.CommunityGroup)}>
              {QRCode?.map((code, index) => {
                return (
                  <Tooltip key={index} title={code.title}>
                    <div
                      style={{
                        width: "157px",
                        border: "1px solid var(--color-border)",
                        cursor: "zoom-in",
                        borderRadius: "6px",
                      }}
                    >
                      {code.icon}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            <h6
              style={{
                textAlign: titleAlign,
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              销售电话
            </h6>
            <a
              href="tel:18516888139"
              title="全国统一销售热线"
              className={clsx("sales-phone", styles.SalesPhone)}
            >
              <span className={styles.PhoneIcon}>
                <span className={styles.Ripple}></span>
                <span className={styles.Ripple}></span>
                <span className={styles.RingIcon}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
              </span>
              <span className={styles.PhoneInfo}>
                <span className={styles.PhoneLabel}>全国统一销售热线</span>
                <span className={styles.PhoneNumber}>185 1688 8139</span>
                <span className={styles.PhoneMeta}>
                  7×24 小时 <i>|</i> 企业级 SLA
                </span>
              </span>
            </a>
          </div>
        ) : (
          <div>
            <h6 style={{ textAlign: titleAlign, marginBottom: "24px" }}>
              Or simply contact us directly
            </h6>
            <div className={clsx("community-group", styles.CommunityGroup)}>
              <Link
                title="Contact Us"
                to="https://www.databend.com/contact-us/"
                target="_blank"
              >
                <div className={clsx("community-item", styles.communityItem)}>
                  <div className={clsx("icon", styles.Icon)}>
                    <Contact></Contact>
                  </div>
                  <h6>Contact Us</h6>
                </div>
              </Link>
              <Link
                title="Explore Databend Cloud"
                to="https://app.databend.com/register/"
                target="_blank"
              >
                <div className={clsx("community-item", styles.communityItem)}>
                  <LightDatabendCloudSingleSvg width={50} />
                  <h6>Explore Databend Cloud</h6>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default JoinCommunity;
