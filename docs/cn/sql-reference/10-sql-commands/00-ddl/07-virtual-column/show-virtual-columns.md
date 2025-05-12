---
title: SHOW VIRTUAL COLUMNS
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

显示系统中创建的 virtual column。等效于 `SELECT * FROM system.virtual_columns`。

另请参阅：[system.virtual_columns](../../../00-sql-reference/31-system-tables/system-virtual-columns.md)

## 语法

```sql
SHOW VIRTUAL COLUMNS [ LIKE '<pattern>' | WHERE <expr> ] | [ LIMIT <limit> ]
```

## 示例

```sql
SET enable_experimental_virtual_column=1;

CREATE TABLE test(id int, val variant);

INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend"}'
  ),
  (
    2,
    '{"id":2,"name":"databricks"}'
  );

SHOW VIRTUAL COLUMNS WHERE table = 'test';
╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │ virtual_column_name │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │        String       │        String       │
├──────────┼────────┼───────────────┼───────────────────┼─────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']              │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']            │ String              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯
```