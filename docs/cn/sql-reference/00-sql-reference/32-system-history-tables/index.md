---
title: 系统历史表
---

# 系统历史表

系统历史表在 `system_history` schema 中持久化存储数据，用于审计、故障排查和合规目的。这些表跟踪查询执行、用户登录和系统日志信息，可通过标准 SQL 进行查询。

## 可用的系统历史表

| 表                                               | 描述                                                     |
|--------------------------------------------------|---------------------------------------------------------|
| [system_history.log_history](log-history.md)     | 存储来自各系统组件的原始日志条目                        |
| [system_history.query_history](query-history.md)  | 存储查询执行的结构化详情                                |
| [system_history.profile_history](profile-history.md) | 存储详细的查询执行详情和统计信息                      |
| [system_history.login_history](login-history.md)  | 记录用户登录事件                                        |

## 启用系统历史表

> **注意**：在 **Databend Cloud** 中，系统历史表会自动启用且无需配置。以下内容仅适用于**自托管 Databend**。

在自托管 Databend 中，系统历史表默认禁用。需在 `databend-query.toml` 文件中配置 `[log.history]` 部分来启用。

<details>
<summary>配置示例</summary>

```toml
[log.history]
# 开启历史表功能
on = true
level = "INFO"

# 配置各表的保留策略
[[log.history.tables]]
table_name = "log_history"
retention = 168  # 7 天（单位：小时）

[[log.history.tables]]
table_name = "query_history"
retention = 168

[[log.history.tables]]
table_name = "profile_history"
retention = 168

[[log.history.tables]]
table_name = "login_history"
retention = 168
```

> **注意**：开启历史日志功能时，`log_history` 表默认启用。

</details>

完整配置选项详见[查询配置：[log.history] 部分](/guides/deploy/references/node-config/query-config#loghistory-section)。