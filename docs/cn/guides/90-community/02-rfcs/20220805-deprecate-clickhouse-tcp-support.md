---
title: 弃用 ClickHouse 的 TCP 支持
description: RFC 弃用 ClickHouse 的 TCP 支持
---

## 概述

Databend 目前支持 ClickHouse 的 TCP 协议，但这是一个有限的实现。许多用户向我们反馈 `clickhouse-client` 与 databend 配合使用效果不佳。通常，我们会建议他们改用 MySQL。

`clickhouse-client` 是一个非常优秀且强大的工具，用于与 `ClickHouse-server` 配合使用。然而，如果通过 TCP 协议将其与 databend 集成，存在一些局限性。

1. ClickHouse 的 TCP 协议偏向于 ClickHouse 的底层。内部的历史负担较重，由于这不是我们的重点，因此排查问题会浪费大量精力。

2. ClickHouse 的类型系统与 databend 的类型系统之间没有一一对应的关系，在 databend 和 ClickHouse 之间转换块的成本较高。例如，ClickHouse 的 DateTime 类型有两套，json/variant 类型与 ClickHouse 的二进制格式也不一致。

3. `clickhouse-client` 会在客户端进行 SQL 解析、语法/函数验证、数据反序列化和序列化。但 databend 与 ClickHouse 之间存在许多差异，我们很难使它们完全兼容。

4. ClickHouse 的 TCP 协议未来将继续升级。我们没有精力去兼容新版本。例如，在 https://github.com/databendlabs/databend/issues/6951 中，旧版本可以工作，但新版本存在一些更难检查的兼容性问题。

5. 我们已经支持了 ClickHouse 的 HTTP 协议、MySQL 协议和 databend 自己的 HTTP 处理程序。现在是时候缩减那些无意义的端点，以便让其他有用的端点更好。

因此，我们计划弃用 ClickHouse 的 TCP 支持，专注于与 ClickHouse HTTP 协议的兼容性。
