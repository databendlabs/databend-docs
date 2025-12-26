---
title: HTTP 流式导入（本地文件）
sidebar_label: HTTP 流式导入
sidebar_position: 30
---

本页介绍 **Databend 自建（self-hosted）** 环境下的 **HTTP Streaming Load**（Databend Query HTTP Handler）。

它可以让你把本地文件直接通过 HTTP 上传，并在同一次请求里写入表中，无需先把文件上传到 stage。

## 概览

HTTP Streaming Load 是一个专门用来“边传边导入”的接口：服务端接收 `multipart/form-data` 上传的文件流，然后执行一条读取特殊占位符 `@_databend_load` 的 `INSERT` 语句，把文件内容写入目标表。

适用场景：

- 本地文件想直接导入，不想先上传到 stage。
- 文件很大，不适合以单个对象的形式落到对象存储中。

## 接口用法

**Endpoint：** `PUT /v1/streaming_load`

### 请求

- 认证：HTTP Basic auth（与其它 HTTP Handler 接口一致）。
- Headers：
  - `X-Databend-SQL`（必需）：一条从 `@_databend_load` 读取的 `INSERT` 语句。
- Body：
  - `multipart/form-data`，仅包含一个文件字段，字段名必须是 `upload`。

**SQL 结构（必需）：**

```sql
INSERT INTO <db>.<table>[(<col1>, <col2>, ...)]
[(VALUES (<expr_or_?>, ...))]
FROM @_databend_load
FILE_FORMAT=(type=<format> [<options>...])
```

### 指定目标列与 `VALUES`

你可以：

- 指定写入的目标列：`INSERT INTO t(col1, col2, ...) ...`
- 在 `FROM` 前写 `VALUES (...)`：
  - 用 `?` 表示从上传文件中读取的字段（按顺序对应）。
  - `?` 可以与常量混用。

示例（从 CSV 读取两列，并补一个常量列）：

```text
X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)
```

### 列映射规则

- **不写列清单，也不写 `VALUES`**：按表的列定义顺序写入（文件字段依次对应表列）。
  - CSV 表头：`id,name,age`
  - SQL：
    ```text
    X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **写了列清单，但不写 `VALUES`**：按列清单的顺序写入（文件字段依次对应列清单）。
  - CSV 表头：`id,name`
  - SQL：
    ```text
    X-Databend-SQL: insert into demo.people(id,name) from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **写了列清单且写 `VALUES`**：
  - 每个目标列对应 `VALUES` 中的一个表达式。
  - `VALUES` 里的每个 `?` 会依次消费上传文件里的一个字段。
  - CSV 表头：`name,age`
  - SQL：
    ```text
    X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)
    ```
- **未提供的列**：
  - 如果该列有 `DEFAULT`，则使用默认值；
  - 否则写入 `NULL`（若列是 `NOT NULL` 则会失败）。
- **只读取 CSV 的部分字段（忽略多余字段）**：
  - 默认情况下，如果文件字段数多于目标列清单，会直接报错。
  - 如需忽略多余字段，设置 `error_on_column_count_mismatch=false`：
    ```text
    X-Databend-SQL: insert into demo.people(id,name) from @_databend_load file_format=(type=csv skip_header=1 error_on_column_count_mismatch=false)
    ```
  - 这个能力只适用于“取前 N 列”的场景。Streaming load 按字段位置映射，不支持挑选非连续列（例如 `id,name,age` 想只导入 `id` 和 `age`）。
    - 解决思路：先在本地把 CSV 预处理成只包含需要的列，或先上传到 stage 再用 `SELECT $1, $3 FROM @stage/file.csv` 这种方式做列投影。

**cURL 模板：**

```shell
curl -u "<user>:<password>" \
  -H "X-Databend-SQL: insert into <db>.<table> from @_databend_load file_format=(type=csv ...)" \
  -F "upload=@./file.csv" \
  -X PUT "http://<host>:8000/v1/streaming_load"
```

### 返回

成功时返回类似：

```json
{"id":"<query_id>","stats":{"rows":<rows>,"bytes":<bytes>}}
```

### 注意与限制

- `@_databend_load` 只在 `PUT /v1/streaming_load` 中有效；用 `POST /v1/query` 执行会报错。
- Streaming load 目前支持的格式：**CSV**、**TSV**、**NDJSON**、**Parquet**。

## CSV 的 FILE_FORMAT 选项

CSV 的解析规则通过 `FILE_FORMAT=(...)` 指定，语法与 Databend 的文件格式选项一致。更多选项请参考 [输入输出文件格式](/sql/sql-reference/file-format-options)。

常用参数：

- `skip_header=1`：跳过首行表头。
- `field_delimiter=','`：字段分隔符（默认 `,`）。
- `quote='\"'`：引用符号。
- `record_delimiter='\n'`：行分隔符。
- `error_on_column_count_mismatch=false`：允许列数不匹配并忽略多余字段。

示例：

```text
X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv skip_header=1)
```

```text
X-Databend-SQL: insert into demo.people from @_databend_load file_format=(type=csv field_delimiter='|' quote='\"' skip_header=1)
```

## 教程

下面用一个本地 CSV 演示从启动到导入的完整流程。

### 准备工作

- 已启动的 self-hosted `databend-query`（HTTP Handler 默认端口 `8000`）。
- 本机已安装 `curl`。

### 步骤 1：用 Docker 快速启动（用于验证）

:::note
`PUT /v1/streaming_load` 在较新的 nightly 版本中可用。如果你使用稳定版镜像返回 `404 Not Found`，请切换到 `:nightly`（或自行编译 Databend）。
:::

```shell
docker run -d --name databend-streaming-load \
  -p 8000:8000 \
  -e MINIO_ENABLED=true \
  -e QUERY_DEFAULT_USER=databend \
  -e QUERY_DEFAULT_PASSWORD=databend \
  --restart unless-stopped \
  datafuselabs/databend:nightly
```

等待服务就绪：

```shell
docker logs -f databend-streaming-load
```

### 步骤 2：建库建表

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"create database if not exists demo"}' \
  http://localhost:8000/v1/query/ >/dev/null

curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"create or replace table demo.people (id int, name string, age int)"}' \
  http://localhost:8000/v1/query/ >/dev/null
```

### 步骤 3：准备本地 CSV 文件

这个示例 CSV：

- 第一行是表头（`id,name,age`）
- 使用英文逗号作为分隔符（`,`）

```shell
cat > people.csv << 'EOF'
id,name,age
1,Alice,30
2,Bob,41
EOF
```

### 步骤 4：上传并导入

```shell
curl -sS -u databend:databend \
  -H "X-Databend-SQL: insert into demo.people(id,name,age) from @_databend_load file_format=(type=csv field_delimiter=',' skip_header=1)" \
  -F "upload=@./people.csv" \
  -X PUT "http://localhost:8000/v1/streaming_load"
```

### 步骤 5：验证结果

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"select * from demo.people order by id"}' \
  http://localhost:8000/v1/query/
```

### （可选）步骤 6：只导入部分列，并用 `VALUES` 补齐其它列

这一小节演示：上传的文件只包含部分列，其它列用常量补齐写入。

1. 准备一个只包含 `name`、`age` 的 CSV：

```shell
cat > people_name_age.csv << 'EOF'
name,age
Carol,25
Dave,52
EOF
```

2. 导入到 `demo.people`，并把 `city` 固定写成常量：

```shell
curl -sS -u databend:databend \
  -H "X-Databend-SQL: insert into demo.people(name,age,city) values (?, ?, 'BJ') from @_databend_load file_format=(type=csv skip_header=1)" \
  -F "upload=@./people_name_age.csv" \
  -X PUT "http://localhost:8000/v1/streaming_load"
```

3. 验证：

```shell
curl -sS -u databend:databend \
  -H 'Content-Type: application/json' \
  -d '{"sql":"select id,name,age,city from demo.people order by name"}' \
  http://localhost:8000/v1/query/
```

## 常见问题排查

- `/v1/streaming_load` 返回 `404 Not Found`：使用 `datafuselabs/databend:nightly`（或自行编译）。
- 返回 `415 Unsupported Media Type`：请求必须是 `multipart/form-data`，且文件字段名必须是 `upload`。
- 提示缺少 `X-Databend-SQL`：加上该 header，并确保 SQL 包含 `FROM @_databend_load`。
