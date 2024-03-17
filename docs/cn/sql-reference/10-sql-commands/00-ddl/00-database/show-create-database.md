---
title: 显示创建数据库
sidebar_position: 2
---

显示创建指定数据库的 CREATE DATABASE 语句。

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