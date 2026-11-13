---
title: 更新记录
sidebar_label: 更新记录
description: 面向 Agent 的 Databend Cloud API 的变更记录，最新的在最前。
---

本页记录本节接口的变更，最新的变更在最前面。更新调用这些接口的 Agent、skill 或脚本时，请先查看本页。

每条记录以日期为标题，可能包含以下几类：

| 类别 | 含义 |
|---|---|
| 新增 | 新的接口或新的可选字段。现有调用不受影响。 |
| 变更 | 行为、字段或限制有变化。 |
| 弃用 | 接口或字段仍可使用，但之后会移除。记录中会说明替代方案。 |
| 移除 | 接口或字段已不可用。 |

可能导致现有调用失败的变更会标注 **不兼容变更**，并给出迁移步骤。

## 2026-11-12 {/* #2026-11-12 */}

首次发布。API token 可调用 14 个类别共 79 个接口：

| 类别 | 接口数 |
|---|---|
| [Query API](./01-query-api.md) | 5 |
| [查询结果](./02-query-results.md) | 3 |
| [查询历史](./03-query-history.md) | 5 |
| [计算集群](./04-warehouses.md) | 5 |
| [组织与监控](./05-organization-and-metrics.md) | 2 |
| [Catalog](./06-catalog.md) | 7 |
| [SQL Task](./07-sql-tasks.md) | 2 |
| [账户](./08-account.md) | 3 |
| [组织](./09-organization.md) | 2 |
| [账单](./10-billing.md) | 4 |
| [工单](./11-support-tickets.md) | 7 |
| [任务流](./12-task-flows.md) | 9 |
| [数据源](./13-data-sources.md) | 12 |
| [数据集成任务](./14-data-integration-tasks.md) | 13 |

每个接口的方法、路径、类型和权限级别见[接口索引](./index.md#endpoint-index)。

以下约定适用于所有接口，之后如有变更也会记录在本页：

- token 通过 `X-DATABENDCLOUD-TOKEN` 请求头发送。同时携带 `Authorization` 请求头或 cookie 的请求会被拒绝。详见[鉴权](./index.md#authentication)。
- 请求有两种风格：v1 接口的组织 ID 在路径中；v2 接口使用 `POST`，组织 ID 放在 JSON 请求体的 `orgSlug` 字段。详见[请求约定](./index.md#request-conventions)。
- token 的 IP 白名单对所有接口生效。
- 不在本节列表中的接口返回 HTTP 403。

本次发布中，以下控制台功能未对 API token 开放：审计日志搜索、工单附件、任务流的变更操作。详见 [API Token 不能调用的接口](./index.md#endpoints-that-api-tokens-cannot-call)。
