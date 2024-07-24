---
title: 显示用户
sidebar_position: 3
---

列出系统中的所有 SQL 用户。如果您使用的是 Databend Cloud，此命令还会显示您组织中用于登录 Databend Cloud 的用户账户（电子邮件地址）。

## 语法

```sql
SHOW USERS
```

## 示例

```sql
CREATE USER eric IDENTIFIED BY 'abc123';

SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │     roles     │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼───────────────┼──────────┤
│ eric   │ %        │ double_sha1_password │ NO            │               │               │ false    │
│ root   │ %        │ no_password          │ YES           │ account_admin │ account_admin │ false    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```