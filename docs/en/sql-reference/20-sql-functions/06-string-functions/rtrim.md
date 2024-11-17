---
title: RTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.659"/>

Removes specific characters from the end (right side) of a string.

## Syntax

```sql
RTRIM(<string>, <trim_character>)
```

## Examples

```sql
SELECT RTRIM('databendxx', 'xx');

┌───────────────────────────┐
│ rtrim('databendxx', 'xx') │
├───────────────────────────┤
│ databend                  │
└───────────────────────────┘
```