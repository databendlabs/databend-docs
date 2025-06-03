---
title: System History Tables
---

# System History Tables

系统历史表在 `system_history`模式中存储持久数据，用于审计、故障排除和合规目的。它们跟踪查询执行、用户登录和系统日志，可使用标准 SQL进行查询。

## Available System History Tables

| Table                                               | Description                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------|
| [system_history.log_history](log-history.md)        | Stores raw log entries from various system components.          |
| [system_history.query_history](query-history.md)    | Stores structured details of query execution.                   |
| [system_history.profile_history](profile-history.md)| Stores detailed query execution profiles and statistics.        |
| [system_history.login_history](login-history.md)    | Records information about user login events.                    |

## Enabling System History Tables

> **注意：**在 **Databend Cloud**中，系统历史表会自动启用并可直接使用，无需任何配置。以下部分仅适用于**私有化部署的 Databend**。

在私有化部署的 Databend中，系统历史表默认禁用。需在 `databend-query.toml`文件中配置 `[log.history]`部分启用。

<details>
<summary>配置示例</summary>

```toml
[log.history]
# Enable history tables
on = true
level = "INFO"

# Configure retention policies for each table
[[log.history.tables]]
table_name = "log_history"
retention = "168" #7天 (以小时为单位)

[[log.history.tables]]
table_name = "query_history"
retention = "168"

[[log.history.tables]]
table_name = "profile_history"
retention = "168"

[[log.history.tables]]
table_name = "login_history"
retention = "168"
```

> **注意：**启用历史日志记录时，`log_history`表默认启用。

</details>

有关配置选项的更多详情，请参阅 [查询配置：[log.history]部分](/guides/deploy/references/node-config/query-config#loghistory-section)。