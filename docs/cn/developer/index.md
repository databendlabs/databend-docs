---
title: 开发者资源
sidebar_position: -2
---

## APIs

Databend 提供了各种强大的 API，允许您与系统无缝交互，与外部数据库集成，实现实时数据摄取，并简化文件上传。在使用受支持的编程语言进行开发时，可以自由地利用这些 API 来发挥 Databend 的全部潜力。

| API                              | 描述                                     |
| -------------------------------- | ---------------------------------------- |
| [HTTP 处理程序](00-apis/http.md) | 允许通过 HTTP 请求与 Databend 进行交互。 |

## 驱动程序

学习使用 Go、Python、Node.js、Java 和 Rust 等编程语言开发与 Databend 交互的应用程序。下表中描述的驱动程序可用于访问 Databend 或 Databend Cloud，从而实现与 Databend 的通信。

| 语言    | 驱动程序                                                                                                                             | 原生支持? | 描述                                                                                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Go      | [ databend-go ](https://github.com/databendcloud/databend-go)                                                                        | 是        | 通过专为 Go 编程语言设计的原生接口连接到 Databend 或 Databend Cloud 并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/00-golang.md)。                             |
| Python  | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ](https://github.com/databendcloud/databend-py) | 是        | 通过专为 Python 编程语言开发的原生接口连接到 Databend 或 Databend Cloud 并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/01-python.md)。                         |
| Node.js | [databend-driver](https://www.npmjs.com/package/databend-driver)                                                                     | 是        | 使用 Databend Rust 驱动程序的 Node.js 绑定连接到 Databend 或 Databend Cloud 并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/02-nodejs.md)。                                |
| Java    | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                      | 是        | 通过专为 Java 编程语言设计的原生接口，从各种客户端工具和应用程序连接到 Databend 或 Databend Cloud 并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/03-jdbc.md)。 |
| Rust    | [databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)                                                          | 是        | 通过专为 Rust 编程语言开发的原生接口连接到 Databend 或 Databend Cloud 并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/04-rust.md)。                             |
