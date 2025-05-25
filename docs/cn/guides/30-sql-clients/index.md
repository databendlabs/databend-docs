---
title: 连接 Databend
---

Databend 支持多种连接方式，以满足不同使用场景的需求。请根据您的实际情况选择最适合的方式：

## SQL 客户端与工具

| 客户端 | 类型 | 适用场景 | 核心特性 |
|--------|------|----------|--------------|
| **[BendSQL](/guides/sql-clients/bendsql)** | 命令行 | 开发者、脚本 | 原生 CLI、丰富格式选项、多种安装方式 |
| **[DBeaver](/guides/sql-clients/jdbc)** | 图形界面应用 | 数据分析、可视化查询 | 内置驱动、跨平台支持、查询构建器 |

## 开发者驱动

| 语言 | 驱动 | 使用场景 | 文档 |
|----------|--------|----------|---------------|
| **Go** | 原生驱动 | 后端应用 | [Golang 指南](/guides/sql-clients/developers/golang) |
| **Python** | Python 连接器 | 数据科学、分析 | [Python 指南](/guides/sql-clients/developers/python) |
| **Node.js** | JavaScript 驱动 | Web 应用 | [Node.js 指南](/guides/sql-clients/developers/nodejs) |
| **Java** | JDBC 驱动 | 企业级应用 | [JDBC 指南](/guides/sql-clients/developers/jdbc) |
| **Rust** | 原生驱动 | 系统编程 | [Rust 指南](/guides/sql-clients/developers/rust) |

## 连接方式

| 方式 | 安全等级 | 适用场景 | 配置复杂度 |
|--------|----------------|----------|------------------|
| **直连** | 标准 | 开发、测试 | ⭐ 简单 |
| **[AWS PrivateLink](/guides/sql-clients/privatelink)** | 高 | 生产环境、企业级 | ⭐⭐⭐ 复杂 |