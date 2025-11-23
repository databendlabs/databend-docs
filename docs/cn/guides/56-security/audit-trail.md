---
title: 审计追踪
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AUDIT TRAIL'/>

Databend 的系统历史表 (System History Tables) 会自动捕获数据库活动的详细记录，为合规性 (Compliance) 和安全监控 (Security Monitoring) 提供完整的审计追踪 (Audit Trail)。

支持对用户以下活动进行审计：
- **查询执行** - 完整的 SQL 执行审计追踪 (`query_history`)
- **数据访问** - 数据库对象访问和修改 (`access_history`)
- **身份验证** - 登录尝试和会话跟踪 (`login_history`)

## 可用的审计表

Databend 提供了五个系统历史表，用于捕获数据库活动的不同方面：

| 表 | 用途 | 关键用例 |
|-------|---------|---------------|
| [query_history](/sql/sql-reference/system-history-tables/query-history) | 完整的 SQL 执行审计追踪 | 性能监控、安全审计、合规报告 |
| [access_history](/sql/sql-reference/system-history-tables/access-history) | 数据库对象访问和修改 | 数据血缘 (Data Lineage) 追踪、合规审计、变更管理 (Change Management) |
| [login_history](/sql/sql-reference/system-history-tables/login-history) | 身份验证尝试和会话 | 安全监控、失败登录检测、访问模式分析 |

## 审计用例与示例

### 安全监控

**监控失败的登录尝试**

跟踪身份验证失败，以识别潜在的安全威胁和未经授权的访问尝试。

```sql
-- 检查失败的登录尝试（安全审计）
SELECT event_time, user_name, client_ip, error_message 
FROM system_history.login_history 
WHERE event_type = 'LoginFailed'
ORDER BY event_time DESC;
```

示例输出：
```
event_time: 2025-06-03 06:07:32.512021
user_name: root1
client_ip: 127.0.0.1:62050
error_message: UnknownUser. Code: 2201, Text = User 'root1'@'%' does not exist.
```

### 合规报告

**跟踪数据库模式 (Schema) 变更**

监控 DDL 操作，以满足合规性和变更管理要求。

```sql
-- 审计 DDL 操作（合规追踪）
SELECT query_id, query_start, user_name, object_modified_by_ddl
FROM system_history.access_history 
WHERE object_modified_by_ddl != '[]'
ORDER BY query_start DESC;
```

`CREATE TABLE` 操作示例：
```
query_id: c2c1c7be-cee4-4868-a28e-8862b122c365
query_start: 2025-06-12 03:31:19.042128
user_name: root
object_modified_by_ddl: [{"object_domain":"Table","object_name":"default.default.t","operation_type":"Create"}]
```

**审计数据访问模式**

跟踪谁在何时访问了哪些数据，以满足合规性和数据治理要求。

```sql
-- 追踪数据访问以符合合规要求
SELECT query_id, query_start, user_name, base_objects_accessed
FROM system_history.access_history 
WHERE base_objects_accessed != '[]'
ORDER BY query_start DESC;
```

### 运营监控

**完整的查询执行审计**

维护所有 SQL 操作的全面记录，包括用户信息和计时信息。

```sql
-- 包含用户和计时信息的完整查询审计
SELECT query_id, sql_user, query_text, query_start_time, query_duration_ms, client_address
FROM system_history.query_history 
WHERE event_date >= TODAY() - INTERVAL 7 DAY
ORDER BY query_start_time DESC;
```

示例输出：
```
query_id: 4e1f50a9-bce2-45cc-86e4-c7a36b9b8d43
sql_user: root
query_text: SELECT * FROM t
query_start_time: 2025-06-12 03:31:35.041725
query_duration_ms: 94
client_address: 127.0.0.1
```

有关每个审计表及其特定字段的详细信息，请参阅[系统历史表](/sql/sql-reference/system-history-tables/)参考文档。