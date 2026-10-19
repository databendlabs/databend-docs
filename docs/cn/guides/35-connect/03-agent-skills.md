---
title: Agent 技能
sidebar_label: Agent 技能
description: 了解 Databend Cloud skill 的能力，将一段指令粘贴给 Agent 即可安装。
---

`databend-cloud` skill 为 Agent 提供使用 Databend Cloud 的操作指引和工具。

## 能做什么

- **连接 Cloud**：引导私下配置 API token，访问您指定的组织和计算集群。
- **使用 SQL**：核对 Databend 语法，查看数据库和表，查询数据。
- **诊断查询**：查看执行状态、结果、历史和 profile，分析慢 SQL 或失败查询。
- **管理计算集群**：具备所需管理员角色并获得您授权后，列出、创建、扩缩容、恢复、暂停、重命名或删除计算集群。
- **排查事故**：分析告警、OOM、节点退出、任务失败和版本回归。
- **导出证据**：按范围导出原始 JSON Lines 日志或可读事件。

实际可用的操作取决于账号权限，以及历史记录、profile 和日志的访问权限。

## 让 Agent 安装

[evot.ai](https://evot.ai) 由 Databend 团队开发。此 skill 由 Databend 官方提供，并非第三方 skill。

将下面这段话复制给 Agent：

```text
请安装 databend-cloud skill，来源：
https://github.com/evotai/evot-skills/tree/main/skills/databend-cloud

按你支持的 skill 安装方式，只安装这个 skill，并确认能够发现和加载其 SKILL.md。
本次只安装，不配置凭证，不连接 Cloud，不执行 SQL。
```

## 安全提醒

- 不要将 token 放入聊天或仓库。本地凭证文件是明文，辅助脚本会将 Unix 权限设为 `600`。
- 使用最小权限账号，token 沿用账号的组织权限。Skill 不是只读沙箱，强制只读需要数据库权限控制。
- 结果和日志可能进入 Agent 的模型上下文，请遵循数据规范。
- 在 Cloud 控制台撤销 token，替换本地 key 文件不会撤销旧 token。

详细参考：[认证说明](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/authentication.md) · [Query API](https://raw.githubusercontent.com/evotai/evot-skills/main/skills/databend-cloud/references/query-api.md)。
