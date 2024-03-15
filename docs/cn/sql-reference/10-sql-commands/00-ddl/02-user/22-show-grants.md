---
title: SHOW GRANTS
sidebar_position: 10
---

列出已明确授予用户或角色的所有权限。

另请参见：

- [GRANT](10-grant.md)
- [REVOKE](11-revoke.md)

## 语法

```sql
-- 列出授予用户的权限
SHOW GRANTS FOR <user_name>;

-- 列出授予角色的权限
SHOW GRANTS FOR ROLE <role_name>;
```

## 示例

以下代码返回授予用户 `user1` 的所有权限：

```sql
SHOW GRANTS FOR user1;

---
+-----------------------------------------+
| Grants                                  |
+-----------------------------------------+
| GRANT ALL ON 'default'.* TO 'user1'@'%' |
| GRANT ALL ON *.* TO 'user1'@'%'         |
+-----------------------------------------+
```

以下代码返回授予角色 `role1` 的所有权限：

```sql
SHOW GRANTS FOR ROLE role1;

---
+-------------------------------------+
| Grants                              |
+-------------------------------------+
| GRANT SELECT ON 'mydb'.* TO 'role1' |
+-------------------------------------+
```