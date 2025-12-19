---
title: HTTP Handler
sidebar_label: REST API
---

Databend HTTP Handler 是一个 REST API，可以让你通过 HTTP 请求直接向 Databend 发送 SQL 查询并获取结果。它适用于构建自定义集成、自动化脚本，或者需要在不使用驱动程序的情况下进行编程访问的场景。

:::tip 推荐替代方案
对于大多数场景，我们推荐使用：
- **[BendSQL](/guides/sql-clients/bendsql)** - 官方命令行客户端，用于交互式查询
- **[Python 驱动](/developer/drivers/python)** - 适用于 Python 应用
- **[Go 驱动](/developer/drivers/golang)** - 适用于 Go 应用
- **[Node.js 驱动](/developer/drivers/nodejs)** - 适用于 Node.js 应用

HTTP API 适合需要轻量级 HTTP 集成或构建自定义工具的场景。
:::

## 快速开始：连接 Databend

### Databend Cloud

连接到 Databend Cloud 时，您会获得如下格式的 DSN（数据源名称）：

```
databend://user:password@tn3ftqihs.gw.aws-us-east-2.default.databend.com:443/default?warehouse=my-warehouse
```

使用 HTTP API 时，按如下方式提取各组件：

| DSN 组件 | 说明 | HTTP API 用法 |
|----------|------|---------------|
| `user:password` | 您的凭证 | 基础认证：`-u "user:password"` |
| `tn3ftqihs` | 您的租户 ID | 端点 host 的一部分 |
| `tn3ftqihs.gw...databend.com` | 完整 host | 端点：`https://<host>/v1/query/` |
| `warehouse=my-warehouse` | Warehouse 名称 | 请求头：`X-DATABEND-WAREHOUSE: my-warehouse` |
| `default` | 数据库名称 | 请求体中：`"session": {"database": "default"}` |

**完整示例：**

```bash
curl -u "user:password" \
  --request POST \
  'https://tn3ftqihs.gw.aws-us-east-2.default.databend.com/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: my-warehouse' \
  --data-raw '{"sql": "SELECT 1"}'
```

### 自托管 Databend

自托管安装时，HTTP Handler 默认运行在 8000 端口：

```bash
curl -u root: \
  --request POST \
  'http://localhost:8000/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT 1"}'
```

---

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/v1/query` | POST | 执行 SQL 查询 |
| `/v1/query/<query_id>` | GET | 获取查询状态和统计信息 |
| `/v1/query/<query_id>/page/<page_no>` | GET | 获取指定页的结果 |
| `/v1/query/<query_id>/kill` | GET | 取消正在执行的查询 |
| `/v1/query/<query_id>/final` | GET | 获取最终结果并关闭查询 |
| `/v1/upload_to_stage` | PUT | 上传文件到 Stage |

---

## 执行查询

执行 SQL 语句并获取结果。

**端点：** `POST /v1/query`

### 请求

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "SELECT number, number * 2 AS double FROM numbers(5)",
    "pagination": {
      "wait_time_secs": 5
    }
  }'
```

### 响应

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [
    {"name": "number", "type": "UInt64"},
    {"name": "double", "type": "UInt64"}
  ],
  "data": [
    ["0", "0"],
    ["1", "2"],
    ["2", "4"],
    ["3", "6"],
    ["4", "8"]
  ],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 5, "bytes": 40},
    "write_progress": {"rows": 0, "bytes": 0},
    "result_progress": {"rows": 5, "bytes": 80},
    "running_time_ms": 12.443044
  },
  "stats_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "final_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "next_uri": null,
  "kill_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill"
}
```

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| sql | string | 是 | - | 要执行的 SQL 语句 |
| session_id | string | 否 | - | 复用已有会话 |
| session | object | 否 | - | 会话配置（见下方） |
| pagination | object | 否 | - | 分页设置（见下方） |

**Session 对象：**

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| database | string | "default" | 当前数据库 |
| keep_server_session_secs | int | 0 | 查询完成后保持会话的秒数 |
| settings | map | {} | 查询设置（值为字符串） |

**Pagination 对象：**

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| wait_time_secs | int | 1 | 等待结果的最大秒数 |

### 响应字段

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 唯一查询 ID |
| session_id | string | 会话 ID，用于复用 |
| state | string | `Running`、`Succeeded` 或 `Failed` |
| schema | array | 列定义 |
| data | array | 结果行，以字符串数组形式返回 |
| error | object | 错误详情（成功时为 null） |
| stats | object | 执行统计信息 |
| next_uri | string | 下一页结果的 URL（无更多结果时为 null） |
| final_uri | string | 完成并关闭查询的 URL |
| kill_uri | string | 取消查询的 URL |

---

## 获取查询状态

获取查询的当前状态和统计信息，不获取更多数据。

**端点：** `GET /v1/query/<query_id>`

### 请求

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### 响应

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [],
  "data": [],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 5, "bytes": 40},
    "write_progress": {"rows": 0, "bytes": 0},
    "result_progress": {"rows": 5, "bytes": 80},
    "running_time_ms": 12.443044
  },
  "next_uri": null
}
```

---

## 获取下一页

获取正在运行或已完成查询的下一页结果。

**端点：** `GET /v1/query/<query_id>/page/<page_no>`

### 请求

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/page/1' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### 响应

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "schema": [
    {"name": "number", "type": "UInt64"}
  ],
  "data": [
    ["5"],
    ["6"],
    ["7"],
    ["8"],
    ["9"]
  ],
  "state": "Succeeded",
  "next_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/page/2"
}
```

---

## 取消查询

终止正在执行的查询。

**端点：** `GET /v1/query/<query_id>/kill`

### 请求

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### 响应

成功时返回空 body，状态码 200。

---

## 完成查询

关闭查询并释放服务器资源。如果还有剩余结果，也会一并返回。

**端点：** `GET /v1/query/<query_id>/final`

### 请求

```bash
curl -u "user:password" \
  'https://<endpoint>/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>'
```

### 响应

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "state": "Succeeded",
  "data": [],
  "error": null,
  "stats": {
    "running_time_ms": 12.443044
  }
}
```

---

## 上传到 Stage

上传文件到内部或外部 Stage。

**端点：** `PUT /v1/upload_to_stage`

### 请求

```bash
curl -u "user:password" \
  -H "stage_name:my_stage" \
  -F "upload=@./data.csv" \
  -XPUT 'https://<endpoint>/v1/upload_to_stage'
```

### 响应

```json
{
  "id": "bf44e659-7d2b-4c0f-ae09-693e77258183",
  "stage_name": "my_stage",
  "state": "SUCCESS",
  "files": ["data.csv"]
}
```

---

## 从 Stage 插入数据

使用 Stage Attachment 将 Stage 中的文件数据插入到表中。

**端点：** `POST /v1/query`

### 请求

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "INSERT INTO my_table (id, name, value) VALUES",
    "stage_attachment": {
      "location": "@my_stage/data.csv",
      "file_format_options": {
        "type": "CSV",
        "skip_header": "1"
      },
      "copy_options": {
        "purge": "true"
      }
    }
  }'
```

### 响应

```json
{
  "id": "92182fc6-11b9-461b-8fbd-f82ecaa637ef",
  "session_id": "f5caf18a-5dc8-422d-80b7-719a6da76039",
  "schema": [],
  "data": [],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {"rows": 100, "bytes": 2560},
    "write_progress": {"rows": 100, "bytes": 2560},
    "running_time_ms": 143.632441
  }
}
```

:::tip
可以使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令中提供的 FILE_FORMAT 和 COPY_OPTIONS。设置 `purge: true` 可在插入成功后删除源文件。
:::

---

## 会话示例

### 使用会话设置

**请求：**

```bash
curl -u "user:password" \
  --request POST \
  'https://<endpoint>/v1/query/' \
  --header 'Content-Type: application/json' \
  --header 'X-DATABEND-WAREHOUSE: <warehouse>' \
  --data-raw '{
    "sql": "SELECT * FROM my_table",
    "session": {
      "database": "production",
      "settings": {
        "max_threads": "4",
        "max_memory_usage": "10737418240"
      }
    }
  }'
```

### SET 语句

**请求：**

```json
{
  "sql": "SET max_threads = 8",
  "session": {
    "database": "default",
    "settings": {"max_threads": "4"}
  }
}
```

**响应：**

```json
{
  "id": "abc123",
  "state": "Succeeded",
  "session": {
    "database": "default",
    "settings": {"max_threads": "8"}
  },
  "affect": {
    "type": "ChangeSetting",
    "key": "max_threads",
    "value": "8",
    "is_global": false
  }
}
```

### USE 语句

**请求：**

```json
{
  "sql": "USE production",
  "session": {
    "database": "default"
  }
}
```

**响应：**

```json
{
  "id": "abc123",
  "state": "Succeeded",
  "session": {
    "database": "production"
  },
  "affect": {
    "type": "UseDB",
    "name": "production"
  }
}
```

---

## HTTP 状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功（检查 `error` 字段以了解查询级别的错误） |
| 400 | 请求格式无效 |
| 404 | 查询或页面不存在 |

---

## 客户端实现

- **官方命令行客户端**：[BendSQL](https://github.com/databendlabs/bendsql) - 基于此 HTTP Handler 构建
- **参考实现**：[sqllogictest client](https://github.com/databendlabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs)
