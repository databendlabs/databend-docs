---
title: UNSET
---

将一个或多个系统设置恢复到它们的默认值。如果这些设置被设置为GLOBAL级别，也会被重置为初始的SESSION级别。查看[示例](#examples)了解如何使用UNSET重置GLOBAL设置。更多关于设置级别的信息，请参见[设置级别](show-settings.md#setting-levels)。要显示所有当前的设置，请使用[SHOW SETTINGS](show-settings.md)。

另见：[SET](set-global.md)

## 语法

```sql
UNSET <setting_name> | ( <setting_name> [, <setting_name> ...])
```

## 示例

此示例为一些系统设置分配新值，将它们的级别更改为GLOBAL，然后将它们重置为默认值：

```sql
---显示默认值
SELECT name, value, default, level from system.settings where name in ('sql_dialect', 'timezone');

| name                          | value      | default    | level   |
|-------------------------------|------------|------------|---------|
| sql_dialect                   | PostgreSQL | PostgreSQL | SESSION |
| timezone                      | UTC        | UTC        | SESSION |

---设置新值
SET GLOBAL sql_dialect='MySQL';
SET GLOBAL timezone='Asia/Shanghai';

SELECT name, value, default, level from system.settings where name in ('sql_dialect', 'timezone');

| name                          | value         | default    | level  |
|-------------------------------|---------------|------------|--------|
| sql_dialect                   | MySQL         | PostgreSQL | GLOBAL |
| timezone                      | Asia/Shanghai | UTC        | GLOBAL |

---重置为默认值
UNSET (timezone, sql_dialect);

SELECT name, value, default, level from system.settings where name in ('sql_dialect', 'timezone');

| name                          | value      | default    | level   |
|-------------------------------|------------|------------|---------|
| sql_dialect                   | PostgreSQL | PostgreSQL | SESSION |
| timezone                      | UTC        | UTC        | SESSION |
```