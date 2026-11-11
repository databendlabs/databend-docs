---
title: "Query API"
sidebar_label: "Query API"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

这些接口用于执行 SQL，已经支持 API token，使用 `X-DATABENDCLOUD-ORG` 和 `X-DATABENDCLOUD-WAREHOUSE` 请求头。请求和响应的详细说明见 [Query API 参考](https://raw.githubusercontent.com/databendcloud/databend-cloud-skill/main/references/query-api.md)。

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/query` | 执行 SQL。 |
| `GET` | `/v1/query/{queryId}` | 查询执行状态。 |
| `GET` | `/v1/query/{queryId}/page/{pageNum}` | 获取一页结果。 |
| `GET` | `/v1/query/{queryId}/final` | 释放结果。 |
| `POST` | `/v1/query/{queryId}/kill` | 取消查询。 |

一个计算集群可以包含多个 cluster，每个查询只在其中一个 cluster 上执行。Query API 的每个响应都带有 `X-DATABEND-ROUTE-HINT` 响应头，标识该 cluster。同一个查询的后续请求（查询状态、分页、final、kill）都要带上这个请求头，值取最近一次响应中的值。不带时，请求可能被路由到其他 cluster，并返回 `Query ID ... not found`。如果使用了会话，同一会话的下一个 `POST /v1/query` 也要带上它，查询才会在保存会话状态的 cluster 上执行，见[会话接口](#session-endpoints)。

```bash
# Start a query. The first request has no route hint.
curl -s -X POST "https://api.databend.cn/v1/query" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT 1"}'

# Fetch a later page with the route hint of the latest response.
curl -s "https://api.databend.cn/v1/query/<query-id>/page/1" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "X-DATABEND-ROUTE-HINT: <route-hint>"
```

响应中还可能有 `X-DATABEND-SESSION-ID`，它供 Cloud 控制台使用，脚本和 Agent 可以忽略。

## 会话接口 {/* #session-endpoints */}

**普通的 SQL 查询不需要调用这些接口**。执行 SQL 并读取结果，只需调用 `POST /v1/query`，沿 `next_uri` 读到结果结束，再调用 `final`。每个查询都在各自的会话中执行。

只有在多个查询之间维持同一个会话的客户端才需要会话接口，例如 BendSQL 这类 SQL 驱动。会话保存当前数据库、设置和临时表等状态。要维持会话，每个请求都要带 `X-DATABEND-CLIENT-CAPS: session_header`，并把上一个响应中 `X-DATABEND-SESSION` 响应头的值，放进下一个请求的同名请求头。不要依赖 cookie。

| 接口 | 何时调用 | 说明 |
|---|---|---|
| `POST /v1/session/login` | 会话的第一个查询之前，用于校验 database 和 role，并读取服务端版本。 | 请求体是 Databend 的 login 对象，例如 `{"database":"default","role":"analyst"}`。服务端总是把 `disable_session_token` 设为 `true`，所以响应中没有 session token。`X-DATABENDCLOUD-WAREHOUSE` 可以省略。返回的 `version` 是管理服务的版本，可能与计算集群的版本不同；计算集群的版本以查询响应中的 `X-DATABEND-VERSION` 响应头为准。login 不会恢复已暂停的计算集群。 |
| `POST /v1/session/heartbeat` | 客户端读取结果较慢时，或会话中还有临时表时。查询结果在约 60 秒没有请求后会过期。 | 请求体：`{"node_to_queries":{"<node-id>":["<query-id>"]}}`，`node_id` 取自查询响应。发往已暂停计算集群的心跳会让它恢复。 |
| `POST /v1/session/logout` | 客户端关闭时，用于立即删除临时表。不调用的话，临时表会保留到会话超时（默认 4 小时）。 | 无请求体。发往已暂停计算集群的 logout 会让它恢复。 |

请求体超过 1 MiB 时返回 HTTP 413。`/v1/session/refresh` 不可用：它用于续期 Databend session token，而此 API 不签发这种 token。

```bash
# Check the session options before the first query.
curl -s -i -X POST "https://api.databend.cn/v1/session/login" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABEND-CLIENT-CAPS: session_header" \
  -H "Content-Type: application/json" \
  -d '{"database":"<database-name>"}'

# Keep query q1, which runs on node-1, alive.
curl -s -X POST "https://api.databend.cn/v1/session/heartbeat" \
  -H "X-DATABENDCLOUD-TOKEN: <api-token>" \
  -H "X-DATABENDCLOUD-ORG: <organization-id>" \
  -H "X-DATABENDCLOUD-WAREHOUSE: <warehouse-name>" \
  -H "X-DATABEND-CLIENT-CAPS: session_header" \
  -H "X-DATABEND-SESSION: <session-header-value>" \
  -H "Content-Type: application/json" \
  -d '{"node_to_queries":{"node-1":["q1"]}}'
```
