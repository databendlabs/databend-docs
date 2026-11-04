---
title: system.user_functions
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Contains information about user-defined functions and external functions in the system.

Remote UDF metadata hides server header values as `***`. It also masks URL usernames, passwords, query-parameter values, and fragments in the displayed address. This affects the displayed definition, not the stored connection credentials or function execution. The shared metadata formatter applies the same masking to `/v1/user_functions` output.

See also: [SHOW USER FUNCTIONS](/sql/sql-commands/administration-cmds/show-user-functions).

```sql
SELECT * FROM system.user_functions;


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name      │    is_aggregate   │ description │                         arguments                         │ language │                                                 definition                                                │
├────────────────┼───────────────────┼─────────────┼───────────────────────────────────────────────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ binary_reverse │ NULL              │             │ {"arg_types":["Binary NULL"],"return_type":"Binary NULL"} │ python   │  (Binary NULL) RETURNS Binary NULL LANGUAGE python HANDLER = binary_reverse ADDRESS = http://0.0.0.0:8815 │
│ echo           │ NULL              │             │ {"arg_types":["String NULL"],"return_type":"String NULL"} │ python   │  (String NULL) RETURNS String NULL LANGUAGE python HANDLER = echo ADDRESS = http://0.0.0.0:8815           │
│ isnotempty     │ NULL              │             │ {"parameters":["p"]}                                      │ SQL      │  (p) -> (NOT is_null(p))                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```