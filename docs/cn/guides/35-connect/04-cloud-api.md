---
title: Cloud API
sidebar_label: Cloud API
description: 使用个人 API token 认证、执行 SQL 并管理 Databend Cloud 查询结果。
---

通过个人 API token 执行 SQL 并管理结果。安装 Agent skill 见 [Agent 技能](./03-agent-skills.md)。

## 认证

Base URL：`https://api.databend.cn`。

在 [Databend Cloud](https://app.databend.cn/) 的 **Admin → API Tokens → Access Tokens** 中创建 token。发送 JSON，设置 `Content-Type: application/json` 和以下请求头：

| 请求头 | 值 |
|--------|----|
| `X-DATABENDCLOUD-TOKEN` | 个人 API token，不是 SQL 用户密码。 |
| `X-DATABENDCLOUD-ORG` | **Admin → Organization Profile** 中的 Organization ID。 |
| `X-DATABENDCLOUD-WAREHOUSE` | 账号有权使用的计算集群名称，例如 `default`。 |

## 查询接口

路径均相对 Base URL。同一查询的请求应保持组织和计算集群一致。

| 方法 | 路径 | 操作 |
|------|------|------|
| `POST` | `/v1/query` | 执行 SQL，请求体为 `{"sql":"SELECT 1"}`。 |
| `GET` | `/v1/query/{queryID}` | 获取执行状态。 |
| `GET` | `/v1/query/{queryID}/page/{pageNum}` | 按服务端返回的续传地址获取结果页。 |
| `GET` | `/v1/query/{queryID}/final` | 释放结果，未读取页面可能变得不可用。 |
| `POST` | `/v1/query/{queryID}/kill` | 取消执行，不保证回滚。 |

## 安全

- **权限范围**：Token 使用账号在目标组织中的权限，不局限于创建时选中的组织。请遵循最小权限原则。
- **写入能力**：API 不限于只读。强制只读需要数据库权限控制，Agent 操作确认不能替代服务端授权。
- **密钥保护**：使用 HTTPS 和已确认的 API 主机。不要将 key 放入聊天、仓库或命令参数。Skill 凭证文件的 Unix 权限为 `600`，但仍是明文。
- **数据暴露**：结果、日志和错误可能进入外部 Agent 的模型上下文。限制输出并遵循数据规范。
- **撤销凭证**：在控制台禁用或删除 token。替换本地 key 文件不会撤销旧 token。
- **重试风险**：超时后 SQL 可能仍在运行。重新提交前先检查 query ID，尤其是写入操作。

详细参考：[Query API](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/query-api.md) · [API 认证边界](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/api-capabilities.md) · [SQL 文档索引](https://docs.databend.cn/llms.txt)。
