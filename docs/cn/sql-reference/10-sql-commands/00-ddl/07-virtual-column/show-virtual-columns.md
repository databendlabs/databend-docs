---
title: SHOW VIRTUAL COLUMNS
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

显示系统中已创建的 virtual column。等效于 `SELECT * FROM system.virtual_columns`。

另请参阅：[system.virtual_columns](../../../00-sql-reference/31-system-tables/system-virtual-columns.md)

## 语法

```sql
SHOW VIRTUAL COLUMNS [ LIKE '<pattern>' | WHERE <expr> ] | [ LIMIT <limit> ]
```

## 示例

```sql
SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘
```