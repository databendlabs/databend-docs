// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement } from "react";
import Link from "@docusaurus/Link";
import useGetReleases from "@site/src/hooks/useGetReleases";
import clsx from "clsx";
import styles from "./styles.module.scss";
import $t from "@site/src/utils/tools";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import GitHub from "../Icons/gitHub.svg";
import Zhihu from "../Icons/zhihu.svg";
import OSChina from "../Icons/os-china.svg";
import X from "../Icons/x.svg";
import Slack from "../Icons/slack.svg";
import YouTube from "../Icons/youtube.svg";
import Bili from "../Icons/bili.svg";
import GongzhonghaoImg from "@site/static/img/databend-gongzhonghao.jpeg";
import LittleDImg from "@site/static/img/little-d.jpeg";
import { Tooltip } from "antd";
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
          link: "https://github.com/datafuselabs/databend",
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
          link: "https://github.com/datafuselabs/databend",
        },
        {
          icon: <Slack />,
          title: "Slack",
          link: "https://link.databend.com/join-slack",
        },
        {
          icon: <X />,
          title: "Twitter",
          link: "https://twitter.com/DatabendLabs",
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
      title: "客服小 D",
      icon: (
        <img
          style={{ borderRadius: "6px", height: "100%", width: "100%" }}
          src={LittleDImg}
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
            <Link to={item.link} key={index}>
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
        {isChina && (
          <div>
            <div style={{ marginBottom: "8px", fontSize: "13px" }}>微信</div>
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
          </div>
        )}
      </div>
    </div>
  );
};
export default JoinCommunity;
