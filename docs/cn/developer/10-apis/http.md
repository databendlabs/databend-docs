---
title: HTTP API
sidebar_label: HTTP API
---

# HTTP API

Databend HTTP API 是一个 REST API，用于发送查询语句在服务器上执行，并将结果返回给客户端。

HTTP API 由 databend-query 托管，可以通过使用 `--http_handler_host` 和 `--http_handler_port` 来指定（默认为 8000）。

## HTTP 方法

### 概述

此 API 以 `pages` 形式返回结果，并支持长轮询。

1. 首先，通过 `POST` 方法向 `/v1/query` 发送一个类型为 `QueryRequest` 的 JSON，其中包含要执行的 SQL 语句，返回一个类型为 `QueryResponse` 的 JSON。
2. 使用 `QueryResponse` 的字段进行进一步处理：
   1. 通过 `GET` 方法访问 `next_uri` 返回查询结果的下一个 `page`。它也返回 `QueryResponse`，以相同的方式处理，直到 `next_uri` 为 null。
   2. （可选）通过 `GET` 方法访问 `kill_uri` 来终止查询。返回空 body。
   3. （可选）通过 `GET` 方法访问 `stats_uri` 来仅获取一次统计信息（不进行长轮询），返回 `data` 字段为空的 `QueryResponse`。

请注意，在查询完成之前，您应该持续使用最新的 `next_uri` 来获取下一页结果，否则可能会错过一些结果或泄漏会话资源，直到会话超时。当您收到查询的所有结果时，`next_uri` 将为 null。

### 快速示例

```shell
curl -u root: \
  --request POST \
  '127.0.0.1:8001/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

SQL 将使用默认会话和分页设置运行，主要包括：

1. 使用具有 `default` 数据库的新的一次性会话。
2. 每次请求最多等待 1 秒钟以获取结果，然后返回。

有关更多高级配置，请参见下面的参考：

您应该获得如下 JSON（已格式化）：

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [
    {
      "name": "avg(number)",
      "type": "Nullable(Float64)"
    }
  ],
  "data": [["49999999.5"]],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {
      "rows": 100000000,
      "bytes": 800000000
    },
    "write_progress": {
      "rows": 0,
      "bytes": 0
    },
    "result_progress": {
      "rows": 1,
      "bytes": 9
    },
    "total_scan": {
      "rows": 100000000,
      "bytes": 800000000
    },
    "running_time_ms": 446.748083
  },
  "affect": null,
  "stats_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "final_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "next_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "kill_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill"
}
```

## Query Request

QueryRequest

| 字段        | 类型         | 必需   | 默认值   | 描述                               |
| ----------- | ------------ | ------ | -------- | ---------------------------------- |
| sql         | string       | 是      |          | 要执行的 SQL 语句                    |
| session_id  | string       | 否      |          | 仅在重用服务器端会话时使用           |
| session     | SessionState | 否      |          |                                    |
| pagination  | Pagination   | 否      |          | 此 POST 请求的唯一 query_id        |

SessionState

| 字段                       | 类型                | 必需   | 默认值     | 描述                                                         |
| -------------------------- | ------------------- | ------ | ---------- | ------------------------------------------------------------ |
| database                   | string              | 否      | "default"  | 设置 current_database                                        |
| keep_server_session_secs   | int                 | 否      | 0          | 会话在上次查询完成后保留的秒数                               |
| settings                   | map(string, string) | 否      | 0          |                                                              |

OldSession

| 字段   | 类型   | 必需   | 默认值   | 描述                               |
| ------ | ------ | ------ | -------- | ---------------------------------- |
| id     | string | 是      |          | 来自 QueryResponse 的 session_id   |

Pagination: 每个 HTTP 请求返回的关键条件（在所有剩余结果准备好返回之前）

| 字段           | 类型   | 必需   | 默认值   | 描述               |
| -------------- | ------ | ------ | -------- | ------------------ |
| wait_time_secs | u32    | 否      | 1        | 长轮询时间           |

## Query Response

QueryResponse:

| 字段        | 类型         | 描述                               |
| ----------- | ------------ | ---------------------------------- |
| state       | string       | choices: "Running","Failed", "Succeeded" |
| error       | QueryError   | SQL 解析或执行的错误                |
| id          | string       | 此 POST 请求的唯一 query_id        |
| data        | array        | 每个项目是结果的一行                 |
| schema      | array        | Field 的有序序列                   |
| affect      | Affect       | 一些查询的影响                     |
| session_id  | String       |                                    |
| session     | SessionState |                                    |

Field:

| 字段   | 类型   |
| ------ | ------ |
| name   | string |
| type   | string |

Stats:

| 字段            | 类型          | 描述                                                                                             |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| running_time_ms | float         | 从查询开始到内部执行所经过的毫秒数，在查询完成时停止计时 (state != Running)                     |
| scan_progress   | QueryProgress | 查询扫描进度                                                                                     |

Progress:

| 字段        | 类型   |
| ----------- | ------ |
| read_rows   | int    |
| read_bytes  | int    |

Error:

| 字段        | 类型   | 描述                       |
| ----------- | ------ | -------------------------- |
| stats       | int    | databend 内部使用的错误代码 |
| message     | string | 错误消息                     |
| backtrace   | string |                            |

Affect:

| 字段   | 类型   | 描述               |
| ------ | ------ | ------------------ |
| type   | string | ChangeSetting/UseDB |
| ...    |        | 根据类型             |

### Response Status Code

不同类型错误的状态码用法：

| 代码   | 错误                                                                       |
| ------ | -------------------------------------------------------------------------- |
| 200    | 如果 SQL 无效或失败，详细信息在 JSON 的 `error` 字段中                       |
| 404    | 未找到 "query_id" 或 "page"                                               |
| 400    | 无效的请求格式                                                             |

当状态码不是 200 时，请检查响应正文中的错误原因（作为字符串）。

### data 格式

`.data` 中的所有字段值都以字符串形式表示，
客户端需要借助 `schema` 字段中的信息来解释这些值。

### 客户端会话

由于 HTTP 的无状态特性，很难在服务器端维护会话。
客户端需要在启动新请求时在 `session` 字段中配置会话。

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

所有设置的值都应该是字符串。

如果 SQL 是 `set` 或 `use`，则 `session` 将会更改，可以在响应中返回给客户端，
客户端需要记录它并将其放入后续请求中。

### QueryAffect (实验性)

对于每个 SQL，客户端都会获得一个可选的表格形式的 `result`。
客户端还可以获得关于读取/写入的行/字节数的 `progress` 信息。
由于它们的限制，客户端可能无法获得关于查询的所有有趣信息。
因此，我们添加了 `QueryAffect` 来携带关于查询的一些额外信息。

请注意，`QueryAffect` 适用于高级用户，并且不稳定。
不建议使用 QueryAffect 来维护会话。

### Session 和 QueryAffect 示例：

set 语句：

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

use 语句：

```json
{
  "sql": "use db2",
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

## Stage Attachment

Databend 允许您通过使用 `INSERT INTO` 或 `REPLACE INTO` 语句及其 HTTP Handler，将暂存文件中的数据插入或更新到表中。

### 示例：从暂存文件插入数据

```sql
create table t_insert_stage(a int null, b int default 2, c float, d varchar default 'd');
```

将 `values.csv` 上传到 Stage：

```plain title='values.csv'
1,1.0
2,2.0
3,3.0
4,4.0
```

```shell title='Request /v1/upload_to_stage' API
curl -H "stage_name:my_int_stage" -F "upload=@./values.csv" -XPUT http://root:@localhost:8000/v1/upload_to_stage
```

使用上传的文件插入：


```shell
curl -d '{"sql": "insert into t_insert_stage (a, c) values", "stage_attachment": {"location": "@my_int_stage/values.csv", "file_format_options": {}, "copy_options": {}}}' -H 'Content-type: application/json' http://root:@localhost:8000/v1/query
```

:::tip
您可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令中提供的 FILE_FORMAT 和 COPY_OPTIONS 来指定文件格式和各种与复制相关的设置。当 `purge` 设置为 `true` 时，只有在数据更新成功后才会删除原始文件。
:::

验证插入的数据：

```sql
select * from t_insert_stage;
+------+------+------+------+
| a    | b    | c    | d    |
+------+------+------+------+
|    1 |    2 |  1.0 | d    |
|    2 |    2 |  2.0 | d    |
|    3 |    2 |  3.0 | d    |
|    4 |    2 |  4.0 | d    |
+------+------+------+------+
```

### 示例：使用 Stage 文件替换数据

首先，创建一个名为 "sample" 的表：

```sql
CREATE TABLE sample
(
    Id      INT,
    City    VARCHAR,
    Score   INT,
    Country VARCHAR DEFAULT 'China'
);
```

然后，创建一个内部 Stage 并上传一个名为 [sample_3_replace.csv](https://github.com/ZhiHanZ/databend/blob/0f333a13fc38548595ea58242a37c5f4a73e9c88/tests/data/sample_3_replace.csv) 的示例 CSV 文件到 Stage：

```sql
CREATE STAGE s1 FILE_FORMAT = (TYPE = CSV);
```

```shell
curl -u root: -H "stage_name:s1" -F "upload=@sample_3_replace.csv" -XPUT "http://localhost:8000/v1/upload_to_stage"
{"id":"b8305187-c816-4bb5-8350-c441b85baaf9","stage_name":"s1","state":"SUCCESS","files":["sample_3_replace.csv"]}
```

```sql
LIST @s1;
name                |size|md5|last_modified                |creator|
--------------------+----+---+-----------------------------+-------+
sample_3_replace.csv|  83|   |2023-06-12 03:01:56.522 +0000|       |
```

使用 REPLACE INTO 通过 HTTP handler 插入 Stage CSV 文件中的数据：

:::tip
您可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令中提供的 FILE_FORMAT 和 COPY_OPTIONS 来指定文件格式和各种与复制相关的设置。当 `purge` 设置为 `true` 时，只有在数据更新成功后才会删除原始文件。
:::

```shell
curl -s -u root: -XPOST "http://localhost:8000/v1/query" --header 'Content-Type: application/json' -d '{"sql": "REPLACE INTO sample (Id, City, Score) ON(Id) VALUES", "stage_attachment": {"location": "@s1/sample_3_replace.csv", "copy_options": {"purge": "true"}}}'
{"id":"92182fc6-11b9-461b-8fbd-f82ecaa637ef","session_id":"f5caf18a-5dc8-422d-80b7-719a6da76039","session":{},"schema":[],"data":[],"state":"Succeeded","error":null,"stats":{"scan_progress":{"rows":5,"bytes":83},"write_progress":{"rows":5,"bytes":277},"result_progress":{"rows":0,"bytes":0},"total_scan":{"rows":0,"bytes":0},"running_time_ms":143.632441},"affect":null,"stats_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef","final_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/final","next_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/final","kill_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/kill"}
```

验证插入的数据：

```sql
SELECT * FROM sample;
id|city       |score|country|
--+-----------+-----+-------+
 1|'Chengdu'  |   80|China  |
 3|'Chongqing'|   90|China  |
 6|'HangZhou' |   92|China  |
 9|'Changsha' |   91|China  |
10|'Hong Kong'|   88|China  |
```

## 客户端实现

官方客户端 [bendsql](https://github.com/databendlabs/bendsql) 主要基于 HTTP handler。

HTTP handler 客户端实现的最简单示例位于 Databend 的 [sqllogictest](https://github.com/databendlabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs) 中。
