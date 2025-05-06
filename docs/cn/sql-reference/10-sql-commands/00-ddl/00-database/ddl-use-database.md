---
title: USE DATABASE
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.721"/>

为当前会话选择一个数据库。此语句允许您指定并切换到不同的数据库。一旦您使用此命令设置了当前数据库，它将保持不变，直到会话结束，除非您选择更改它。

## 语法

```sql
USE <database_name>
```

## 重要提示

在某些情况下，执行 `USE <database>` 可能会很慢 - 例如，当用户仅拥有部分表的权限时，Databend 需要扫描元数据以确定访问权限。

为了提高 `USE <database>` 语句的性能 - 尤其是在具有许多表或复杂权限的数据库中 - 您可以将数据库的 `USAGE` 权限授予角色，然后将该角色分配给用户。

```sql
-- Grant USAGE privilege on the database to a role
GRANT USAGE ON <database_name>.* TO ROLE <role_name>;

-- Assign the role to a user
GRANT ROLE <role_name> TO <user_name>;
```

`USAGE` 权限允许用户进入数据库，但不授予对任何表的可视性或访问权限。用户仍然需要适当的表级别权限，例如 `SELECT` 或 `OWNERSHIP` 才能查看或查询表。

## 示例

```sql
-- Create two databases
CREATE DATABASE database1;
CREATE DATABASE database2;

-- Select and use "database1" as the current database
USE database1;

-- Create a new table "table1" in "database1"
CREATE TABLE table1 (
  id INT,
  name VARCHAR(50)
);

-- Insert data into "table1"
INSERT INTO table1 (id, name) VALUES (1, 'John');
INSERT INTO table1 (id, name) VALUES (2, 'Alice');

-- Query all data from "table1"
SELECT * FROM table1;

-- Switch to "database2" as the current database
USE database2;

-- Create a new table "table2" in "database2"
CREATE TABLE table2 (
  id INT,
  city VARCHAR(50)
);

-- Insert data into "table2"
INSERT INTO table2 (id, city) VALUES (1, 'New York');
INSERT INTO table2 (id, city) VALUES (2, 'London');

-- Query all data from "table2"
SELECT * FROM table2;
```