---
title: DESC STREAM
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.223"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

描述特定流的详细信息。

## 语法

```sql
DESC|DESCRIBE STREAM [ <database_name>. ]<stream_name>
```

## 示例

```sql
DESC STREAM books_stream_2023;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │        name       │ database │ catalog │       table_on      │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────────┼──────────┼─────────┼─────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2023-11-29 02:38:29.588518 │ books_stream_2023 │ default  │ default │ default.books_total │ NULL             │         │ append_only │                │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```