---
title: 系统历史表
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='SYSTEM HISTORY'/>

# 系统历史表

Databend 的系统历史表通过自动跟踪数据库活动，提供**数据治理 (Data Governance)**能力，以满足合规性、安全监控和性能分析的需求。

## 可用表

| 表 | 用途 | 主要用例 |
|-------|---------|---------------|
| [query_history](query-history.md) | 完整的 SQL 执行审计追踪 | 性能分析、合规性跟踪、使用情况监控 |
| [access_history](access-history.md) | 数据访问和修改日志 | 数据血缘 (Data Lineage)、合规性报告、变更管理 |
| [login_history](login-history.md) | 用户身份验证跟踪 | 安全审计、失败登录监控、访问模式分析 |
| [profile_history](profile-history.md) | 详细的查询执行配置文件 | 性能优化、资源规划、瓶颈识别 |
| [log_history](log-history.md) | 原始系统日志和事件 | 系统故障排查、错误分析、操作监控 |

## 配置

### Databend Cloud
✅ **自动启用** - 所有系统历史表无需任何配置即可使用。

### 自托管 Databend

<details>
<summary>📝 **需要手动配置** - 点击展开配置详情</summary>

#### 最小化配置
要启用系统历史表，你必须在 `databend-query.toml` 中配置所有 5 个表：

```toml
[log.history]
on = true

# 必须配置所有 5 个表才能启用历史日志记录
# retention 是可选的（默认为 168 小时 = 7 天）
[[log.history.tables]]
table_name = "query_history"
retention = 168  # 可选：7 天（默认）

[[log.history.tables]]
table_name = "login_history"
retention = 168  # 可选：7 天（默认）

[[log.history.tables]]
table_name = "access_history"
retention = 168  # 可选：7 天（默认）

[[log.history.tables]]
table_name = "profile_history"
retention = 168  # 可选：7 天（默认）

[[log.history.tables]]
table_name = "log_history"
retention = 168  # 可选：7 天（默认）
```

#### 自定义存储（可选）
默认情况下，历史表使用主数据库存储。要使用独立的 S3 存储：

```toml
[log.history]
on = true

[log.history.storage]
type = "s3"

[log.history.storage.s3]
bucket = "your-history-bucket"
root = "history_tables"
endpoint_url = "https://s3.amazonaws.com"
access_key_id = "your-access-key"
secret_access_key = "your-secret-key"
```

> ⚠️ **注意：** 更改存储配置时，现有的历史表将被删除并重新创建。

</details>

有关完整的配置选项，请参阅[查询配置：[log.history] 部分](/guides/deploy/references/node-config/query-config#loghistory-section)。