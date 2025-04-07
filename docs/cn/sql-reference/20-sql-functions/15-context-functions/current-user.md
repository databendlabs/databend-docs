---
title: CURRENT_USER
---

返回服务器用于验证当前客户端的帐户的用户名和主机名组合。此帐户决定了您的访问权限。返回值是 utf8 字符集中的字符串。

## 语法

```sql
CURRENT_USER()
```

## 示例

```sql
SELECT CURRENT_USER();

┌────────────────┐
│ current_user() │
├────────────────┤
│ 'root'@'%'     │
└────────────────┘
```