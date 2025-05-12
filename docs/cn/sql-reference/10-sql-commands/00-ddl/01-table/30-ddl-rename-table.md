---
title: RENAME TABLE
sidebar_position: 3
---

更改表的名称。

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <name> RENAME TO <new_table_name>
```

## 示例

```sql
CREATE TABLE test(a INT);
```

```sql
SHOW TABLES;
+------+
| name |
+------+
| test |
+------+
```

```sql
ALTER TABLE `test` RENAME TO `new_test`;
```

```sql
SHOW TABLES;
+----------+
| name     |
+----------+
| new_test |
+----------+
```