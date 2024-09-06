---
title: SHOW VIRTUAL COLUMNS
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

显示系统中已创建的虚拟列。等同于 `SELECT * FROM system.virtual_columns`。

另请参阅: [system.virtual_columns](../../../00-sql-reference/20-system-tables/system-virtual-columns.md)

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