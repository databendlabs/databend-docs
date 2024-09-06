---
title: ALTER TABLE COMMENT
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.419"/>

修改表的注释。如果表还没有注释，此命令会将指定的注释添加到表中。

## 语法

```sql
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
COMMENT = '<comment>'
```

## 示例

此示例创建一个带有注释的表，然后修改注释：

```sql
-- 创建一个带有注释的表
CREATE TABLE t(id INT) COMMENT ='original-comment';

SHOW CREATE TABLE t;

┌──────────────────────────────────────────────────────────────────────────────────────┐
│  Table │                                 Create Table                                │
├────────┼─────────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'original-comment' │
└──────────────────────────────────────────────────────────────────────────────────────┘

-- 修改注释
ALTER TABLE t COMMENT = 'new-comment';

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────────────────────────────┐
│  Table │                              Create Table                              │
├────────┼────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'new-comment' │
└─────────────────────────────────────────────────────────────────────────────────┘
```

此示例创建一个没有注释的表，然后向表添加注释：

```sql
-- 创建一个没有注释的表
CREATE TABLE t(id INT);

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────┐
│  Table │                  Create Table                  │
├────────┼────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────┘

-- 添加注释
ALTER TABLE t COMMENT = 'new-comment';

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────────────────────────────┐
│  Table │                              Create Table                              │
├────────┼────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'new-comment' │
└─────────────────────────────────────────────────────────────────────────────────┘
```