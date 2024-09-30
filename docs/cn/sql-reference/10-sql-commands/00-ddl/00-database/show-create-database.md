---
title: SHOW CREATE DATABASE
sidebar_position: 2
---

显示创建指定数据库的CREATE DATABASE语句。

## 语法

```sql
SHOW CREATE DATABASE database_name
```

## 示例

```sql
SHOW CREATE DATABASE default;
+----------+---------------------------+
| Database | Create Database           |
+----------+---------------------------+
| default  | CREATE DATABASE `default` |
+----------+---------------------------+
```