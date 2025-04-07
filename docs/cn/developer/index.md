```markdown
---
title: 开发者资源
sidebar_position: -2
---

## Drivers

学习使用 Go、Python、Node.js、Java 和 Rust 等编程语言来开发与 Databend 交互的应用程序。下表描述的驱动程序可用于从这些应用程序访问 Databend 或 Databend Cloud，从而实现从支持的语言与 Databend 的通信。

| 语言   | 驱动程序                                                                                                                              | Native? | 描述                                                                                                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Go       | [ databend-go ](https://github.com/databendlabs/databend-go)                                                                         | Yes     | 通过为 Go 编程语言设计的原生接口连接 Databend 或 Databend Cloud 并与之交互。[点击此处](00-drivers/00-golang.md) 了解有关驱动程序安装、教程和代码示例的更多信息。                                                                                                                             |
| Python   | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ](https://github.com/databendcloud/databend-py) | Yes     | 通过为 Python 编程语言开发的原生接口连接 Databend 或 Databend Cloud 并与之交互。[点击此处](00-drivers/01-python.md) 了解有关驱动程序安装、教程和代码示例的更多信息。                                                                                                                           |
| Node.js  | [databend-driver](https://www.npmjs.com/package/databend-driver)                                                                     | Yes     | 使用 Databend Driver Node.js Binding 连接 Databend 或 Databend Cloud 并与之交互。[点击此处](00-drivers/02-nodejs.md) 了解有关驱动程序安装、教程和代码示例的更多信息。                                                                                                                       |
| Java     | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                      | Yes     | 通过为 Java 编程语言设计的原生接口，从各种客户端工具和应用程序连接 Databend 或 Databend Cloud 并与之交互。[点击此处](00-drivers/03-jdbc.md) 了解有关驱动程序安装、教程和代码示例的更多信息。                                                                                                |
| Rust     | [databend-driver](https://github.com/databendlabs/BendSQL/tree/main/driver)                                                          | Yes     | 通过为 Rust 编程语言开发的原生接口连接 Databend 或 Databend Cloud 并与之交互。[点击此处](00-drivers/04-rust.md) 了解有关驱动程序安装、教程和代码示例的更多信息。                                                                                                                           |

## APIs

Databend 提供了各种强大的 API，允许您无缝地与系统交互、与外部数据库集成、启用实时数据提取以及简化文件上传。在支持的语言中进行开发时，请随时利用这些 API 来充分利用 Databend 的潜力。

| API                             | 描述                                         |
| ------------------------------- | -------------------------------------------- |
| [HTTP Handler](10-apis/http.md) | 允许通过 HTTP 请求与 Databend 进行交互。 |
```