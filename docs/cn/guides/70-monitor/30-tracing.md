---
title: 跟踪 Databend
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.199"/>

Databend 利用 Rust 的跟踪生态系统，特别是 [tokio-tracing](https://github.com/tokio-rs/tracing)，来进行日志记录和性能分析。

## 启用跟踪

可以通过环境变量 `LOG_LEVEL` 或配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 来启用 Databend 的跟踪功能。

### 通过环境变量启用

1. 在您的系统上打开终端或命令提示符，然后导航到 `databend-query` 二进制文件所在的目录。

```bash
# 将 "/path/to/databend" 替换为您系统上的实际路径
cd /path/to/databend
```

2. 当您处于正确的目录时，运行以下命令来设置 databend-query 命令执行的日志级别。根据您的具体需求调整日志级别。在提供的示例中，使用 DEBUG 作为示例日志级别：

```bash
LOG_LEVEL=DEBUG ./databend-query
```

3. 在跟踪查询执行之前，将 Databend 中的 `max_threads` 设置为 1。这确保了一个简化的环境，使得跟踪和分析查询变得更容易，有助于有效的故障排除和性能分析。

```sql
SET max_threads=1;
```

### 通过配置文件启用

1. 在配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 的 [log] 部分添加以下参数。有关每个参数的详细描述，请参见 [[log.tracing] 部分](../10-deploy/13-node-config/02-query-config.md#logtracing-section)。

```toml title='databend-query.toml'
...
[log.tracing]
capture_log_level = "TRACE"
on = "true"
otlp_endpoint = "http://127.0.0.1:4317"
...
```

2. 在跟踪查询执行之前，将 Databend 中的 `max_threads` 设置为 1。这确保了一个简化的环境，使得跟踪和分析查询变得更容易，有助于有效的故障排除和性能分析。

```sql
SET max_threads=1;
```

## 跟踪日志

:::note
Databend 使用 [tokio-tracing](https://github.com/tokio-rs/tracing) 来跟踪日志，其中默认时区为 UTC，无法通过 Databend 时区设置进行更改，因此跟踪日志中的时间始终为 UTC 时间，并不反映您的本地时间。
:::

```sql
[2021-06-10T08:40:36Z DEBUG clickhouse_srv::cmd] Got packet Query(QueryRequest { query_id: "bac2b254-6245-4cae-910d-3e5e979c8b68", client_info: QueryClientInfo { query_kind: 1, initial_user: "", initial_query_id: "", initial_address: "0.0.0.0:0", interface: 1, os_user: "bohu", client_hostname: "thinkpad", client_name: "ClickHouse ", client_version_major: 21, client_version_minor: 4, client_version_patch: 6, client_revision: 54447, http_method: 0, http_user_agent: "", quota_key: "" }, stage: 2, compression: 1, query: "SELECT sum(number+1)+1 from numbers(10000) where number>0 group by number%3;" })
Jun 10 16:40:36.131 DEBUG ThreadId(16) databend_query::sql::plan_parser: query="SELECT sum(number+1)+1 from numbers(10000) where number>0 group by number%3;"
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Plus
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 30
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Value(Number("1", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Function(Function { name: ObjectName([Ident { value: "sum", quote_style: None }]), args: [Unnamed(BinaryOp { left: Identifier(Ident { value: "number", quote_style: None }), op: Plus, right: Value(Number("1", false)) })], over: None, distinct: false })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Plus
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 30
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Value(Number("1", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "from", quote_style: None, keyword: FROM })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "from", quote_style: None, keyword: FROM })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Value(Number("10000", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() RParen
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Gt
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 20
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Value(Number("0", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "group", quote_style: None, keyword: GROUP })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Word(Word { value: "group", quote_style: None, keyword: GROUP })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Identifier(Ident { value: "number", quote_style: None })
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() Mod
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 40
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] parsing expr
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] prefix: Value(Number("3", false))
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() SemiColon
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] get_next_precedence() SemiColon
[2021-06-10T08:40:36Z DEBUG sqlparser::parser] next precedence: 0
Jun 10 16:40:36.135  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: new
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: enter
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: new
Jun 10 16:40:36.136  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: enter
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: exit
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan:select_to_plan: databend_query::sql::plan_parser: close time.busy=2.65ms time.idle=457µs
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: exit
Jun 10 16:40:36.139  INFO ThreadId(16) sql_statement_to_plan: databend_query::sql::plan_parser: close time.busy=3.57ms time.idle=453µs
Jun 10 16:40:36.140  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: new
Jun 10 16:40:36.141  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: enter
Jun 10 16:40:36.141 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: Before ProjectionPushDown
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (Before Projection)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (Before GroupBy)
          Filter: (number > 0)
            ReadDataSource: scan partitions: [1], scan schema: [number:UInt64], statistics: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.142 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: After ProjectionPushDown
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (Before Projection)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (Before GroupBy)
          Filter: (number > 0)
            ReadDataSource: scan partitions: [1], scan schema: [number:UInt64], statistics: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.142 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: Before Scatters
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (Before Projection)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (Before GroupBy)
          Filter: (number > 0)
            ReadDataSource: scan partitions: [1], scan schema: [number:UInt64], statistics: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.143 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::optimizers::optimizer: After Scatters
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (Before Projection)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (Before GroupBy)
          Filter: (number > 0)
            ReadDataSource: scan partitions: [1], scan schema: [number:UInt64], statistics: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: new
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: enter
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: exit
Jun 10 16:40:36.143  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:reschedule: databend_query::interpreters::plan_scheduler: close time.busy=145µs time.idle=264µs
Jun 10 16:40:36.144  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: new
Jun 10 16:40:36.144  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: enter
Jun 10 16:40:36.144 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: Received plan:
Projection: (sum((number + 1)) + 1):UInt64
  Expression: (sum((number + 1)) + 1):UInt64 (Before Projection)
    AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
      AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[sum((number + 1))]]
        Expression: (number % 3):UInt8, (number + 1):UInt64 (Before GroupBy)
          Filter: (number > 0)
            ReadDataSource: scan partitions: [1], scan schema: [number:UInt64], statistics: [read_rows: 10000, read_bytes: 80000]
Jun 10 16:40:36.145 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: Pipeline:
ProjectionTransform × 1 processor
  ExpressionTransform × 1 processor
    GroupByFinalTransform × 1 processor
      GroupByPartialTransform × 1 processor
        ExpressionTransform × 1 processor
          FilterTransform × 1 processor
            SourceTransform × 1 processor
Jun 10 16:40:36.145  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: exit
Jun 10 16:40:36.145  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}:build: databend_query::pipelines::processors::pipeline_builder: close time.busy=1.07ms time.idle=215µs
Jun 10 16:40:36.145 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_projection: execute...
Jun 10 16:40:36.145 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_groupby_final: execute...
Jun 10 16:40:36.146 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_groupby_partial: execute...
Jun 10 16:40:36.146 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_source: execute, table:system.numbers, is_remote:false...
Jun 10 16:40:36.148 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_filter: execute...
Jun 10 16:40:36.148 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_expression_executor: (filter executor) execute, actions: [Input(ActionInput { name: "number", return_type: UInt64 }), Constant(ActionConstant { name: "0", value: 0 }), Function(ActionFunction { name: "(number > 0)", func_name: ">", return_type: Boolean, is_aggregated: false, arg_names: ["number", "0"], arg_types: [UInt64, UInt64], arg_fields: [] })]
Jun 10 16:40:36.150 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_filter: Filter cost: 1.678104ms
Jun 10 16:40:36.150 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_expression_executor: (expression executor) execute, actions: [Input(ActionInput { name: "number", return_type: UInt64 }), Constant(ActionConstant { name: "3", value: 3 }), Function(ActionFunction { name: "(number % 3)", func_name: "%", return_type: UInt64, is_aggregated: false, arg_names: ["number", "3"], arg_types: [UInt64, UInt64], arg_fields: [] }), Input(ActionInput { name: "number", return_type: UInt64 }), Constant(ActionConstant { name: "1", value: 1 }), Function(ActionFunction { name: "(number + 1)", func_name: "+", return_type: UInt64, is_aggregated: false, arg_names: ["number", "1"], arg_types: [UInt64, UInt64], arg_fields: [] })]
Jun 10 16:40:36.165 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_groupby_partial: Group by partial cost: 18.822193ms
Jun 10 16:40:36.166 DEBUG ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::pipelines::transforms::transform_groupby_final: Group by final cost: 20.170851ms
Jun 10 16:40:36.167  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: exit
Jun 10 16:40:36.167  INFO ThreadId(309) execute{ctx.id="1c651744-3e73-4b94-9df0-dc031b73c626"}: databend_query::interpreters::interpreter_select: close time.busy=26.1ms time.idle=592µs
Jun 10 16:40:36.167 DEBUG ThreadId(309) databend_query::pipelines::transforms::transform_expression_executor: (expression executor) execute, actions: [Input(ActionInput { name: "sum((number + 1))", return_type: UInt64 }), Constant(ActionConstant { name: "1", value: 1 }), Function(ActionFunction { name: "(sum((number + 1)) + 1)", func_name: "+", return_type: UInt64, is_aggregated: false, arg_names: ["sum((number + 1))", "1"], arg_types: [UInt64, UInt64], arg_fields: [] })]
Jun 10 16:40:36.168 DEBUG ThreadId(309) databend_query::pipelines::transforms::transform_expression_executor: (projection executor) execute, actions: [Input(ActionInput { name: "(sum((number + 1)) + 1)", return_type: UInt64 })]
Jun 10 16:40:36.168 DEBUG ThreadId(309) databend_query::pipelines::transforms::transform_projection: Projection cost: 241.864µs
```

## 探索和诊断 tokio-console {#explore-and-diagnose-with-tokio-console}

[tokio-console](https://github.com/tokio-rs/console) 是一个用于异步 Rust 程序的诊断和调试工具。在使用之前，请确保您已经安装了该工具。

### 步骤

1. 使用特定的 `RUSTFLAGS` 和功能编译。我们可以使用 `--bin` 来指定二进制文件。

   ```shell
   RUSTFLAGS="--cfg tokio_unstable" cargo build --features tokio-console
   ```

2. 运行 `databend-meta` 或/和 `databend-query`，记得将您需要诊断的程序的日志级别设置为 `TRACE`。

   ```shell
   LOG_LEVEL=TRACE databend-query # 对于查询
   ```

   或者

   ```shell
   databend-meta --single --log-level=TRACE # 对于元数据
   ```

3. 运行 `tokio-console`。

   ```shell
   tokio-console # 默认连接：http://127.0.0.1:6669
   ```

### 提示

请注意，tokio-console 一次只支持对单个程序进行诊断，因此请确保**只有一个**程序的日志级别为 `TRACE`。否则，只有第一个占用端口的程序会被监控。

如果您需要同时诊断多个程序，请考虑使用 `TOKIO_CONSOLE_BIND` 分配不同的绑定，例如：

```shell
TOKIO_CONSOLE_BIND=127.0.0.1:16667 LOG_LEVEL=TRACE target/debug/databend-query
tokio-console http://127.0.0.1:16667 # 对于查询控制台，http://127.0.0.1:16667
databend-meta --single --log-level=TRACE
tokio-console # 对于元数据控制台，http://127.0.0.1:6669
```

### 示例

**databend-query**

<img src="/img/tracing/query-console.png"/>

**databend-meta**

<img src="/img/tracing/meta-console.png"/>

**控制台中的任务**

<img src="/img/tracing/task-in-console.png"/>
