---
title: 显示流
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.223"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

显示所有可用流的列表。

## 语法

```sql
SHOW [ FULL ] STREAMS [ FROM <database_name> ] 
    [ LIKE '<pattern>' | WHERE <expr> ]
```

## 示例

```sql
SHOW STREAMS;

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │        name       │ database │ catalog │       table_on      │
│          Timestamp         │       String      │  String  │  String │        String       │
├────────────────────────────┼───────────────────┼──────────┼─────────┼─────────────────────┤
│ 2023-11-29 02:38:29.588518 │ books_stream_2023 │ default  │ default │ default.books_total │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```