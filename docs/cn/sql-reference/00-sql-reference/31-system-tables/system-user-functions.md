---
title: system.user_functions
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.315"/>

包含系统中用户定义函数和外部函数的信息。

另请参阅：[SHOW USER FUNCTIONS](/sql/sql-commands/administration-cmds/show-user-functions)。

```sql
SELECT * FROM system.user_functions;


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      名称      │    是否为聚合函数          │     描述    │                           参数                            │   语言   │                                                   定义                                                  │
├────────────────┼───────────────────┼─────────────┼───────────────────────────────────────────────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ binary_reverse │ NULL              │             │ {"arg_types":["Binary NULL"],"return_type":"Binary NULL"} │ python   │  (Binary NULL) RETURNS Binary NULL LANGUAGE python HANDLER = binary_reverse ADDRESS = http://0.0.0.0:8815 │
│ echo           │ NULL              │             │ {"arg_types":["String NULL"],"return_type":"String NULL"} │ python   │  (String NULL) RETURNS String NULL LANGUAGE python HANDLER = echo ADDRESS = http://0.0.0.0:8815           │
│ isnotempty     │ NULL              │             │ {"parameters":["p"]}                                      │ SQL      │  (p) -> (NOT is_null(p))                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```