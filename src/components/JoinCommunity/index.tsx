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
import GongzhonghaoImg from "@site/static/img/databend-gongzhonghao.jpeg";
import SalesImg from "@site/static/img/sales.jpeg";
import { Tooltip } from "antd";
import Contact from "@site/static/icons/contact.svg";
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
          src={GongzhonghaoImg}
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
              className={clsx("community-group", styles.CommunityGroup)}
            >
              185 1688 8139
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
                  <div className={clsx("icon", styles.Icon)}>🚀</div>
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
