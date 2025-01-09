---
title: USE DATABASE
sidebar_position: 3
---

选择当前会话的数据库。该语句允许您指定并切换到不同的数据库。一旦使用此命令设置了当前数据库，它将保持不变，直到会话结束，除非您选择更改它。

## 语法

```sql
USE <database_name>
```

## 示例

```sql
-- 创建两个数据库
CREATE DATABASE database1;
CREATE DATABASE database2;

-- 选择并使用 "database1" 作为当前数据库
USE database1;

-- 在 "database1" 中创建一个新表 "table1"
CREATE TABLE table1 (
  id INT,
  name VARCHAR(50)
);

-- 向 "table1" 插入数据
INSERT INTO table1 (id, name) VALUES (1, 'John');
INSERT INTO table1 (id, name) VALUES (2, 'Alice');

-- 查询 "table1" 中的所有数据
SELECT * FROM table1;

-- 切换到 "database2" 作为当前数据库
USE database2;

-- 在 "database2" 中创建一个新表 "table2"
CREATE TABLE table2 (
  id INT,
  city VARCHAR(50)
);

-- 向 "table2" 插入数据
INSERT INTO table2 (id, city) VALUES (1, 'New York');
INSERT INTO table2 (id, city) VALUES (2, 'London');

-- 查询 "table2" 中的所有数据
SELECT * FROM table2;
```