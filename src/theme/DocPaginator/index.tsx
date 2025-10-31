import React, { useState } from "react";
import { translate } from "@docusaurus/Translate";
import $t from "@site/src/utils/tools";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import JoinCommunity from "@site/src/components/JoinCommunity";
import styles from "./styles.module.scss";
import Link from "@docusaurus/Link";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover, Button, Spin, Input, Form, Alert } from "antd";
import ArrowLeft from "@site/static/icons/arrowleft.svg";
import ArrowRight from "@site/static/icons/arrowright.svg";
import { evaluateDocs } from "@site/src/api";
import ThumbsUp from "./ThumbsUp.svg";
import ThumbsDown from "./ThumbsDown.svg";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";
import ScrollBanner from "./scroll-banner";
const { TextArea } = Input;
function Alarm() {
  return (
    <svg
      style={{ width: "18px" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M506.3 417l-213.3-364C284.8 39 270.4 32 256 32C241.6 32 227.2 39 218.1 53l-213.2 364C-10.59 444.9 9.851 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM52.58 432L255.1 84.8L459.4 432H52.58zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44c0 17.36 14.11 31.44 31.48 31.44s31.4-14.08 31.4-31.44C287.4 351.2 273.4 337.1 256 337.1zM232 184v96C232 293.3 242.8 304 256 304s24-10.75 24-24v-96C280 170.8 269.3 160 256 160S232 170.8 232 184z"></path>
    </svg>
  );
}
export default function DocPaginator(props) {
  const { previous, next } = props;
  const [loading, setLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [form] = Form.useForm();
  const {
    siteConfig: {
      customFields: { isChina, site },
    },
  } = useDocusaurusContext() as any;
  const { pathname } = useLocation();
  function popover() {
    return (
      <div style={{ width: "390px", textAlign: "center" }}>
        <Form form={form} layout="vertical">
          <Form.Item
            style={{ marginBottom: "20px" }}
            name="commentValue"
            label={$t("Help Us Improve Our Documentation")}
          >
            <TextArea
              placeholder={$t(
                "Please describe the specific errors or issues that"
              )}
              rows={5}
            />
          </Form.Item>
          {isChina && (
            <>
              <Form.Item
                name={"name"}
                style={{ marginBottom: "16px", marginTop: "12px" }}
                label={$t("领取人信息（可选）")}
              >
                <Input size="large" placeholder="您的姓名" />
              </Form.Item>
              <Form.Item
                name={"contact"}
                style={{ marginBottom: "20px" }}
                label=""
              >
                <Input
                  size="large"
                  placeholder="您的联系方式：邮箱或电话号码"
                />
              </Form.Item>
            </>
          )}
        </Form>
        {isChina && (
          <Alert
            message={
              "帮助我们改进文档！如果您在阅读过程中发现任何错误，请在此处告知我们。可以留下您的联系方式，我们将与您确认问题并及时修复，感谢您的支持！"
            }
            style={{ textAlign: "left", marginBottom: "20px" }}
            type="info"
          ></Alert>
        )}
        <Button
          loading={loading}
          size="large"
          onClick={() => submitInfo("No")}
          style={{ fontWeight: 700, width: "100%" }}
          type="primary"
        >
          {$t("Vote")}
        </Button>
      </div>
    );
  }
  async function submitInfo(type) {
    if (ExecutionEnvironment.canUseDOM) {
      try {
        setLoading(true);
        const values = await form.validateFields();
        const res = await evaluateDocs({
          domain: window?.location?.origin,
          path: window?.location?.pathname,
          action: type,
          comment: isChina
            ? `${values?.commentValue}。领取人信息：姓名=>${
                values?.name || "名称未设置"
              }, 联系方式=>${values?.contact || "联系方式未设置"}`
            : values?.commentValue,
        });
        setIsVoted(true);
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <div className="databend-bottom-footer">
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
      >
        <div className={styles.evaluation}>
          {isVoted ? (
            <span>{$t("Thanks for voting!")}</span>
          ) : (
            <div className={styles.vote}>
              <span>{$t("Did this page help you?")}</span>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {!isChina && (
                  <div
                    onClick={() => submitInfo("Yes")}
                    className={styles.button}
                  >
                    <ThumbsUp></ThumbsUp> Yes
                  </div>
                )}
                <Popover
                  showArrow={false}
                  trigger={["click"]}
                  content={popover()}
                >
                  <div className={styles.button}>
                    {!isChina && <ThumbsDown></ThumbsDown>} {$t("NoDesc")}
                  </div>
                </Popover>
              </div>
            </div>
          )}
          <Button
            target="_blank"
            rel="noopener noreferrer"
            href={`https://github.com/databendlabs/databend-docs/issues/new?title=Issue on docs, site=${site}&body=Path: ${pathname}`}
            className={styles.RaiseButton}
          >
            <Alarm />
            {$t("Raise issue")}
          </Button>
        </div>
        {isChina && <ScrollBanner />}
      </Spin>

      <nav
        className="pagination-nav docusaurus-mt-lg"
        aria-label={translate({
          id: "theme.docs.paginator.navAriaLabel",
          message: "Docs pages navigation",
          description: "The ARIA label for the docs pagination",
        })}
      >
        {previous ? (
          <Link
            className={clsx(
              styles.page,
              "pagination-nav__link pagination-nav__link--prev"
            )}
            to={previous?.permalink}
          >
            <ArrowLeft />
            <span>{previous?.title}</span>
          </Link>
        ) : (
          <i></i>
        )}
        {next && (
          <Link
            className={clsx(
              styles.page,
              "pagination-nav__link pagination-nav__link--next"
            )}
            to={next?.permalink}
          >
            <span>{next?.title}</span>
            <ArrowRight />
          </Link>
        )}
      </nav>
      <div className={styles.community}>
        <JoinCommunity
          maxWidth={720}
          justifyContent="flex-start"
          titleAlign="left"
        />
      </div>
    </div>
  );
}
