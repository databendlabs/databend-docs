---
title: 连接 Databend
---

Databend 支持多种连接方式，适用于不同的使用场景。以下所有方式均支持 **Databend Cloud** 和**自建 Databend**。

## 快速选择

| 我想要... | 推荐方式 | 链接 |
|----------|---------|------|
| 交互式执行 SQL 查询 | **BendSQL** (命令行) 或 **DBeaver** (图形界面) | [SQL 客户端](/guides/connect/sql-clients) |
| 开发应用程序 | 各语言 **驱动** | [驱动](/guides/connect/drivers) |
| 创建仪表盘和报表 | **BI/可视化工具** | [可视化](/guides/connect/visualization) |

## 连接字符串

| 部署方式 | 格式 |
|---------|------|
| **Databend Cloud** | `databend://<用户>:<密码>@<租户>.gw.<区域>.default.databend.com:443/<数据库>?warehouse=<仓库名>` |
| **自建部署** | `databend://<用户>:<密码>@<主机>:<端口>/<数据库>` |

:::tip 获取连接字符串
- **Databend Cloud**：登录 → 点击 **Connect** → 复制生成的 DSN
- **自建部署**：使用您配置的服务器地址和用户凭证
:::

## SQL 客户端

| 工具 | 类型 | 适用场景 |
|-----|------|---------|
| [BendSQL](/guides/connect/sql-clients/bendsql) | 命令行 | 开发者、脚本、自动化 |
| [DBeaver](/guides/connect/sql-clients/jdbc) | 图形界面 | 数据分析、可视化查询 |

## 驱动

| 语言 | 指南 |
|-----|------|
| Go | [Golang 驱动](/guides/connect/drivers/golang) |
| Python | [Python 连接器](/guides/connect/drivers/python) |
| Node.js | [Node.js 驱动](/guides/connect/drivers/nodejs) |
| Java | [JDBC 驱动](/guides/connect/drivers/java) |
| Rust | [Rust 驱动](/guides/connect/drivers/rust) |

## 可视化工具

| 工具 | 类型 |
|-----|------|
| [Grafana](/guides/connect/visualization/grafana) | 监控与仪表盘 |
| [Tableau](/guides/connect/visualization/tableau) | 商业智能 |
| [Superset](/guides/connect/visualization/superset) | 数据探索 |
| [Metabase](/guides/connect/visualization/metabase) | 自助式 BI |
| [Jupyter](/guides/connect/visualization/jupyter) | 数据科学笔记本 |
| [Deepnote](/guides/connect/visualization/deepnote) | 协作笔记本 |
| [MindsDB](/guides/connect/visualization/mindsdb) | 机器学习平台 |
| [Redash](/guides/connect/visualization/redash) | SQL 仪表盘 |

