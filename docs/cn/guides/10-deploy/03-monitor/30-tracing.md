---
title: 追踪 Databend
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.199"/>

Databend 使用 Rust 的 tracing 生态系统，特别是 [tokio-tracing](https://github.com/tokio-rs/tracing)，用于日志记录和分析。


## 启用追踪

在 Databend 中，可以通过环境变量 `LOG_LEVEL` 或配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 启用追踪。

### 通过环境变量启用

1. 打开系统上的终端或命令提示符，然后导航到 `databend-query` 二进制文件所在的目录。

```bash
# 将 "/path/to/databend" 替换为系统上的实际路径
cd /path/to/databend
```

2. 进入正确目录后，运行以下命令为 databend-query 命令的执行设置日志级别。根据您的具体需求调整日志级别。在提供的示例中，DEBUG 用作说明性的日志级别：

```bash
LOG_LEVEL=DEBUG ./databend-query
```

3. 在追踪查询执行之前，在 Databend 中将 `max_threads` 设置为 1。这确保了一个简化的环境，使得追踪和分析查询更加容易，有助于有效的故障排除和分析。

```sql
SET max_threads=1;
```

### 通过配置文件启用

1. 将以下参数添加到配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 的 [log] 部分。有关每个参数的详细描述，请参见 [[log.tracing] 部分](../04-references/02-node-config/02-query-config.md#logtracing-section)。

```toml title='databend-query.toml'
...
[log.tracing]
capture_log_level = "TRACE"
on = "true"
otlp_endpoint = "http://127.0.0.1:4317"
...
```

2. 在追踪查询执行之前，在 Databend 中将 `max_threads` 设置为 1。这确保了一个简化的环境，使得追踪和分析查询更加容易，有助于有效的故障排除和分析。

```sql
SET max_threads=1;
```

## 追踪日志

:::note
Databend 使用 [tokio-tracing](https://github.com/tokio-rs/tracing) 来追踪日志，其中默认时区为 UTC，无法通过 Databend 时区设置进行更改，因此追踪日志中的时间将始终为 UTC，不会反映您的本地时间。
:::

```sql
[2021-06-10T08:40:36Z DEBUG clickhouse_srv::cmd] 收到数据包 Query(QueryRequest { query_id: "bac2b254-6245-4cae-910d-3e5e979c8b68", client_info: QueryClientInfo { query_kind: 1, initial_user: "", initial_query_id: "", initial_address: "0.0.0.0:0", interface: 1, os_user: "bohu", client_hostname: "thinkpad", client_name: "ClickHouse ", client_version_major: 21, client_version_minor: 4, client_version_patch: 6, client_revision: 54447, http_method: 0, http_user_agent: "", quota_key: "" }, stage: 2, compression: 1, query: "SELECT sum(number+1)+1 from numbers(10000) where number>0 group by number%3;" })
Jun 10 16:40:36.131 DEBUG ThreadId(16) databend_query::sql::plan_parser: query="SELECT sum(number+1)+1 from numbers(10000) where number>0 group by number%3;"
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Plus
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 30
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Value(Number("1", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Function(Function { name: ObjectName([Ident { value: "sum", quote_style: None }]), args: [Unnamed(BinaryOp { left: Identifier(Ident { value: "number", quote_style: None }), op: Plus, right: Value(Number("1", false)) })], over: None, distinct: false })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Plus
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 30
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Value(Number("1", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "from", quote_style: None, keyword: FROM })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "from", quote_style: None, keyword: FROM })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Value(Number("10000", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Gt
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 20
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Value(Number("0", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "group", quote_style: None, keyword: GROUP })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "group", quote_style: None, keyword: GROUP })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Mod
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 40
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 解析表达式
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 前缀: Value(Number("3", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() SemiColon
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() SemiColon
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] 下一个优先级: 0
Jun 10 16:40:36.135  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: 新建
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: 进入
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: 新建
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: 进入
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: 退出
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: 关闭 time.busy=2.65ms time.idle=457µs
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: 退出
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: 关闭 time.busy=3.57ms time.idle=453µs
Jun 10 16:40:36.140  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: 新建
Jun 10 16:40:36.141  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: 进入
Jun 10 16:40:36.141 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: 在 ProjectionPushDown 之前
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (在 Projection 之前)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (在 GroupBy 之前)
          Filter: (number > 0)
            ReadDataSource: 扫描分区: [1], 扫描模式: [number:UInt64], 统计: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.142 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: 在 ProjectionPushDown 之后
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (在 Projection 之前)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (在 GroupBy 之前)
          Filter: (number > 0)
            ReadDataSource: 扫描分区: [1], 扫描模式: [number:UInt64], 统计: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.142 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: 在 Scatters 之前
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (在 Projection 之前)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (在 GroupBy 之前)
          Filter: (number > 0)
            ReadDataSource: 扫描分区: [1], 扫描模式: [number:UInt64], 统计: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.143 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: 在 Scatters 之后
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (在 Projection 之前)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (在 GroupBy 之前)
          Filter: (number > 0)
            ReadDataSource: 扫描分区: [1], 扫描模式: [number:UInt64], 统计: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: 新建
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: 进入
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: 退出
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"

## 使用 tokio-console 进行探索和诊断

[tokio-console](https://github.com/tokio-rs/console) 是一个用于异步 Rust 程序的诊断和调试工具。在使用之前，请确保已安装该工具。

### 步骤

1. 使用特定的 `RUSTFLAGS` 和功能进行编译。我们可以使用 `--bin` 来指定二进制文件。

   ```shell
   RUSTFLAGS="--cfg tokio_unstable" cargo build --features tokio-console
   ```

2. 运行 `databend-meta` 或/和 `databend-query`，记得将要诊断的程序的日志级别设置为 `TRACE`。

   ```shell
   LOG_LEVEL=TRACE databend-query # 用于查询
   ```

   或者

   ```shell
   databend-meta --single --log-level=TRACE # 用于元数据
   ```

3. 运行 `tokio-console`。

   ```shell
   tokio-console # 默认连接：http://127.0.0.1:6669
   ```

### 提示

请注意，tokio-console 一次只能诊断一个程序，因此请确保**只有一个**程序的日志级别为 `TRACE`。否则，只有第一个占用端口的程序会被监控。

如果需要同时诊断多个程序，可以考虑使用 `TOKIO_CONSOLE_BIND` 来分配不同的绑定，例如：

```shell
TOKIO_CONSOLE_BIND=127.0.0.1:16667 LOG_LEVEL=TRACE target/debug/databend-query
tokio-console http://127.0.0.1:16667 # 用于查询控制台，http://127.0.0.1:16667
databend-meta --single --log-level=TRACE
tokio-console # 用于元数据控制台，http://127.0.0.1:6669
```

### 示例

**databend-query**

<img src="/img/tracing/query-console.png"/>

**databend-meta**

<img src="/img/tracing/meta-console.png"/>

**控制台中的任务**

<img src="/img/tracing/task-in-console.png"/>