// Copyright 2024 DatabendLabs.
import { FC, ReactElement, ReactNode } from "react";
import styles from "./styles.module.scss";
import ContentCardWrap from "./content-card-wrap";
import Card from "../BaseComponents/Card";
import SmallCard from "./small-card";
import Cli from "@site/static/icons/cli.svg";
import Java from "@site/static/icons/java.svg";
import Go from "@site/static/icons/go.svg";
import Python from "@site/static/icons/python.svg";
import Node from "@site/static/icons/node.svg";
import Rust from "@site/static/icons/rust.svg";
import Kafka from "@site/static/icons/kafka.svg";
import Dbt from "@site/static/icons/dbt.svg";
import Airbyte from "@site/static/icons/airbyte.svg";
import Addax from "@site/static/icons/addax.png";
import Datax from "@site/static/icons/datax.png";
import Debezium from "@site/static/icons/debezium.png";
import FlinkCdc from "@site/static/icons/flink.svg";
import Tapdata from "@site/static/icons/tapdata.png";
import Vector from "@site/static/icons/vertor.png";
import DeepNote from "@site/static/icons/deepnote.svg";
import Jpyter from "@site/static/icons/jpyter.svg";
import Metabase from "@site/static/icons/metabase.svg";
import Grafana from "@site/static/icons/grafana.svg";
import Redash from "@site/static/icons/redash.svg";
import Superset from "@site/static/icons/superset.svg";
import Teableau from "@site/static/icons/tableau.svg";
import MindsDB from "@site/static/icons/mindsdb.svg";
import Stream from "@site/static/icons/stream.svg";
import Task from "@site/static/icons/task.svg";
import Contact from "@site/static/icons/contact.svg";
import Security from "@site/static/icons/security.svg";
import AI from "@site/static/icons/AI.svg";
import Cases from "@site/static/icons/cases.svg";
import ChangeLog from "@site/static/icons/changelog.svg";
import FAQ from "@site/static/icons/faq.svg";
import MCP from "@site/static/icons/mcp.svg";
import MySQL from "@site/static/icons/mysql.svg";
import S3 from "@site/static/icons/s3.svg";
import { Col, Row } from "antd";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import $t from "@site/src/utils/tools";
import {
  LightDatabendSingleSvg,
  LightDatabendCloudSingleSvg,
} from "databend-logos";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import { useHistory } from "@docusaurus/router";

type CardItem = { icon: ReactNode; text: string; to: string };

const colLayout = { xl: 8, xxl: 8, lg: 8, md: 8, sm: 12, xs: 12 };
const colLayout2 = { xl: 12, xxl: 12, lg: 24, md: 24, sm: 24, xs: 24 };

const DocsOverview: FC = (): ReactElement => {
  const {
    siteConfig: {
      customFields: { homeLink, isChina },
    },
  } = useDocusaurusContext() as any;
  const history = useHistory();
  const cloudAppUrl = isChina
    ? "https://app.databend.cn"
    : "https://app.databend.com";
  const cloudCreditsValue = isChina ? "200元" : "$200";

  const imgIcon = (src: string, alt?: string) => (
    <img
      style={{ pointerEvents: "none", border: "unset" }}
      src={src}
      alt={alt || ""}
    />
  );

  const featureItems = [
    {
      title: "Unified Engine",
      desc: "Analytics, vector, search, and geo share one optimizer and runtime.",
    },
    {
      title: "Unified Data",
      desc: "Structured, semi-structured, unstructured, and vector data share object storage.",
    },
    {
      title: "Analytics Native",
      desc: "ANSI SQL, windowing, incremental aggregates, and streaming power BI.",
    },
    {
      title: "Vector Native",
      desc: "Embeddings, vector indexes, and semantic retrieval all run in SQL.",
    },
    {
      title: "Search Native",
      desc: "Full-text search and inverted indexes fuel hybrid retrieval.",
    },
    {
      title: "Geo Native",
      desc: "Geospatial indexes and functions power map and location services.",
    },
  ];

  const connectItems: CardItem[] = [
    {
      icon: <Cli />,
      text: "BendSQL",
      to: "/guides/connect/sql-clients/bendsql/",
    },
    { icon: <Java />, text: "Java", to: "/developer/drivers/jdbc/" },
    { icon: <Go />, text: "Golang", to: "/developer/drivers/golang/" },
    { icon: <Python />, text: "Python", to: "/developer/drivers/python/" },
    { icon: <Node />, text: "Node.js", to: "/developer/drivers/nodejs/" },
    { icon: <Rust />, text: "Rust", to: "/developer/drivers/rust/" },
    {
      icon: <MCP width={24} />,
      text: "MCP Server",
      to: "/guides/ai-functions/mcp/",
    },
    {
      icon: <MCP width={24} />,
      text: "MCP Client",
      to: "/guides/ai-functions/mcp-integration",
    },
  ];

  const loadDataItems: CardItem[] = [
    { icon: <Kafka />, text: "Kafka", to: "/guides/load-data/load-db/kafka/" },
    { icon: <Dbt />, text: "dbt", to: "/guides/load-data/load-db/dbt/" },
    {
      icon: <Airbyte />,
      text: "Airbyte",
      to: "/guides/load-data/load-db/airbyte/",
    },
    {
      icon: <FlinkCdc />,
      text: "Flink CDC",
      to: "/guides/load-data/load-db/flink-cdc/",
    },
    {
      icon: imgIcon(Addax, "Addax"),
      text: "Addax",
      to: "/guides/load-data/load-db/addax/",
    },
    {
      icon: imgIcon(Datax),
      text: "DataX",
      to: "/guides/load-data/load-db/datax/",
    },
    {
      icon: imgIcon(Debezium),
      text: "Debezium",
      to: "/guides/load-data/load-db/debezium/",
    },
    {
      icon: imgIcon(Tapdata),
      text: "Tapdata",
      to: "/guides/load-data/load-db/tapdata/",
    },
    {
      icon: imgIcon(Vector),
      text: "Vector",
      to: "/guides/load-data/load-db/vector/",
    },
    {
      icon: <MySQL width={24} />,
      text: "MySQL",
      to: "/guides/cloud/data-integration/mysql",
    },
    {
      icon: <S3 width={24} />,
      text: "Amazon S3",
      to: "/guides/cloud/data-integration/s3",
    },
  ];

  const biItems: CardItem[] = [
    {
      icon: <DeepNote />,
      text: "Deepnote",
      to: "/guides/connect/visualization/deepnote/",
    },
    {
      icon: <Jpyter />,
      text: "Jupyter",
      to: "/guides/connect/visualization/jupyter/",
    },
    {
      icon: <Metabase />,
      text: "Metabase",
      to: "/guides/connect/visualization/metabase/",
    },
    {
      icon: <Grafana />,
      text: "Grafana",
      to: "/guides/connect/visualization/grafana/",
    },
    {
      icon: <Redash />,
      text: "Redash",
      to: "/guides/connect/visualization/redash/",
    },
    {
      icon: <Superset />,
      text: "Superset",
      to: "/guides/connect/visualization/superset/",
    },
    {
      icon: <Teableau />,
      text: "Tableau",
      to: "/guides/connect/visualization/tableau/",
    },
    {
      icon: <MindsDB />,
      text: "MindsDB",
      to: "/guides/connect/visualization/mindsdb/",
    },
  ];

  const pipelineItems: CardItem[] = [
    {
      icon: <Stream />,
      text: $t("Real-Time CDC Ingestion"),
      to: "/guides/load-data/continuous-data-pipelines/stream/",
    },
    {
      icon: <Task />,
      text: $t("Automated Data Pipelines"),
      to: "/guides/load-data/continuous-data-pipelines/task/",
    },
  ];

  const additionalItems: CardItem[] = [
    { icon: <AI />, text: $t("AI Capabilities"), to: "/guides/ai-functions/" },
    { icon: <Security />, text: $t("Security"), to: "/guides/security/" },
    {
      icon: <Contact />,
      text: $t("Contact Support"),
      to: `${homeLink}/contact-us/`,
    },
    { icon: <Cases />, text: $t("Use Cases"), to: `${homeLink}/use-cases/` },
    { icon: <FAQ />, text: $t("FAQ"), to: "/" },
    { icon: <ChangeLog />, text: $t("Changelog"), to: "/release-notes/" },
  ];

  return (
    <div className={styles.outWrap}>
      <div
        className={styles.productFeatures}
        style={{ height: "100%", width: "100%" }}
      >
        <h3 className={styles.title}>{$t("Product Features")}</h3>
        <Row gutter={[12, 12]} className={styles.topCard}>
          {featureItems.map((item) => (
            <Col key={item.title} {...colLayout2}>
              <Card style={{ height: "100%" }} padding={[16, 16]}>
                <h3>
                  <span>{$t(item.title)}</span>
                </h3>
                <div>{$t(item.desc)}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <ContentCardWrap
        className={clsx(styles.commomCard, styles.gettingStart)}
        title={$t("Getting Started")}
        description={$t("Choose Cloud (managed) or Enterprise (self-hosted).")}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout2}>
              <Card
                padding={[24, 24]}
                className={clsx(styles.cardActiveOut, styles.productCard)}
              >
                <div
                  className={styles.productCardContainer}
                  role="link"
                  tabIndex={0}
                  aria-label={$t("Databend Cloud")}
                  onClick={() => history.push("/guides/cloud/")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      history.push("/guides/cloud/");
                    }
                  }}
                >
                  <div className={styles.productCardHeader}>
                    <LightDatabendCloudSingleSvg width={120} />
                    <div className={styles.productCardTitle}>
                      <h5>{$t("Databend Cloud")}</h5>
                      <span className={styles.productCardBadge}>
                        {$t("Recommended")}
                      </span>
                    </div>
                  </div>
                  <p className={styles.productCardDesc}>
                    {$t(
                      "Fully-managed serverless data warehouse. Zero infrastructure.",
                    )}
                  </p>
                  <div className={styles.productCardMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>&lt;500ms</span>
                      <span className={styles.metricLabel}>
                        {$t("Cold Start")}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>
                        {cloudCreditsValue}
                      </span>
                      <span className={styles.metricLabel}>
                        {$t("Free Credits")}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>SOC 2</span>
                      <span className={styles.metricLabel}>
                        {$t("Type II")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.productCardCtas}>
                    <Link
                      className={styles.productCardCtaPrimary}
                      to={cloudAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {$t("Start Free")} →
                    </Link>
                  </div>
                </div>
              </Card>
            </Col>
            <Col {...colLayout2}>
              <Card
                padding={[24, 24]}
                className={clsx(styles.cardActiveOut, styles.productCard)}
              >
                <div
                  className={styles.productCardContainer}
                  role="link"
                  tabIndex={0}
                  aria-label={$t("Databend Enterprise")}
                  onClick={() => history.push("/guides/self-hosted/")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      history.push("/guides/self-hosted/");
                    }
                  }}
                >
                  <div className={styles.productCardHeader}>
                    <LightDatabendSingleSvg width={120} />
                    <div className={styles.productCardTitle}>
                      <h5>{$t("Databend Enterprise")}</h5>
                      <span className={styles.productCardBadgeAlt}>
                        {$t("Enterprise")}
                      </span>
                    </div>
                  </div>
                  <p className={styles.productCardDesc}>
                    {$t(
                      "Self-hosted on the open-source core, with enterprise support.",
                    )}
                  </p>
                  <div className={styles.productCardMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>{$t("Deploy")}</span>
                      <span className={styles.metricLabel}>
                        {$t("Your Infra")}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>
                        {$t("Control")}
                      </span>
                      <span className={styles.metricLabel}>
                        {$t("Your Data")}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>
                        {$t("Support")}
                      </span>
                      <span className={styles.metricLabel}>
                        {$t("Enterprise Support")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.productCardCtas}>
                    <Link
                      className={styles.productCardCtaSecondary}
                      to="/guides/self-hosted/quickstart/"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {$t("Install Locally")} →
                    </Link>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </ContentCardWrap>
      <ContentCardWrap
        className={styles.commomCard}
        title={$t("Connect to Databend")}
        link={{
          to: "/developer",
          text: $t("Developer Resources"),
        }}
        description={$t(
          "Connect your application to Databend in just a few minutes.",
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            {connectItems.map((item) => (
              <Col key={item.text} {...colLayout}>
                <SmallCard icon={item.icon} text={item.text} to={item.to} />
              </Col>
            ))}
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap
        title={$t("Load Data into Databend")}
        link={{
          to: "/guides/load-data/",
          text: $t("Know More"),
        }}
        description={$t(
          "Bulk import data into Databend(Cloud) in multiple formats.",
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            {loadDataItems.map((item) => (
              <Col key={item.text} {...colLayout}>
                <SmallCard icon={item.icon} text={item.text} to={item.to} />
              </Col>
            ))}
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap
        title={$t("AI & BI & Visualization & Notebooks")}
        link={{
          to: "/guides/connect/visualization/",
          text: $t("All Tools"),
        }}
        description={$t(
          "Databend offers connectors and plugins for integrating with major data import tools, ensuring efficient data synchronization.",
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            {biItems.map((item) => (
              <Col key={item.text} {...colLayout}>
                <SmallCard icon={item.icon} text={item.text} to={item.to} />
              </Col>
            ))}
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap
        title={$t("Continuous Data Pipelines")}
        link={{
          to: "/guides/load-data/continuous-data-pipelines/",
          text: $t("Know More"),
        }}
        description={$t(
          "Data pipelines automate the process of moving and changing data from different sources into Databend.",
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            {pipelineItems.map((item) => (
              <Col key={item.text} {...colLayout}>
                <SmallCard icon={item.icon} text={item.text} to={item.to} />
              </Col>
            ))}
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap title={$t("Additional Informations")}>
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            {additionalItems.map((item) => (
              <Col key={item.text} {...colLayout}>
                <SmallCard icon={item.icon} text={item.text} to={item.to} />
              </Col>
            ))}
          </Row>
        </div>
      </ContentCardWrap>
      {/* <hr></hr> */}
    </div>
  );
};
export default DocsOverview;
