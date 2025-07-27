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
      customFields: { homeLink, isChina },
    },
  } = useDocusaurusContext();
  return (
    <div className={styles.outWrap}>
      <ContentCardWrap
        className={styles.top}
        title={$t("Introduction to Databend Products")}
        description={$t("Choose the deployment option that best fits your needs and scale.")}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <Row gutter={[12, 12]} className={styles.topCard}>
            <Col {...colLayout3}>
              <Card href="/guides/products/dc/" padding={[16, 16]}>
                <h3>
                  <span>{$t("Databend Cloud")}</span>
                </h3>
                <div>{$t("Fully-managed cloud service. No setup required.")}</div>
              </Card>
            </Col>
            <Col {...colLayout3}>
              <Card href="/guides/products/dee/" padding={[16, 16]}>
                <h3>
                  <span> {$t("Databend Enterprise")}</span>
                </h3>
                <div>
                  {$t("Self-hosted with enterprise features and support.")}
                </div>
              </Card>
            </Col>
            <Col {...colLayout3}>
              <Card href="/guides/products/dce/" padding={[16, 16]}>
                <h3>
                  <span>{$t("Databend Community")}</span>
                </h3>
                <div>{$t("Open-source and free for all use cases.")}</div>
              </Card>
            </Col>
          </Row>
        </div>
      </ContentCardWrap>
      <div
        className={styles.productFeatures}
        style={{ height: "100%", width: "100%" }}
      >
        <h3 className={styles.title}>{$t("Product Features")}</h3>
        <Row gutter={[12, 12]} className={styles.topCard}>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("10x Faster Performance")}</span>
              </h3>
              <div>
                {$t(
                  "Rust-powered vectorized execution with SIMD optimization delivers exceptional performance."
                )}
              </div>
            </Card>
          </Col>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("90% Cost Reduction")}</span>
              </h3>
              <div>
                {$t(
                  "S3-native storage eliminates proprietary overhead and reduces costs significantly."
                )}
              </div>
            </Card>
          </Col>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("Snowflake Compatible")}</span>
              </h3>
              <div>
                {$t(
                  "Near 100% SQL compatibility enables zero-rewrite migration from Snowflake."
                )}
              </div>
            </Card>
          </Col>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("Universal Data Processing")}</span>
              </h3>
              <div>
                {$t(
                  "Process structured, semi-structured, and unstructured multimodal data in one platform."
                )}
              </div>
            </Card>
          </Col>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("Native AI Capabilities")}</span>
              </h3>
              <div>
                {$t(
                  "Built-in AI functions, vector search, and multimodal analytics for modern workloads."
                )}
              </div>
            </Card>
          </Col>
          <Col {...colLayout2}>
            <Card style={{ height: "100%" }} padding={[16, 16]}>
              <h3>
                <span>{$t("Multi-Cloud & No Lock-in")}</span>
              </h3>
              <div>
                {$t(
                  "Deploy on AWS, Azure, GCP, or on-premise with complete data sovereignty."
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
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
                  <LightDatabendCloudSingleSvg width={150} />
                  <div>
                    <h5>{$t("Start with Databend Cloud")}</h5>
                    <div>
                      {$t(
                        "Get started in minutes with our fully-managed cloud service. No setup required."
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.moreUseful}>
                  <div>{$t("What you need to know:")}</div>
                  <ul>
                    <li>
                      <Link to={"/guides/products/dc/editions"}>
                        {$t("Choose Your Edition")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/products/dc/pricing"}>
                        {$t("Pricing & Plans")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/cloud/using-databend-cloud"}>
                        {$t("Using Databend Cloud")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </Card>
            </Col>
            <Col {...colLayout2}>
              <Card padding={[20, 0]} className={styles.cardActiveOut}>
                <Link to={"/guides/deploy/"} className={"global-overview-card"}>
                  <LightDatabendSingleSvg width={150} />
                  <div>
                    <h5>{$t("Deploy Your Own Instance")}</h5>
                    <div>
                      {$t(
                        "Install Databend on your infrastructure for complete control and customization."
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.moreUseful}>
                  <div>{$t("What you need to know:")}</div>
                  <ul>
                    <li>
                      <Link to={"/guides/deploy/QuickStart"}>
                        {$t("5-Minute Quick Start")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/deploy/deploy/download"}>
                        {$t("Download & Install")}
                      </Link>
                    </li>
                    <li>
                      <Link to={"/guides/products/dee/license"}>
                        {$t("Enterprise Features & Licensing")}
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
            {/* <Col {...colLayout}>
              <SmallCard
                icon={<Pipeline></Pipeline>}
                text={"Pipeline"}
                to={"/guides/load-data/continuous-data-pipelines/pipeline"}
              />
            </Col> */}
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
                to={`/guides/products/overview/faq`}
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
      {/* <hr></hr> */}
    </div>
  );
};
export default DocsOverview;
