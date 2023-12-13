---
title: HTTP处理程序
sidebar_label: REST API
---

Databend的HTTP处理程序是一个REST API，用于将查询语句发送到服务器上执行，并将结果返回给客户端。

HTTP处理程序由databend-query托管，可以使用`--http_handler_host`和`--http_handler_port`参数指定（默认为8000）。

## HTTP方法

### 概述

该处理程序使用长轮询的方式以`pages`形式返回结果。

1. 首先，使用`POST`请求发送`/v1/query`，请求体为`QueryRequest`类型的JSON，其中包含要执行的SQL语句，返回类型为`QueryResponse`的JSON。
2. 使用`QueryResponse`的字段进行进一步处理：
    1. 使用`next_uri`发起`GET`请求，返回查询结果的下一个`page`。同样，返回的是`QueryResponse`类型的JSON，以相同的方式处理，直到`next_uri`为null。
    2. （可选）使用`kill_uri`发起`GET`请求，终止查询。返回空响应体。
    3. （可选）使用`stats_uri`发起`GET`请求，一次性获取统计信息（不进行长轮询），返回带有空`data`字段的`QueryResponse`。

### 快速示例

```shell
curl -u root: \
  --request POST \
  '127.0.0.1:8001/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

此SQL将使用默认会话和分页设置运行，主要包括：

1. 使用一个新的临时会话和`default`数据库。
2. 每个请求最多等待1秒钟以获取结果。

有关更高级的配置，请参阅下面的参考文档：

您将获得类似以下格式的JSON响应（已格式化）：

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

QueryRequest:

| 字段         | 类型         | 必填     | 默认值  | 描述                                  |
|--------------|--------------|----------|---------|---------------------------------------|
| sql          | string       | 是       |         | 要执行的SQL语句                        |
| session_id   | string       | 否       |         | 仅在重用服务器端会话时使用              |
| session      | SessionState | 否       |         |                                       |
| pagination   | Pagination   | 否       |         | 用于此POST请求的唯一查询ID             |

SessionState:

| 字段                    | 类型                | 必填     | 默认值    | 描述                                                   |
|-------------------------|---------------------|----------|-----------|-------------------------------------------------------|
| database                | string              | 否       | "default" | 设置当前数据库                                         |
| keep_server_session_secs| int                 | 否       | 0         | 最后一个查询完成后，会话将保留的秒数                     |
| settings                | map(string, string) | 否       | 0         |                                                         |

OldSession:

| 字段 | 类型   | 必填     | 默认值  | 描述                          |
|-------|--------|----------|---------|--------------------------------|
| id    | string | 是       |         | QueryResponse.session_id的值 |

Pagination: 每个HTTP请求返回的关键条件（在所有剩余结果准备好返回之前）

| 字段           | 类型 | 必填     | 默认值  | 描述            |
|----------------|------|----------|---------|----------------|
| wait_time_secs | u32  | 否       | 1       | 长轮询时间（秒） |

## 查询响应

QueryResponse:

| 字段        | 类型           | 描述                                   |
|------------|---------------|---------------------------------------|
| state      | string        | 选择: "Running","Failed", "Succeeded" |
| error      | QueryError    | SQL解析或执行错误                      |
| id         | string        | 此POST请求的唯一查询ID                 |
| data       | array         | 每个项目是结果的一行                    |
| schema     | array         | 有序的Field序列                        |
| affect     | Affect        | 某些查询的影响                         |
| session_id | String        |                                       |
| session    | SessionState  |                                       |

Field:

| 字段    | 类型   |
|----------|--------|
| name     | string |
| type     | string |

Stats:

| 字段             | 类型          | 描述                                                                                                          |
|-----------------|---------------|--------------------------------------------------------------------------------------------------------------|
| running_time_ms | float         | 查询开始执行后经过的毫秒数，当查询完成（state != Running）时停止计时                                             |
| scan_progress   | QueryProgress | 查询扫描进度                                                                                                  |

Progress:

| 字段              | 类型 |
|--------------------|------|
| read_rows          | int  |
| read_bytes         | int  |

Error:

| 字段     | 类型   | 描述                       |
|-----------|--------|---------------------------|
| stats     | int    | 在databend内部使用的错误代码 |
| message   | string | 错误消息                   |
| backtrace | string |                           |

Affect:

| 字段 | 类型   | 描述         |
|-------|--------|-------------|
| type  | string | ChangeSetting/UseDB |
| ...   |        | 根据类型     |

### 响应状态码

不同类型错误的状态码用法：

| code | error                                                                       |
|------|-----------------------------------------------------------------------------|
| 200  | 如果SQL无效或失败，则详细信息在JSON的`error`字段中                           |
| 404  | "query_id"或"page"未找到                                                      |
| 400  | 无效的请求格式                                                               |

当状态码不是200时，请检查响应正文以获取错误原因字符串。

### 数据格式

`.data`中的所有字段值都以字符串表示，客户端需要根据`schema`字段中的信息解释这些值。

### 客户端会话

由于HTTP的无状态性质，很难在服务器端维护会话。
在发起新请求时，客户端需要在`session`字段中配置会话。

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

设置的所有值都应该是字符串。

如果SQL是`set`或`use`，会更改`session`，可以在响应中返回给客户端，
客户端需要记录并在后续请求中放入它。

### QueryAffect（实验性）

对于每个SQL，客户端可以获得一个可选的表格形式的`result`。
客户端还可以获得关于读/写行/字节的`progress`的信息。
由于它们的限制，客户端可能无法获得有关查询的所有有趣信息。
因此，我们添加了`QueryAffect`来携带有关查询的一些额外信息。

请注意，`QueryAffect`面向高级用户，不稳定。
不建议使用`QueryAffect`来维护会话。

### 会话和QueryAffect示例：


set语句：

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

响应：

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

use语句：

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

响应：

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

官方客户端[bendsql](https://github.com/datafuselabs/bendsql)主要基于HTTP处理程序。

[databend](https://github.com/datafuselabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs)的[sqllogictest](https://github.com/datafuselabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs)中有一个最简单的HTTP处理程序客户端实现的示例。