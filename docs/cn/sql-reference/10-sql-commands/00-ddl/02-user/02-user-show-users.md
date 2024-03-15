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

---
| name                      | hostname | auth_type            | is_configured |
|---------------------------|----------|----------------------|---------------|
| sqluser_johnappleseed     | %        | double_sha1_password | NO            |
| johnappleseed@example.com | %        | jwt                  | NO            |
```