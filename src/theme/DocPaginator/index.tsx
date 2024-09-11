import React, { useState } from "react";
import { translate } from "@docusaurus/Translate";
// import PaginatorNavLink from '@theme/PaginatorNavLink';
import $t from "@site/src/utils/tools";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import JoinCommunity from "@site/src/components/JoinCommunity";
import styles from "./styles.module.scss";
import Link from "@docusaurus/Link";
import { LoadingOutlined } from "@ant-design/icons";
import { Popover, Button, Spin, Input } from "antd";
import ArrowLeft from "@site/static/icons/arrowleft.svg";
import ArrowRight from "@site/static/icons/arrowright.svg";
import { evaluateDocs } from "@site/src/api";
import ThumbsUp from "./ThumbsUp.svg";
import ThumbsDown from "./ThumbsDown.svg";
import clsx from "clsx";
const { TextArea } = Input;
export default function DocPaginator(props) {
  const { previous, next } = props;
  const [commentValue, setCommentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  function popover() {
    return (
      <div style={{ width: "390px", textAlign: "center" }}>
        <div style={{ marginBottom: "8px", textAlign: "left" }}>
          {$t("Leave an optional comment…")}
        </div>
        <TextArea
          value={commentValue}
          onChange={(e) => setCommentValue(e?.target?.value)}
          rows={5}
        ></TextArea>
        <Button
          loading={loading}
          onClick={() => submitInfo("No")}
          style={{ marginTop: "16px", fontWeight: 700 }}
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
        const res = await evaluateDocs({
          domain: window?.location?.origin,
          path: window?.location?.pathname,
          action: type,
          comment: commentValue,
        });
        console.log(res, "res");
        setIsVoted(true);
        setCommentValue("");
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
            <>
              <span>{$t("Did this page help you?")}</span>
              <div onClick={() => submitInfo("Yes")} className={styles.button}>
                <ThumbsUp></ThumbsUp> Yes
              </div>
              <Popover
                showArrow={false}
                trigger={["click"]}
                content={popover()}
              >
                <div className={styles.button}>
                  <ThumbsDown></ThumbsDown> No
                </div>
              </Popover>
            </>
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
