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
const { TextArea } = Input;
export default function DocPaginator(props) {
  const { previous, next } = props;
  const [loading, setLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [form] = Form.useForm();
  const {
    siteConfig: {
      customFields: { isChina },
    },
  } = useDocusaurusContext() as any;
  function popover() {
    return (
      <div style={{ width: "390px", textAlign: "center" }}>
        <Form form={form} layout="vertical">
          <Form.Item
            style={{ marginBottom: "20px" }}
            name="commentValue"
            label={$t("Leave an optional comment…")}
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
                label={$t("领取人信息")}
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
              "帮助我们改进文档！如果您在阅读过程中发现任何错误，请在此处告知我们。留下您的联系方式，我们将与您确认问题并及时修复，感谢您的支持！"
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
            ? `我的建议是：${values?.commentValue}。领取人信息：${
                values?.name || "未设置"
              }, ${values?.contact || "未设置"}`
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
        </div>
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
