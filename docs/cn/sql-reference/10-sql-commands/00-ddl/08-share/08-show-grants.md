---
title: SHOW GRANTS
sidebar_position: 8
---

列出授予指定共享对象的权限，或列出添加到指定共享的租户。

## 语法

```sql
-- 列出授予指定共享对象的权限
SHOW GRANTS ON { DATABASE <db_name> | TABLE <db_name>.<table_name> }

-- 列出添加到指定共享的租户
SHOW GRANTS OF SHARE <share_name>
```

## 示例

以下示例显示了授予数据库`default`的权限：

```sql
SHOW GRANTS ON DATABASE default;

---
| Granted_on                        | Privilege | Share_name |
|-----------------------------------|-----------|------------|
| 2022-09-06 18:15:18.204575814 UTC | Usage     | myshare    |
```

以下示例显示了添加到共享`myshare`的租户：

```sql
SHOW GRANTS OF SHARE myshare;

---
| Granted_on                        | Account |
|-----------------------------------|---------|
| 2022-09-06 17:52:57.786357418 UTC | x       |
| 2022-09-06 17:52:57.786357418 UTC | y       |
```