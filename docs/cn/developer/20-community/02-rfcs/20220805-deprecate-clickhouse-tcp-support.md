title: 弃用 ClickHouse TCP 支持

Databend 现在支持 ClickHouse 的 tcp 协议，但实现有限。许多用户反馈 `clickhouse-client` 与 databend 配合不佳。通常，我们会告诉他们改用 MySQL。

`clickhouse-client` 是一个非常出色且功能强大的工具，可以与 `ClickHouse-server` 配合使用。但是，如果使用 tcp 协议将其与 databend 集成，则存在一些限制。

1. ClickHouse 的 tcp 协议偏向于 ClickHouse 的底层。内部的历史负担相对较重，并且由于它不是我们的重点，因此在解决问题上会浪费大量精力。

2. 类型系统和 databend 类型系统之间没有一一对应的关系，并且在 databend 和 ClickHouse 之间转换块的成本很高。例如，DateTime 类型 ClickHouse 有两组，并且 json/variant 类型和 ClickHouse 二进制格式也不一致。

3. `clickhouse-client` 将在客户端执行 SQL 解析、语法/函数验证、数据反序列化和序列化。但是 databend 和 ClickHouse 之间存在许多差异。我们很难使它们完全兼容。

4. ClickHouse 的 tcp 协议将来会继续升级。我们没有精力与新版本兼容。例如，在 https://github.com/databendlabs/databend/issues/6951 中，旧版本可以工作，但新版本存在一些更难检查的兼容性问题。

5. 我们已经支持 ClickHouse http 协议、MySQL 协议和 databend 自己的 HTTP 处理程序。现在是时候缩小无意义的端点，以使其他有用的端点更好。

因此，我们计划弃用 ClickHouse 的 tcp 支持，并专注于与 ClickHouse http 协议的兼容性。
