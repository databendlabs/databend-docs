---
title: system.temporary_tables
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

提供当前会话中所有现有临时表的信息。

```sql title='示例：'
SELECT * FROM system.temporary_tables;

┌────────────────────────────────────────────────────┐
│  数据库  │   名称   │        表 ID        │  引擎  │
├──────────┼──────────┼─────────────────────┼────────┤
│ default  │ my_table │ 4611686018427407904 │ FUSE   │
└────────────────────────────────────────────────────┘
```