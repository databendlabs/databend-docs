---
title: 系统历史表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.752"/>

# 系统历史表

系统历史表在 `system_history` 模式 (Schema) 中存储持久化数据，用于审计、故障排查和合规性目的。它们跟踪查询执行、用户登录和系统日志，并支持使用标准 SQL 查询这些信息。

## 可用的系统历史表

| 表                                                  | 描述                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------|
| [system_history.log_history](log-history.md)        | 存储来自不同系统组件的原始日志条目。          |
| [system_history.query_history](query-history.md)    | 存储查询执行的结构化详细信息。                   |
| [system_history.profile_history](profile-history.md)| 存储详细的查询执行配置文件 (profile) 和统计信息。        |
| [system_history.login_history](login-history.md)    | 记录有关用户登录事件的信息。                    |
| [system_history.access_history](access-history.md)  | 存储有关查询访问事件的信息。                   |

## 启用系统历史表

> **注意：** 在 **Databend Cloud** 中，系统历史表是自动启用的，无需任何配置即可使用。以下部分仅适用于**自托管的 Databend**。

在自托管的 Databend 中，系统历史表默认是禁用的。要启用它们，请在 `databend-query.toml` 文件中配置 `[log.history]` 部分。

配置示例：

```toml
[log.history]
# 启用历史表
on = true
level = "INFO"

# 为每个表配置保留策略
[[log.history.tables]]
table_name = "log_history"
retention = 168  # 7 天（以小时为单位）

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

> **注意：** 当历史日志记录开启时，`log_history` 表默认启用。`level` 配置决定了存储在 `log_history` 表中的日志条目数量。日志级别越详细，产生的条目就越多。

有关配置选项的更多详细信息，请参阅[查询配置：[log.history] 部分](/guides/deploy/references/node-config/query-config#loghistory-section)。