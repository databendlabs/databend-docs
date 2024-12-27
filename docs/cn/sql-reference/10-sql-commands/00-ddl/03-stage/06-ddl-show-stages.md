---
title: SHOW STAGES
sidebar_position: 6
---

返回已创建的 stages 列表。输出列表不包括用户 stage。

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