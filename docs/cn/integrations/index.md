---
title: 集成
slug: /
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 集成

连接 Databend 与您常用的工具和平台。

<Tabs>
  <TabItem value="clients" label="🖥️ SQL 客户端" default>

| 工具 | 类型 | 链接 |
|------|------|------|
| **BendSQL** | 命令行 | [指南](/guides/connect/sql-clients/bendsql) |
| **DBeaver** | 图形界面 | [指南](/guides/connect/sql-clients/jdbc) |

  </TabItem>
  <TabItem value="drivers" label="🔌 驱动">

| 语言 | 包名 | 链接 |
|------|------|------|
| **Python** | `databend-driver` | [指南](/developer/drivers/python) |
| **Go** | `databend-go` | [指南](/developer/drivers/golang) |
| **Java** | `databend-jdbc` | [指南](/developer/drivers/jdbc) |
| **Node.js** | `databend-driver` | [指南](/developer/drivers/nodejs) |
| **Rust** | `databend-driver` | [指南](/developer/drivers/rust) |

  </TabItem>
  <TabItem value="bi" label="📊 BI & 可视化">

| 工具 | 类别 | 链接 |
|------|------|------|
| **Metabase** | BI | [指南](/guides/connect/visualization/metabase) |
| **Grafana** | 监控 | [指南](/guides/connect/visualization/grafana) |
| **Tableau** | BI | [指南](/guides/connect/visualization/tableau) |
| **Superset** | BI | [指南](/guides/connect/visualization/superset) |
| **Redash** | BI | [指南](/guides/connect/visualization/redash) |
| **Jupyter** | Notebook | [指南](/guides/connect/visualization/jupyter) |
| **Deepnote** | Notebook | [指南](/guides/connect/visualization/deepnote) |

  </TabItem>
  <TabItem value="ingestion" label="📥 数据导入">

| 工具 | 场景 | 链接 |
|------|------|------|
| **Kafka** | 流处理 | [指南](/guides/load-data/load-db/kafka) |
| **Airbyte** | ELT | [指南](/guides/load-data/load-db/airbyte) |
| **dbt** | 数据转换 | [指南](/guides/load-data/load-db/dbt) |
| **Flink CDC** | CDC | [指南](/guides/load-data/load-db/flink-cdc) |
| **Debezium** | CDC | [指南](/guides/load-data/load-db/debezium) |
| **Vector** | 日志 | [指南](/guides/load-data/load-db/vector) |

  </TabItem>
  <TabItem value="ai" label="🤖 AI">

| 工具 | 说明 | 链接 |
|------|------|------|
| **MindsDB** | ML 平台 | [指南](/guides/connect/visualization/mindsdb) |
| **MCP Server** | AI 助手 | [指南](/guides/ai-functions/mcp) |

  </TabItem>
</Tabs>

---

## 支持级别

| | 级别 | 说明 |
|---|------|------|
| 🟢 | **核心** | Databend 官方构建维护，提供官方支持 |
| 🟡 | **合作伙伴** | 第三方厂商构建，由合作伙伴提供支持 |
| 🔵 | **社区** | 社区成员构建，通过 GitHub 和 Slack 获取帮助 |

---

## 快速链接

| | |
|---|---|
| 📚 [开发者资源](/developer) | SDK、API 和驱动文档 |
| 🔗 [连接 Databend](/guides/connect) | 各类工具连接指南 |
| 📥 [数据导入](/guides/load-data) | 多种数据源导入方式 |
