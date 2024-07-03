---
title: HTTP 处理程序
sidebar_label: REST API
---

Databend 的 HTTP 处理程序是一个 REST API，用于向服务器发送查询语句以执行，并将结果返回给客户端。

HTTP 处理程序由 databend-query 托管，可以通过使用 `--http_handler_host` 和 `--http_handler_port`（默认为 8000）来指定。

## HTTP 方法

### 概览

此处理程序通过长轮询以 `页` 的形式返回结果。

1. 从向 `/v1/query` 发送一个 `POST` 请求开始，包含类型为 `QueryRequest` 的 JSON，其中包含要执行的 SQL，返回类型为 `QueryResponse` 的 JSON。
2. 使用 `QueryResponse` 的字段进行进一步处理：
   1. 向 `next_uri` 发送一个 `GET` 请求，返回查询结果的下一页。同样返回 `QueryResponse`，以此类推，直到 `next_uri` 为空。
   2. （可选）向 `kill_uri` 发送一个 `GET` 请求以终止查询。返回空体。
   3. （可选）向 `stats_uri` 发送一个 `GET` 请求，一次性获取统计信息（不使用长轮询），返回 `QueryResponse` 且 `data` 字段为空。

请注意，在查询完成之前，应始终使用最新的 `next_uri` 获取下一页结果，否则可能会错过某些结果或在会话超时之前泄露会话资源。当您收到查询的所有结果时，`next_uri` 将为空。

### 快速示例

```shell
curl -u root: \
  --request POST \
  '127.0.0.1:8001/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

SQL 将使用默认会话和分页设置运行，主要为：

1. 使用 `default` 数据库的新一次性会话。
2. 每次请求最多等待 1 秒以获取结果后返回。

更多高级配置，请参阅下面的参考：

您应该会收到如下 JSON（格式化）：

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

| 字段         | 类型         | 必填 | 默认值 | 描述                                      |
|--------------|--------------|------|--------|-------------------------------------------|
| sql          | 字符串       | 是   |        | 要执行的 SQL                               |
| session_id   | 字符串       | 否   |        | 仅在重用服务器端会话时使用                |
| session      | SessionState | 否   |        |                                           |
| pagination   | Pagination   | 否   |        | 此 POST 请求的唯一 query_id               |

SessionState

| 字段                    | 类型                | 必填 | 默认值   | 描述                                                   |
|------------------------|---------------------|------|----------|--------------------------------------------------------|
| database               | 字符串              | 否   | "default" | 设置 current_database                                  |
| keep_server_session_secs | 整数                | 否   | 0        | 会话在最后一个查询完成后将保留的秒数                  |
| settings               | map(字符串, 字符串) | 否   | 0        |                                                      |

OldSession

| 字段 | 类型   | 必填 | 默认值 | 描述                              |
|------|--------|------|--------|-----------------------------------|
| id   | 字符串 | 是   |        | 来自 QueryResponse.session_id 的 session_id |

Pagination: 每个 HTTP 请求返回的关键条件（在所有剩余结果准备好返回之前）

| 字段          | 类型 | 必填 | 默认值 | 描述       |
|---------------|------|------|--------|------------|
| wait_time_secs | u32  | 否   | 1      | 长轮询时间 |

## 查询响应

QueryResponse:

| 字段      | 类型          | 描述                              |
|-----------|---------------|-----------------------------------|
| state     | 字符串        | 选项："Running","Failed", "Succeeded" |
| error     | QueryError    | SQL 解析或执行的错误              |
| id        | 字符串        | 此 POST 请求的唯一 query_id       |
| data      | 数组          | 每个项是结果的一行                |
| schema    | 数组          | 字段的顺序序列                    |
| affect    | Affect        | 某些查询的影响                    |
| session_id | 字符串        |                                   |
| session   | SessionState  |                                   |

Field:

| 字段   | 类型     |
|--------|----------|
| name   | 字符串   |
| type   | 字符串   |

Stats:

| 字段               | 类型          | 描述                                                                                                      |
|--------------------|---------------|-----------------------------------------------------------------------------------------------------------|
| running_time_ms    | 浮点数        | 自查询开始执行内部以来经过的百万秒，当查询完成（状态 != 运行中）时停止计时                               |
| scan_progress      | QueryProgress | 查询扫描进度                                                                                              |

Progress:

| 字段             | 类型 |
|------------------|------|
| read_rows        | 整数 |
| read_bytes       | 整数 |

Error:

| 字段       | 类型   | 描述                     |
|------------|--------|--------------------------|
| stats      | 整数   | Databend 内部使用的错误代码 |
| message    | 字符串 | 错误消息                 |
| backtrace  | 字符串 |                          |

Affect:

| 字段 | 类型   | 描述         |
|------|--------|--------------|
| type | 字符串 | ChangeSetting/UseDB |
| ...  |        | 根据类型       |

### 响应状态码

不同类型错误的状态码使用：

| 代码 | 错误                                                                       |
|------|-----------------------------------------------------------------------------|
| 200  | 如果 SQL 无效或失败，详细信息在 JSON 的 `error` 字段中                         |
| 404  | "query_id" 或 "page" 未找到                                                   |
| 400  | 无效的请求格式                                                              |

当状态码不是 200 时，检查响应体中的错误原因作为字符串。

### 数据格式

`.data` 中的所有字段值都以字符串表示，
客户端需要借助 `schema` 字段中的信息来解释这些值。

### 客户端会话

由于 HTTP 的无状态特性，很难在服务器端维护会话。
客户端需要在开始新请求时在 `session` 字段中配置会话。

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

设置中的所有值都应该是字符串。

如果 SQL 是 `set` 或 `use`，`session` 将会改变，可以在响应中带回给客户端，
客户端需要记录它并在后续请求中放入。

### QueryAffect（实验性）

对于每个 SQL，客户端会得到一个可选的表格形式的 `result`。
客户端还会得到关于读/写行/字节的 `progress` 信息。
由于它们的限制，客户端可能无法获得有关查询的所有有趣信息。
因此，我们添加了 `QueryAffect` 来携带有关查询的一些额外信息。

请注意，`QueryAffect` 是为高级用户准备的，并且不稳定。
不建议使用 QueryAffect 来维护会话。

### 会话和 QueryAffect 示例：

设置语句：

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

使用语句：

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

## 阶段附件

Databend 允许您通过使用带有其 HTTP 处理程序的 `INSERT INTO` 或 `REPLACE INTO` 语句，从阶段文件向表插入或更新数据。

### 示例：从阶段文件插入数据

```sql
create table t_insert_stage(a int null, b int default 2, c float, d varchar default 'd');
```

将 `values.csv` 上传到一个阶段：

```plain title='values.csv'
1,1.0
2,2.0
3,3.0
4,4.0
```

```shell title='请求 /v1/upload_to_stage' API
curl -H "stage_name:my_int_stage" -F "upload=@./values.csv" -XPUT http://root:@localhost:8000/v1/upload_to_stage
```

使用上传的文件进行插入操作：

```shell
curl -d '{"sql": "insert into t_insert_stage (a, c) values", "stage_attachment": {"location": "@my_int_stage/values.csv", "file_format_options": {}, "copy_options": {}}}' -H 'Content-type: application/json' http://root:@localhost:8000/v1/query
```

:::tip
您可以通过[COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)命令中提供的FILE_FORMAT和COPY_OPTIONS来指定文件格式及各种复制相关设置。当`purge`设置为`true`时，只有数据更新成功后，原始文件才会被删除。
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

### 示例：使用暂存文件替换数据

首先，创建一个名为"sample"的表：

```sql
CREATE TABLE sample
(
    Id      INT,
    City    VARCHAR,
    Score   INT,
    Country VARCHAR DEFAULT 'China'
);
```

然后，创建一个内部阶段并上传名为[sample_3_replace.csv](https://github.com/ZhiHanZ/databend/blob/0f333a13fc38548595ea58242a37c5f4a73e9c88/tests/data/sample_3_replace.csv)的示例CSV文件到该阶段：

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

使用REPLACE INTO通过HTTP处理程序从暂存的CSV文件插入数据：

:::tip
您可以通过[COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)命令中提供的FILE_FORMAT和COPY_OPTIONS来指定文件格式及各种复制相关设置。当`purge`设置为`true`时，只有数据更新成功后，原始文件才会被删除。
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

官方客户端[bendsql](https://github.com/datafuselabs/bendsql)主要基于HTTP处理程序。

最简单的HTTP处理程序客户端实现示例位于[sqllogictest](https://github.com/datafuselabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs)中，用于databend。