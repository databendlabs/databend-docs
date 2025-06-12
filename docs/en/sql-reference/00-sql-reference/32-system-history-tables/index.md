---
title: System History Tables
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.752"/>

# System History Tables

System history tables store persistent data in the `system_history` schema for auditing, troubleshooting, and compliance purposes. They track query execution, user logins, and system logs that can be queried using standard SQL.

## Available System History Tables

| Table                                               | Description                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------|
| [system_history.log_history](log-history.md)        | Stores raw log entries from various system components.          |
| [system_history.query_history](query-history.md)    | Stores structured details of query execution.                   |
| [system_history.profile_history](profile-history.md)| Stores detailed query execution profiles and statistics.        |
| [system_history.login_history](login-history.md)    | Records information about user login events.                    |

## Enabling System History Tables

> **Note:** In **Databend Cloud**, system history tables are automatically enabled and ready to use without any configuration needed. The following section applies only to **self-hosted Databend**.

In self-hosted Databend, system history tables are disabled by default. To enable them, configure the `[log.history]` section in your `databend-query.toml` file.

Configuration Example:

```toml
[log.history]
# Enable history tables
on = true
level = "INFO"

# Configure retention policies for each table
[[log.history.tables]]
table_name = "log_history"
retention = 168  # 7 days (in hours)

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

> **Note:** The `log_history` table is enabled by default when history logging is turned on.


For more details about configuration options, see [Query Configuration: [log.history] Section](/guides/deploy/references/node-config/query-config#loghistory-section).
