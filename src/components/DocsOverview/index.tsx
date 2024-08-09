// Copyright 2024 DatabendLabs.
import { FC, ReactElement } from "react";
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
import Pipeline from "@site/static/icons/pipeline.svg";
import Stream from "@site/static/icons/stream.svg";
import Task from "@site/static/icons/task.svg";
import Contact from "@site/static/icons/contact.svg";
import Security from "@site/static/icons/security.svg";
import AI from "@site/static/icons/AI.svg";
import Cases from "@site/static/icons/cases.svg";
import ChangeLog from "@site/static/icons/changelog.svg";
import FAQ from "@site/static/icons/faq.svg";
import { Col, Row } from "antd";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import $t from "@site/src/utils/tools";
import {
  LightDatabendSingleSvg,
  LightDatabendCloudSingleSvg,
} from "databend-logos";
import Link from "@docusaurus/Link";
import clsx from "clsx";
const colLayout = { xl: 8, xxl: 8, lg: 8, md: 8, sm: 12, xs: 12 };
const colLayout2 = { xl: 12, xxl: 12, lg: 24, md: 24, sm: 24, xs: 24 };
const colLayout3 = { xl: 8, xxl: 8, lg: 8, md: 8, sm: 12, xs: 24 };

const DocsOverview: FC = (): ReactElement => {
  const {
    siteConfig: {
      customFields: { homeLink },
    },
  } = useDocusaurusContext();
  return (
    <div className={styles.outWrap}>
      <ContentCardWrap
        className={styles.top}
        title={$t("Introduction to Databend Products")}
        description={$t("Check out the products you can choose from.")}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <Row gutter={[12, 12]} className={styles.topCard}>
            <Col {...colLayout3}>
              <Card href="/guides/overview/editions/dc/" padding={[16, 16]}>
                <h3>
                  <span>{$t("Databend Cloud")}</span>
                </h3>
                <div>{$t("Fully-Managed on Cloud")}</div>
              </Card>
            </Col>
            <Col {...colLayout3}>
              <Card href="/guides/overview/editions/dee/" padding={[16, 16]}>
                <h3>
                  <span> {$t("Databend Enterprise")}</span>
                </h3>
                <div>
                  {$t("Self-Hosted with Additional Enterprise Features")}
                </div>
              </Card>
            </Col>
            <Col {...colLayout3}>
              <Card href="/guides/overview/editions/dce/" padding={[16, 16]}>
                <h3>
                  <span>{$t("Databend Cummunity")}</span>
                </h3>
                <div>{$t("Self-Hosted & Free")}</div>
              </Card>
            </Col>
          </Row>
        </div>
      </ContentCardWrap>
      <ContentCardWrap
        className={clsx(styles.commomCard, styles.gettingStart)}
        title={$t("Getting Started")}
        description={$t(
          "Create a Databend Cloud account or deploy your own Databend instance."
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout2}>
              <Card padding={[20, 0]} className={styles.cardActiveOut}>
                <Link
                  to={"/guides/cloud/new-account"}
                  className={"global-overview-card"}
                >
                  <LightDatabendCloudSingleSvg></LightDatabendCloudSingleSvg>
                  <div>
                    <h5>{$t("Activate Databend Cloud")}</h5>
                    <div>
                      <Link to={"/guides/cloud/new-account"}>
                        {$t("This topic")}
                      </Link>{" "}
                      {$t(
                        `outlines the steps for applying for beta access as an organization.`
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.moreUseful}>
                  <div>{$t("Topics you might find useful:")}</div>
                  <ul>
                    <li>
                      <Link to={"/guides/overview/editions/dc/platforms"}>
                        {$t("Supported Platforms & Regions")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/overview/editions/dc/editions"}>
                        {$t("Databend Cloud Editions")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/overview/editions/dc/pricing"}>
                        {$t("Pricing & Billing")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </Card>
            </Col>
            <Col {...colLayout2}>
              <Card padding={[20, 0]} className={styles.cardActiveOut}>
                <Link to={"/guides/deploy/"} className={"global-overview-card"}>
                  <LightDatabendSingleSvg></LightDatabendSingleSvg>
                  <div>
                    <h5>{$t("Self-Hosted Databend")}</h5>
                    <div>
                      <Link to={"/guides/deploy/"}>{$t("This topic")}</Link>{" "}
                      {$t(
                        "provide detailed instructions for deploying and upgrading Databend."
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.moreUseful}>
                  <div>{$t("Topics you might find useful:")}</div>
                  <ul>
                    <li>
                      <Link to={"/guides/overview/editions/dce/download"}>
                        {$t("Downloading Databend")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/overview/editions/dee/license"}>
                        {$t("Licensing Databend")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/deploy/upgrade/upgrade"}>
                        {$t("Upgrading Databend")}
                      </Link>
                    </li>
                  </ul>
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
          "Connect your application to Databend in just a few minutes."
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout}>
              <SmallCard
                icon={<Cli></Cli>}
                text={"BendSQL"}
                to={"/guides/sql-clients/bendsql"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Java></Java>}
                text={"Java"}
                to={"/developer/drivers/jdbc"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Go></Go>}
                text={"Golang"}
                to={"/developer/drivers/golang"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Python></Python>}
                text={"Python"}
                to={"/developer/drivers/python"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Node></Node>}
                text={"Node.js"}
                to={"/developer/drivers/nodejs"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Rust></Rust>}
                text={"Rust"}
                to={"/developer/drivers/rust"}
              />
            </Col>
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
          "Bulk import data into Databend(Cloud) in multiple formats."
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout}>
              <SmallCard
                icon={<Kafka></Kafka>}
                text={"Kafka"}
                to={"/guides/load-data/load-db/kafka"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Dbt></Dbt>}
                text={"dbt"}
                to={"/guides/load-data/load-db/dbt"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Airbyte></Airbyte>}
                text={"Airbyte"}
                to={"/guides/load-data/load-db/airbyte"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<FlinkCdc></FlinkCdc>}
                text={"Flink CDC"}
                to={"/guides/load-data/load-db/flink-cdc"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={
                  <img
                    style={{
                      pointerEvents: "none",
                      border: "unset",
                      padding: "4px",
                    }}
                    src={Addax}
                  />
                }
                text={"Addax"}
                to={"/guides/load-data/load-db/addax"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={
                  <img
                    style={{
                      pointerEvents: "none",
                      border: "unset",
                      padding: "4px",
                    }}
                    src={Datax}
                  />
                }
                text={"DataX"}
                to={"/guides/load-data/load-db/datax"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={
                  <img
                    style={{
                      pointerEvents: "none",
                      border: "unset",
                    }}
                    src={Debezium}
                  />
                }
                text={"Debezium"}
                to={"/guides/load-data/load-db/debezium"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={
                  <img
                    style={{
                      pointerEvents: "none",
                      border: "unset",
                    }}
                    src={Tapdata}
                  />
                }
                text={"Tapdata"}
                to={"/guides/load-data/load-db/tapdata"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={
                  <img
                    style={{
                      pointerEvents: "none",
                      border: "unset",
                    }}
                    src={Vector}
                  />
                }
                text={"Vector"}
                to={"/guides/load-data/load-db/vector"}
              />
            </Col>
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap
        title={$t("AI & BI & Visualization & Notebooks")}
        link={{
          to: "/guides/visualize/",
          text: $t("All Tools"),
        }}
        description={$t(
          "Databend offers connectors and plugins for integrating with major data import tools, ensuring efficient data synchronization."
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout}>
              <SmallCard
                icon={<DeepNote></DeepNote>}
                text={"Deepnote"}
                to={"/guides/visualize/deepnote"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Jpyter></Jpyter>}
                text={"Jupyter"}
                to={"/guides/visualize/jupyter"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Metabase></Metabase>}
                text={"Metabase"}
                to={"/guides/visualize/metabase"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Grafana></Grafana>}
                text={"Grafana"}
                to={"/guides/visualize/grafana"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Redash></Redash>}
                text={"Redash"}
                to={"/guides/visualize/redash"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Superset></Superset>}
                text={"Superset"}
                to={"/guides/visualize/superset"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Teableau></Teableau>}
                text={"Tableau"}
                to={"/guides/visualize/tableau"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<MindsDB></MindsDB>}
                text={"MindsDB"}
                to={"/guides/visualize/mindsdb"}
              />
            </Col>
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
          "Data pipelines automate the process of moving and changing data from different sources into Databend."
        )}
      >
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout}>
              <SmallCard
                icon={<Pipeline></Pipeline>}
                text={"Pipeline"}
                to={"/guides/load-data/continuous-data-pipelines/pipeline"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Stream></Stream>}
                text={$t("Real-Time CDC Ingestion")}
                to={"/guides/load-data/continuous-data-pipelines/stream"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Task></Task>}
                text={$t("Automated Data Pipelines")}
                to={"/guides/load-data/continuous-data-pipelines/task"}
              />
            </Col>
          </Row>
        </div>
      </ContentCardWrap>

      <ContentCardWrap title={$t("Additional Informations")}>
        <div style={{ width: "100%" }}>
          <Row gutter={[20, 20]}>
            <Col {...colLayout}>
              <SmallCard
                icon={<AI></AI>}
                text={$t("AI Capabilities")}
                to={"/guides/ai-functions/"}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Security></Security>}
                text={$t("Security")}
                to={`/guides/security/`}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Contact></Contact>}
                text={$t("Contact Support")}
                to={`${homeLink}/contact-us`}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<Cases></Cases>}
                text={$t("Use Cases")}
                to={`${homeLink}/use-cases`}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<FAQ></FAQ>}
                text={$t("FAQ")}
                to={`/guides/overview/faq`}
              />
            </Col>
            <Col {...colLayout}>
              <SmallCard
                icon={<ChangeLog></ChangeLog>}
                text={$t("Changelog")}
                to={`/release-notes`}
              />
            </Col>
          </Row>
        </div>
      </ContentCardWrap>
      <hr></hr>
    </div>
  );
};
export default DocsOverview;
