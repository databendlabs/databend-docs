---
title: 面向 Agent 的 Databend Cloud API
sidebar_label: 面向 Agent 的 Cloud API
description: 使用账户 API token 调用 Databend Cloud 控制台 API，管理数据源和数据集成任务，读取任务流、查询历史、计算集群、Catalog 元数据和账单，并处理工单。
---

本节列出账户 API token 可以调用的 Databend Cloud 控制台 API。您可以用这些 API 构建 Agent 和脚本，管理数据源和数据集成任务，读取任务流、查询历史、计算集群、Catalog 元数据和账单，并处理工单。

本节同时面向开发者和 AI Agent。所有接口采用相同的结构：方法和路径、权限级别、参数和示例。如果某页的接口用到枚举或对象，该页末尾有“类型”一节加以说明。

此 API **仅适用于 Databend Cloud**，不适用于自建部署的 Databend。
## 开始之前 {/* #before-you-start */}

需要准备以下信息：

| 信息 | 获取位置 | 示例 |
|---|---|---|
| API 地址 | 国际站使用 `https://api.databend.com`，中国站使用 `https://api.databend.cn`。 | `https://api.databend.cn` |
| API token | Cloud 控制台 → **账户 API 令牌 → 访问令牌 → 生成新令牌**。 | `dbc_xxxxxxxxxxxx` |
| 组织 ID | Cloud 控制台 → **管理 → 组织信息**，或调用[列出我的组织](./08-account.md#list-my-organizations)。API 中称为 `orgSlug`。 | `acme-prod` |
| 计算集群 | 执行 SQL 的计算集群。只有 Query API 需要。 | `default` |

## 鉴权 {/* #authentication */}

每个请求都在 `X-DATABENDCLOUD-TOKEN` 请求头中携带 token。

| 请求头 | 必填 | 说明 |
|---|---|---|
| `X-DATABENDCLOUD-TOKEN` | 是 | 账户 API token。 |
| `X-DATABENDCLOUD-ORG` | 否 | 组织 ID。如果传入，必须与路径或请求体中的组织一致。对于[账户接口](./08-account.md)，它指定请求所在的组织，默认为账户的默认组织。 |
| `X-DATABENDCLOUD-WAREHOUSE` | 仅 Query API | 计算集群名称。默认：`default`。 |
| `Content-Type` | 带请求体时 | `application/json` |

规则：

- 不要在携带 token 的同时发送 `Authorization` 请求头或 cookie。同时携带两种凭证的请求会被拒绝。
- token 以您的账户身份执行，使用您在该组织中的当前角色。角色变更从下一个请求开始生效。
- 只能访问您的账户是有效成员（active）的组织。
- token 的 IP 白名单对本节所有接口生效。
- 不在本节列表中的接口会返回 HTTP 403。

请求示例：

```bash
curl --request POST 'https://api.databend.cn/api/v2/data-integration/datasources' \
  --header 'X-DATABENDCLOUD-TOKEN: <api-token>' \
  --header 'Content-Type: application/json' \
  --data '{"orgSlug":"<organization-id>","page":1,"perPage":20}'
```

## 请求约定 {/* #request-conventions */}

API 分为两种风格：

| 风格 | 路径前缀 | 组织 ID | 参数 |
|---|---|---|---|
| v1 | `/api/v1/...` | 在路径中，即 `{orgSlug}`。 | 路径、查询字符串或 JSON 请求体。 |
| v2 | `/api/v2/...` | 在 JSON 请求体中，即 `orgSlug`。此字段必填。 | JSON 请求体。所有 v2 接口都使用 `POST`，部分 v2 接口还有路径参数。 |

### v2 JSON 规则 {/* #v2-json-rules */}

- 字段名使用小驼峰（lowerCamelCase）。
- 枚举：请传数字，也接受枚举名。响应中始终返回数字。
- 64 位整数（`int64`、`uint64`）在响应中是 JSON 字符串，例如 `"orgId": "1024"`。请求中传字符串或数字均可。
- 响应会省略零值字段（`0`、`false`、`""` 或空列表）。字段缺失时按零值处理。
- 时间戳是 UTC 的 RFC 3339 字符串，例如 `"2026-11-09T08:00:00Z"`。
- 不要传未定义的字段，否则返回 HTTP 400。
- 已在路径中出现的参数，不要再放进请求体。两者都有时以路径中的值为准。

### v1 JSON 规则 {/* #v1-json-rules */}

- 字段名以各接口文档为准。部分任务运行记录的响应使用 snake_case。
- 时间戳是 RFC 3339 字符串。

### 分页 {/* #pagination */}

| 方式 | 请求字段 | 响应字段 | 使用的接口 |
|---|---|---|---|
| 页码 | `page`（从 1 开始，默认 1）、`perPage`（默认 20） | `total`、`page`、`perPage`、`list` | 大多数 v2 列表接口 |
| 游标 | `size`、`cursors` | `total`、`cursors`、`list` | 查询历史 |
| 分页令牌 | `nextPageToken`、`previousPageToken` | `nextPageToken`、`previousPageToken` | 任务运行记录、任务流运行历史 |

每页条数建议不超过 100。使用分页令牌时，响应中没有 `nextPageToken` 表示没有下一页。分页令牌请以字符串传递。

## 响应与错误 {/* #responses-and-errors */}

成功的响应返回 HTTP 200，且 `"success": true`。大多数接口把结果放在 `data` 中，部分 v2 接口把字段直接放在顶层，例如 `id`、`tables` 或 `objects`。具体结构见各接口的响应示例。

响应中的凭证字段不会出现明文密钥。服务端会把每个密钥值替换为 `******`。SQL 文本不脱敏。详见[凭证脱敏](./13-data-sources.md#credential-masking)。

错误格式：

```json title="v1 错误"
{ "error": "PermissionDenied", "message": "auth: client ip 203.0.113.10 is not in the allowlist of this API token" }
```

```json title="v2 错误"
{ "success": false, "message": "[CLIENT-5001] param err: check request failed: param [orgSlug, datasourceId, name] required" }
```

v2 的 `message` 以 `[<KIND>-<CODE>]` 开头。`CLIENT-5001` 表示参数错误（HTTP 400）。`SERVER-*` 和 `THIRDPARTY-*` 返回 HTTP 500。

| HTTP 状态码 | 含义 | 是否重试 |
|---|---|---|
| 400 | 参数缺失或不合法。 | 否。请修正请求。 |
| 401 | token 无效、已停用或已删除。 | 否。 |
| 403 | 客户端 IP 不在 token 白名单中、账户不是有效成员、角色权限不足，或该接口未对 API token 开放。 | 否。 |
| 404 | 资源不存在。 | 否。 |
| 429 | 超出限流或配额。 | 是，需退避后重试。 |
| 500 | 服务端错误。部分 v2 业务错误也返回 500，例如 `[SERVER-6000] server err: name orders_sync exists` 或 `[SERVER-6000] server err: datasource 12 not found`。 | 先看 `message`，只有临时性原因才重试。 |
| 503、504 | 依赖服务不可用或请求超时。 | 是，需退避后重试。 |

## 权限级别 {/* #access-levels */}

每个接口都有对应的权限级别，服务端在每次请求时校验。

| 级别 | 可调用者 |
|---|---|
| Self | token 所属的账户。接口只返回该账户自己的数据。 |
| Member | 组织的任意有效成员。 |
| Creator | 资源的创建者。 |
| Creator or Admin | 资源的创建者，或组织管理员。 |
| Export | 具有导出权限的成员。 |

Catalog、计算集群和统计类接口还会应用您账户的 SQL 权限。成员只能看到其 SQL 角色有权访问的对象。

## 接口索引 {/* #endpoint-index */}

类型 `Read` 不修改任何资源。类型 `Write` 会创建、修改、启动、停止或删除资源。类型 `Probe` 会从 Databend Cloud 连接外部系统。

| 分类 | 方法 | 路径 | 类型 | 权限 |
|---|---|---|---|---|
| [Query API](./01-query-api.md) | `POST` | `/v1/query` | Write | Member |
| | `GET` | `/v1/query/{queryId}` | Read | Member |
| | `GET` | `/v1/query/{queryId}/page/{pageNum}` | Read | Member |
| | `GET` | `/v1/query/{queryId}/final` | Read | Member |
| | `POST` | `/v1/query/{queryId}/kill` | Write | Member |
| [查询结果](./02-query-results.md) | `GET` | `/api/v1/query/orgs/{orgSlug}/worksheet-query-results/{queryId}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/query/{queryId}/download` | Read | Export |
| | `GET` | `/api/v1/orgs/{orgSlug}/query/{queryId}/download-excel` | Read | Export |
| [查询历史](./03-query-history.md) | `POST` | `/api/v1/query/orgs/{orgSlug}/query-history/query` | Read | Member |
| | `POST` | `/api/v1/query/orgs/{orgSlug}/query-history/count` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/{queryId}/detail` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/{queryId}/profile` | Read | Member |
| | `GET` | `/api/v1/query/orgs/{orgSlug}/query-history/sql-users` | Read | Member |
| [计算集群](./04-warehouses.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouses/{warehouseName}/processes` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/warehouse-history/{warehouseName}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/warehouse-sizes` | Read | Member |
| [组织与监控](./05-organization-and-metrics.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/statistics` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/metrics/{queryType}` | Read | Member |
| [Catalog](./06-catalog.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/fields` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/tables/{table}/config` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/databases/{database}/streams` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/database-objects` | Read | Member |
| [SQL Task](./07-sql-tasks.md) | `GET` | `/api/v1/orgs/{orgSlug}/tenant/tasks/{taskName}` | Read | Member |
| | `POST` | `/api/v1/orgs/{orgSlug}/tenant/tasks-runs/query` | Read | Member |
| [账户](./08-account.md) | `GET` | `/api/v1/account/info` | Read | Self |
| | `GET` | `/api/v1/my/orgs` | Read | Self |
| | `GET` | `/api/v1/my/org-membership-requests` | Read | Self |
| [组织](./09-organization.md) | `GET` | `/api/v1/orgs/{orgSlug}` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/members` | Read | Member |
| [账单](./10-billing.md) | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories` | Read | Member |
| | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}` | Read | Member |
| | `GET` | `/api/v1/billing/orgs/{orgSlug}/billing-histories/{billingHistoryId}/details-v2` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/daily-usages` | Read | Member |
| [工单](./11-support-tickets.md) | `GET` | `/api/v1/tickets/category-options` | Read | Self |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/query` | Read | Creator |
| | `GET` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}` | Read | Creator |
| | `GET` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` | Read | Creator |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets` | Write | Member |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/comments` | Write | Creator |
| | `POST` | `/api/v1/orgs/{orgSlug}/tickets/{ticketId}/{status}` | Write | Creator |

| 分类 | 方法 | 路径 | 类型 | 权限 |
|---|---|---|---|---|
| [任务流](./12-task-flows.md) | `POST` | `/api/v2/taskflow` | Read | Member |
| | `POST` | `/api/v2/taskflow/names` | Read | Member |
| | `POST` | `/api/v2/taskflow/dag` | Read | Member |
| | `POST` | `/api/v2/taskflow/{taskflowId}/info` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions/{taskflowId}` | Read | Member |
| | `POST` | `/api/v2/taskflow/versions/{taskflowId}/{version}` | Read | Member |
| | `POST` | `/api/v2/taskflow/histories` | Read | Member |
| | `POST` | `/api/v2/taskflow/histories/{taskflowId}` | Read | Member |
| [数据源](./13-data-sources.md) | `POST` | `/api/v2/data-integration/datasources` | Read | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/info` | Read | Member |
| | `POST` | `/api/v2/data-integration/datasource/test` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/create` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/update` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/delete` | Write | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/mysql/tables` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/postgres/tables` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/mysql/preview-objects` | Probe | Member |
| | `POST` | `/api/v2/data-integration/datasource/{datasourceId}/tidb/preview-objects` | Probe | Member |
| | `POST` | `/api/v2/data-integration/aws-sqs-s3/setup-info` | Read | Member |
| | `POST` | `/api/v2/data-integration/tidb/setup-info` | Read | Member |
| [数据集成任务](./14-data-integration-tasks.md) | `POST` | `/api/v2/data-integration/tasks` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/info` | Read | Member |
| | `POST` | `/api/v2/data-integration/service/preview` | Probe | Member |
| | `POST` | `/api/v2/data-integration/runtime-units` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/create` | Write | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/update` | Write | Creator or Admin |
| | `POST` | `/api/v2/data-integration/task/operate` | Write | Creator or Admin |
| | `POST` | `/api/v2/data-integration/task/runs` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}/mysql/snapshot/tables` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/runs/{executeId}/tidb/full-sync/tables` | Read | Member |
| | `POST` | `/api/v2/data-integration/task/{taskId}/metrics` | Read | Member |
| | `GET` | `/api/v1/orgs/{orgSlug}/tenant/metrics/{TiDBSync\|MySQLSync}` | Read | Member |

[Query API](./01-query-api.md) 的接口（`/v1/query`）已经可用，按您账户的 SQL 权限执行。`POST /v1/query` 的类型是 `Write`，因为您发送的 SQL 可能修改数据。详见 [Agent Skills](../03-agent-skills.md)。

## API Token 不能调用的接口 {/* #endpoints-that-api-tokens-cannot-call */}

API token 不能调用其他控制台接口，例如：

| 类别 | 示例 | 原因 |
|---|---|---|
| 账户 | 登录、密码、修改个人资料、会话、OAuth 授权、注销账户 | 这些接口修改的是账户，而不是组织数据。 |
| 凭证 | API token 管理、SQL 用户密码重置、连接信息、切换组织、续期 token | 泄露的 token 不能用于创建或读取凭证。 |
| 成员和角色 | 邀请、接受或拒绝邀请、授权、修改角色、移除成员 | 涉及权限变更。 |
| 账单和支付 | 支付方式、支付链接、确认账单、优惠券、消费上限、云市场 | 涉及资金操作。 |
| 审计日志 | 查询审计日志 | 当前版本未开放。 |
| 工单附件 | 上传、下载 | 当前版本未开放。 |
| AI 功能 | Cloud Agent 会话、技能和模型调用 | 涉及成本和配额。 |
| 计算集群变更 | 创建、调整规格、恢复、暂停、重命名、删除 | 请通过 Query API 执行计算集群管理 SQL。 |
| 任务流变更 | 创建、更新、启动、暂停、删除 | 当前版本未开放。 |

## 安全 {/* #security */}

- 本节所有接口都以您的账户和当前角色执行。建议为 Agent 使用专用账户，并只授予最小权限的角色。
- 为 token 设置 IP 白名单，放行 Agent 运行环境的出口 IP。
- 类型为 `Probe` 的接口会从 Databend Cloud 连接您提供的主机。请只使用您自己的主机。
- 响应会按[凭证脱敏](./13-data-sources.md#credential-masking)中的规则对所有凭证脱敏，但仍会显示 host、用户名、access key ID 和 bucket 名称。查询结果、SQL 文本、历史记录和日志可能进入 Agent 模型的上下文，请遵守您的数据策略。
- [列出组织成员](./09-organization.md#list-organization-members)会返回其他人的姓名和邮箱，工单中也有自由文本。请把它们当作个人信息处理。
- 工单写操作会通知支持团队。Agent 创建工单前，请先让用户确认。
- 在 Cloud 控制台中禁用或删除 token，即可立即吊销。
