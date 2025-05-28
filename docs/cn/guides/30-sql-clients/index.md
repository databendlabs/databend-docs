---
title: 连接到 Databend
---

Databend 支持多种连接方式以适应不同的使用场景。以下所有 SQL 客户端和驱动程序都可以与 Databend Cloud 和私有化部署的 Databend 配合使用 - <span class="text-blue">唯一的区别在于如何获取连接字符串</span>。

## 获取连接字符串

| 部署方式 | 如何获取连接字符串 | 连接格式 |
|------------|------------------------------|-------------------|
| **Databend Cloud** | 1. 登录 [Databend Cloud](https://app.databend.com)<br/>2. 在概览页面点击 **连接**<br/>3. 选择您的数据库和计算集群<br/>4. 复制生成的连接详情 | `databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>` |
| **私有化部署** | 使用您的部署信息：<br/>• 默认用户：`root` (或自定义 SQL 用户)<br/>• 主机：您的服务器地址 (例如 `localhost`) | `databend://<username>:<password>@<hostname>:<port>/<database>` |

## SQL 客户端和工具

| 客户端 | 类型 | 最适用于 | 主要特性 |
|--------|------|----------|--------------|
| **[BendSQL](/guides/sql-clients/bendsql)** | 命令行 | 开发者、脚本 | 原生 CLI、丰富格式化、多种安装选项 |
| **[DBeaver](/guides/sql-clients/jdbc)** | GUI 应用程序 | 数据分析、可视化查询 | 内置驱动、跨平台、查询构建器 |

## 开发者驱动程序

| 语言 | 驱动程序 | 使用场景 | 文档 |
|----------|--------|----------|---------------|
| **Go** | 原生驱动 | 后端应用程序 | [Golang 指南](/guides/sql-clients/developers/golang) |
| **Python** | Python 连接器 | 数据科学、分析 | [Python 指南](/guides/sql-clients/developers/python) |
| **Node.js** | JavaScript 驱动 | Web 应用程序 | [Node.js 指南](/guides/sql-clients/developers/nodejs) |
| **Java** | JDBC 驱动 | 企业应用程序 | [JDBC 指南](/guides/sql-clients/developers/jdbc) |
| **Rust** | 原生驱动 | 系统编程 | [Rust 指南](/guides/sql-clients/developers/rust) |

## 连接方式

| 方式 | 安全级别 | 使用场景 | 设置复杂度 |
|--------|----------------|----------|------------------|
| **直接连接** | 标准 | 开发、测试 | ⭐ 简单 |
| **[AWS PrivateLink](/guides/sql-clients/privatelink)** | 高 | 生产、企业 | ⭐⭐⭐ 高级 |