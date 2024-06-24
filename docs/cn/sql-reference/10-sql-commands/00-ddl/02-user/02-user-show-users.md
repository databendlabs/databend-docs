---
title: 显示用户
sidebar_position: 3
---

列出系统中的所有用户。

## 语法

```sql
SHOW USERS
```

## 示例

```sql
SHOW USERS;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ is_configured │  default_role │ disabled │
├────────┼──────────┼──────────────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password          │ YES           │ account_admin │ false    │
│ u1     │ %        │ double_sha1_password │ NO            │               │ true     │
│ u2     │ %        │ double_sha1_password │ NO            │               │ false    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
