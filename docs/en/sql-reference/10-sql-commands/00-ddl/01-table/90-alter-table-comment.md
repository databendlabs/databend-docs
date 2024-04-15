---
title: ALTER TABLE COMMENT
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.419"/>

Modifies the comment of a table. If the table does not have a comment yet, this command adds the specified comment to the table.

## Syntax

```sql
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
COMMENT = '<comment>'
```

## Examples

This example creates a table with a comment and then modifies the comment afterward:

```sql
-- Create a table with a comment
CREATE TABLE t(id INT) COMMENT ='original-comment';

SHOW CREATE TABLE t;

┌──────────────────────────────────────────────────────────────────────────────────────┐
│  Table │                                 Create Table                                │
├────────┼─────────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'original-comment' │
└──────────────────────────────────────────────────────────────────────────────────────┘

-- Modify the comment
ALTER TABLE t COMMENT = 'new-comment';

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────────────────────────────┐
│  Table │                              Create Table                              │
├────────┼────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'new-comment' │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This example creates a table without a comment and then adds a comment to the table afterward:

```sql
-- Create a table without comment
CREATE TABLE t(id INT);

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────┐
│  Table │                  Create Table                  │
├────────┼────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────┘

-- Add a comment
ALTER TABLE t COMMENT = 'new-comment';

SHOW CREATE TABLE t;

┌─────────────────────────────────────────────────────────────────────────────────┐
│  Table │                              Create Table                              │
├────────┼────────────────────────────────────────────────────────────────────────┤
│ t      │ CREATE TABLE t (\n  id INT NULL\n) ENGINE=FUSE COMMENT = 'new-comment' │
└─────────────────────────────────────────────────────────────────────────────────┘
```