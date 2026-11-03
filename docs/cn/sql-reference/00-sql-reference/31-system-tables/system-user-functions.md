---
title: system.user_functions
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

包含系统中用户定义函数和外部函数的信息。

从 v1.2.957 开始，远程 UDF 元数据中的服务端请求头值会显示为 `***`。显示的地址中，URL 用户名、密码、查询参数值和片段也会被脱敏。这只影响显示的定义，不会修改已存储的连接凭证或函数执行行为。共用的元数据格式化逻辑会对 `/v1/user_functions` 输出应用相同的脱敏规则。

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