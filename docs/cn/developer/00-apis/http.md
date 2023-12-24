---
title: HTTP 处理器
sidebar_label: REST API
---

Databend 的 HTTP 处理器是一个 REST API，用于向服务器发送查询语句执行并将结果返回给客户端。

HTTP 处理器由 databend-query 托管，可以通过使用 `--http_handler_host` 和 `--http_handler_port`（默认为 8000）来指定。


## HTTP 方法

### 概览

此处理器以 `pages` 形式返回结果，并使用长轮询。

1. 使用 `POST` 方法向 `/v1/query` 发送包含 SQL 语句的 `QueryRequest` 类型的 JSON，返回 `QueryResponse` 类型的 JSON。
2. 使用 `QueryResponse` 的字段进行进一步处理：
    1. 对 `next_uri` 发起 `GET` 请求，返回查询结果的下一个 `page`。它也返回 `QueryResponse`，直到 `next_uri` 为 null 时停止处理。
    2. （可选）对 `kill_uri` 发起 `GET` 请求以终止查询。返回空的响应体。
    3. （可选）对 `stats_uri` 发起 `GET` 请求，一次性获取统计信息（无需长轮询），返回数据字段为空的 `QueryResponse`。

### 快速示例

```shell
curl -u root: \
  --request POST \
  '127.0.0.1:8001/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

SQL 将使用默认会话和分页设置运行，主要包括：

1. 使用 `default` 数据库的新一次性会话。
2. 每个请求最多等待 1 秒钟以返回结果。

有关更高级的配置，请参见下面的参考资料：

你应该得到类似这样的 JSON（已格式化）：

```json
{
  "id":"b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id":"5643627c-a900-43ac-978f-8c76026d9944",
  "session":{
    
  },
  "schema":[
    {
      "name":"avg(number)",
      "type":"Nullable(Float64)"
    }
  ],
  "data":[
    [
      "49999999.5"
    ]
  ],
  "state":"Succeeded",
  "error":null,
  "stats":{
    "scan_progress":{
      "rows":100000000,
      "bytes":800000000
    },
    "write_progress":{
      "rows":0,
      "bytes":0
    },
    "result_progress":{
      "rows":1,
      "bytes":9
    },
    "total_scan":{
      "rows":100000000,
      "bytes":800000000
    },
    "running_time_ms":446.748083
  },
  "affect":null,
  "stats_uri":"/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "final_uri":"/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "next_uri":"/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "kill_uri":"/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill"
}
```


## 查询请求

QueryRequest

| 字段          | 类型         | 必填     | 默认值  | 描述                                        |
|---------------|--------------|----------|---------|---------------------------------------------|
| sql           | string       | 是       |         | 要执行的 SQL 语句                           |
| session_id    | string       | 否       |         | 仅在重用服务器端会话时使用                  |
| session       | SessionState | 否       |         |                                             |
| pagination    | Pagination   | 否       |         | 此 POST 请求的唯一查询 ID                   |

SessionState

| 字段                      | 类型                | 必填     | 默认值    | 描述                                                      |
|--------------------------|---------------------|----------|-----------|-----------------------------------------------------------|
| database                 | string              | 否       | "default" | 设置当前数据库                                            |
| keep_server_session_secs | int                 | 否       | 0         | 上次查询完成后会话保留的秒数                              |
| settings                 | map(string, string) | 否       | 0         |                                                           |

OldSession

| 字段 | 类型   | 必填     | 默认值  | 描述                              |
|-------|--------|----------|---------|-----------------------------------|
| id    | string | 是       |         | 来自 QueryResponse.session_id 的会话 ID |

Pagination: 在所有剩余结果准备好返回之前，每个 HTTP 请求返回的关键条件

| 字段          | 类型 | 必填     | 默认值  | 描述            |
|----------------|------|----------|---------|-----------------|
| wait_time_secs | u32  | 否       | 1       | 长轮询时间      |

## 查询响应

QueryResponse:



| 字段        | 类型          | 描述                                        |
|------------|---------------|--------------------------------------------|
| state      | string        | 可选值: "Running","Failed", "Succeeded"     |
| error      | QueryError    | SQL 解析或执行的错误                        |
| id         | string        | 此 POST 请求的唯一 query_id                 |
| data       | array         | 每个项是结果的一行                          |
| schema     | array         | 有序的 Field 序列                           |
| affect     | Affect        | 某些查询的影响                              |
| session_id | String        |                                              |
| session    | SessionState  |                                              |

字段:

| 字段      | 类型   |
|----------|--------|
| name     | string |
| type     | string |

统计信息:

| 字段              | 类型          | 描述                                                                                                     |
|-----------------|---------------|---------------------------------------------------------------------------------------------------------|
| running_time_ms | float         | 从查询开始执行到内部结束的毫秒数，当查询完成时停止计时（state != Running）                               |
| scan_progress   | QueryProgress | 查询扫描进度                                                                                             |

进度:

| 字段              | 类型 |
|--------------------|------|
| read_rows          | int  |
| read_bytes         | int  |

错误:

| 字段       | 类型   | 描述                          |
|-----------|--------|-------------------------------|
| stats     | int    | databend 内部使用的错误代码    |
| message   | string | 错误信息                      |
| backtrace | string |                               |

影响:

| 字段 | 类型   | 描述                  |
|-------|--------|-----------------------|
| type  | string | ChangeSetting/UseDB   |
| ...   |        | 根据类型而定          |

### 响应状态码

不同类型错误使用的状态码:

| 状态码 | 错误                                                                        |
|------|----------------------------------------------------------------------------|
| 200  | 如果 SQL 无效或失败，详情在 JSON 的 `error` 字段中                          |
| 404  | "query_id" 或 "page" 未找到                                                 |
| 400  | 请求格式无效                                                                |

当状态码不是 200 时，检查响应体中的错误原因字符串。

### 数据格式

`.data` 中的所有字段值都以字符串表示，
客户端需要借助 `schema` 字段中的信息来解释这些值。

### 客户端会话

由于 HTTP 的无状态特性，服务器端难以维护会话。
客户端需要在发起新请求时配置 `session` 字段。

```json
{
  "sql": "select 1", 
  "session": {
    "database": "db2",
    "settings": {
      "max_threads": "1"
    }
  } 
}
```

所有设置的值应该是字符串。

如果 SQL 是 `set` 或 `use`，`session` 将会改变，并在响应中返回给客户端，
客户端需要记录它并在后续请求中使用。

### QueryAffect（实验性）

对于每个 SQL，客户端可以得到一个可选的表格形式的 `result`。
客户端还可以获得关于读/写的行/字节的 `progress` 信息。
由于它们的限制，客户端可能无法获得关于查询的所有感兴趣的信息。
因此，我们添加了 `QueryAffect` 来携带一些关于查询的额外信息。

请注意 `QueryAffect` 面向高级用户且不稳定。
不建议使用 `QueryAffect` 来维护会话。

### Session 和 QueryAffect 的示例：


set 语句:

```json
{
  "sql": "set max_threads=1;",
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "6"
    }
  }
}
```

响应:

```json
{
  "affect": {
    "type": "ChangeSetting",
    "key": "max_threads",
    "value": "1",
    "is_global": false
  },
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "1"
    }
  }
}
```

use 语句:

```json
{"sql": "use db2",
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "6"
    }
  }
}
```

响应:

```json
{
  "affect": {
    "type": "UseDB",
    "name": "db2"
  },
  "session": {
    "database": "db2",
    "settings": {
      "max_threads": "1"
    }
  }
}
```

## 客户端实现

官方客户端 [bendsql](https://github.com/datafuselabs/bendsql) 主要基于 HTTP 处理程序。

Databend 的 http 处理器客户端实现中最简单的例子可以在 [sqllogictest](https://github.com/datafuselabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs) 中找到。