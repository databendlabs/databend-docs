---
title: 弃用 ClickHouse 的 tcp 支持
description: 
  RFC 用于弃用 ClickHouse 的 tcp 支持
---

## 摘要

Databend 现在支持 ClickHouse 的 tcp 协议，但它是有限的实现。许多用户向我们反馈说 `clickhouse-client` 与 databend 的兼容性不好。通常，我们告诉他们改用 MySQL。

`clickhouse-client` 是一个非常优秀和强大的工具，用于与 `ClickHouse-server` 协作。然而，如果我们通过 tcp 协议将其与 databend 集成，它有一些限制。

1. ClickHouse 的 tcp 协议偏向于 ClickHouse 的底层。其中的历史负担相对较重，而且因为它不是我们的重点，所以排查问题浪费了很多精力。

2. 类型系统之间没有一一对应的关系，而且在 databend 和 ClickHouse 之间转换块是成本高昂的。例如，ClickHouse 的 DateTime 类型有两套，而 json/variant 类型和 ClickHouse 的二进制格式也不一致。

3. `clickhouse-client` 会在客户端进行 SQL 解析、语法/函数验证、数据反序列化和序列化。但是 databend 和 ClickHouse 之间有很多差异，让我们很难使它们完全兼容。

4. ClickHouse 的 tcp 协议将来会继续升级。我们没有精力与新版本兼容。例如，在 https://github.com/datafuselabs/databend/issues/6951 中，旧版本可以工作，但新版本有一些兼容性问题，这些问题更难检查。

5. 我们已经支持了 ClickHouse http 协议、MySQL 协议和 databend 自己的 HTTP 处理程序。是时候缩减无意义的端点，以便更好地支持其他有用的端点了。

因此，我们计划弃用 ClickHouse 的 tcp 支持，并专注于与 ClickHouse http 协议的兼容性。