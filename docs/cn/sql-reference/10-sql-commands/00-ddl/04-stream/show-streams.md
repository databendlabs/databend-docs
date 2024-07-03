---
title: 显示流
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.460"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

列出与特定数据库关联的流。

## 语法

```sql
SHOW [ FULL ] STREAMS 
     [ { FROM | IN } <database_name> ]  
     [ LIKE '<pattern>' | WHERE <expr> ]
```

| 参数    | 描述                                                                                   |
|---------|---------------------------------------------------------------------------------------|
| FULL    | 列出结果时包含额外信息。更多细节请参见[示例](#examples)。                             |
| FROM / IN | 指定一个数据库。如果省略，命令将从当前数据库返回结果。                                 |
| LIKE    | 使用大小写敏感的模式匹配和`%`通配符过滤流名称。                                         |
| WHERE   | 使用WHERE子句中的表达式过滤流名称。                                                     |

## 示例

以下示例显示当前数据库中的流：

```sql
SHOW STREAMS;

┌──────────────────────────────────────────────────────────┐
│ Streams_in_default │        table_on       │     mode    │
├────────────────────┼───────────────────────┼─────────────┤
│ order_changes      │ default.orders        │ append_only │
│ s_append_only      │ default.t_append_only │ append_only │
│ s_standard         │ default.t_standard    │ standard    │
└──────────────────────────────────────────────────────────┘
```

以下示例显示当前数据库中流的详细信息：

```sql
SHOW FULL STREAMS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │      name     │ database │ catalog │        table_on       │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────┼──────────┼─────────┼───────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2024-05-12 14:28:33.886271 │ order_changes │ default  │ default │ default.orders        │ NULL             │         │ append_only │                │
│ 2024-05-12 14:35:05.992050 │ s_append_only │ default  │ default │ default.t_append_only │ NULL             │         │ append_only │                │
│ 2024-05-12 14:35:05.981121 │ s_standard    │ default  │ default │ default.t_standard    │ NULL             │         │ standard    │                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```