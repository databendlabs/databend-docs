---
title: SHOW STAGES
sidebar_position: 6
---

返回已创建的Stage列表。输出列表不包括用户Stage。

## 语法

```sql
SHOW STAGES;
```

## 示例

```sql
SHOW STAGES;

---
name|stage_type|number_of_files|creator   |comment|
----+----------+---------------+----------+-------+
eric|Internal  |              0|'root'@'%'|       |
```