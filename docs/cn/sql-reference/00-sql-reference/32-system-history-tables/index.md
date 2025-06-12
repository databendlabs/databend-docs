---
title: 系统历史表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.752"/>

# 系统历史表

系统历史表 (System History Tables) 在 `system_history` 模式中存储持久化数据，用于审计、故障排查和合规性目的。它们跟踪查询执行、用户登录和系统日志，可使用标准 SQL 进行查询。

## 可用的系统历史表

| 表                                               | 描述                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------|
| [system_history.log_history](log-history.md)        | 存储来自不同系统组件的原始日志条目          |
| [system_history.query_history](query-history.md)    | 存储查询执行的结构化详细信息                   |
| [system_history.profile_history](profile-history.md)| 存储详细的查询执行剖析数据和统计信息        |
| [system_history.login_history](login-history.md)    | 记录用户登录事件的相关信息                    |

## 启用系统历史表

> **注意：** 在 **Databend Cloud** 中，系统历史表自动启用且无需配置即可使用。以下部分仅适用于**自托管 Databend**。

在自托管 Databend 中，系统历史表默认禁用。需在 `databend-query.toml` 文件中配置 `[log.history]` 部分以启用。

配置示例：

```toml
[log.history]
# 启用历史表
on = true
level = "INFO"

# 为各表配置保留策略
[[log.history.tables]]
table_name = "log_history"
retention = 168  # 7 天（以小时计）

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

> **注意：** 启用历史日志记录时，`log_history` 表默认激活。

有关配置选项的完整说明，请参阅[查询配置：[log.history] 部分](/guides/deploy/references/node-config/query-config#loghistory-section)。