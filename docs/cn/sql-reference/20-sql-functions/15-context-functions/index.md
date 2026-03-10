---
title: Context Functions（上下文函数）
---

本页面提供 Databend 中上下文相关函数的参考信息。这些函数返回有关当前会话、数据库或系统上下文的信息。

## Session Information Functions（会话信息函数）

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [CONNECTION_ID](connection-id.md) | 返回当前连接的连接 ID | `CONNECTION_ID()` → `42` |
| [CURRENT_USER](current-user.md) | 返回当前连接的用户名和主机 | `CURRENT_USER()` → `'root'@'%'` |
| [LAST_QUERY_ID](last-query-id.md) | 返回最后执行查询的查询 ID | `LAST_QUERY_ID()` → `'01890a5d-ac96-7cc6-8128-01d71ab8b93e'` |

## Database Context Functions（数据库上下文函数）

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [CURRENT_CATALOG](current-catalog.md) | 返回当前目录的名称 | `CURRENT_CATALOG()` → `'default'` |
| [DATABASE](database.md) | 返回当前数据库的名称 | `DATABASE()` → `'default'` |

## System Information Functions（系统信息函数）

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [VERSION](version.md) | 返回当前 Databend 版本 | `VERSION()` → `'DatabendQuery v1.2.252-nightly-193ed56304'` |
