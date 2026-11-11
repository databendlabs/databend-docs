---
title: "查询结果"
sidebar_label: "查询结果"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

## 下载查询结果（CSV） {/* #download-a-query-result-as-csv */}

`GET /api/v1/orgs/{orgSlug}/query/{queryId}/download` · Read · Export

将查询的缓存结果下载为 CSV 文件。该查询必须通过 Query API 执行，且已经完成。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `queryId` | 路径 | string | 是 | Query API 响应中的查询 ID。 |
| `dryRun` | 查询 | string | 否 | 设为 `1` 时只检查导出权限，不返回文件。 |

限制：

- 文件包含一行表头，数据不超过 10,000 行。
- 查询失败或结果不完整时，返回 HTTP 400。

示例：

```bash
curl --location 'https://api.databend.cn/api/v1/orgs/<organization-id>/query/<query-id>/download' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --output result.csv
```

响应：文件内容，带 `Content-Disposition: attachment; filename="<query-id>.csv"`。设置 `dryRun=1` 时，响应为：

```json
{ "success": true }
```

## 下载查询结果（Excel） {/* #download-a-query-result-as-excel */}

`GET /api/v1/orgs/{orgSlug}/query/{queryId}/download-excel` · Read · Export

与[下载查询结果（CSV）](#download-a-query-result-as-csv)相同。文件格式为 `.xlsx`，Content-Type 为 `application/vnd.ms-excel`。

## 获取缓存的查询结果 {/* #get-a-cached-query-result */}

`GET /api/v1/query/orgs/{orgSlug}/worksheet-query-results/{queryId}` · Read · Member

以 JSON 返回查询的缓存结果。服务端会拼接缓存的各页结果，超过约 10,000 行后停止。

| 参数 | 位置 | 类型 | 必填 | 说明 |
|---|---|---|---|---|
| `orgSlug` | 路径 | string | 是 | 组织 ID。 |
| `queryId` | 路径 | string | 是 | 查询 ID。 |

响应示例。值均为字符串，SQL `NULL` 返回 `null`。

```json
{
  "success": true,
  "data": {
    "schema": [
      { "name": "id", "type": "Int32" },
      { "name": "name", "type": "Nullable(String)" }
    ],
    "data": [["1", "alice"], ["2", null]]
  }
}
```
