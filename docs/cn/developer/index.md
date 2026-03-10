---
title: 开发者资源
sidebar_position: -2
---

# 开发者资源

使用我们的官方驱动、API 和开发工具，基于 Databend 构建应用程序。

## 驱动

使用适用于主流编程语言的原生驱动连接 Databend。所有驱动均支持 Databend 自托管部署和 Databend Cloud 部署。

| 语言        | 包                                                                          | 主要特性                             | 文档                                |
| ----------- | --------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| **Go**      | [databend-go](https://github.com/databendlabs/databend-go)                  | 标准 database/sql 接口，连接池       | [查看指南](00-drivers/00-golang.md) |
| **Python**  | [databend-driver](https://pypi.org/project/databend-driver/)                | 同步/异步支持，提供 SQLAlchemy 方言  | [查看指南](00-drivers/01-python.md) |
| **Node.js** | [databend-driver](https://www.npmjs.com/package/databend-driver)            | TypeScript 支持，基于 Promise 的 API | [查看指南](00-drivers/02-nodejs.md) |
| **Java**    | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)             | JDBC 4.0 兼容，预处理语句            | [查看指南](00-drivers/03-jdbc.md)   |
| **Rust**    | [databend-driver](https://github.com/databendlabs/BendSQL/tree/main/driver) | Async/await 支持，类型安全查询       | [查看指南](00-drivers/04-rust.md)   |

## API

Databend 提供 REST API，用于直接集成和自定义应用程序。

| API                         | 描述                                   | 使用场景                 |
| --------------------------- | -------------------------------------- | ------------------------ |
| [HTTP API](10-apis/http.md) | 用于 SQL 执行和数据操作的 RESTful 接口 | 自定义集成，直接执行 SQL |

## 开发工具

- **[BendSQL CLI](/tutorials/getting-started/connect-to-databend-bendsql)** - Databend 的命令行界面
- **[Databend Cloud Console](/guides/cloud/resources/worksheet)** - 基于 Web 的管理界面

## 其他资源

- **[社区](https://github.com/databendlabs/databend)** - 获取帮助并分享知识
