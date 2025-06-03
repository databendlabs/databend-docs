---
title: System History Tables
---

# System History Tables

System history tables are similar to system tables, but they store data persistently.

These tables are organized in the `system_history` schema and can be queried using standard SQL. They provide a robust foundation for operational insights, compliance reporting, and troubleshooting by enabling you to analyze historical events and trends within your Databend environment.

## Available System Tables

| Table | Description |
|-------|-------------|
| [system_history.log_history](log-history.md) | Stores raw log entries from various system components. |
| [system_history.query_history](query-history.md) | Stores structured details of query execution. |
| [system_history.profile_history](profile-history.md)| Stores detailed query execution profiles and statistics. |
| [system_history.login_history](login-history.md)| Records information about user login events. |
