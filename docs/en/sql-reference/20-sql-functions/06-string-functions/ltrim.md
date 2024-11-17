---
title: LTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.659"/>

Removes specific characters from the beginning (left side) of a string.

## Syntax

```sql
LTRIM(<string>, <trim_character>)
```

## Examples

```sql
SELECT LTRIM('xxdatabend', 'xx');

┌───────────────────────────┐
│ ltrim('xxdatabend', 'xx') │
├───────────────────────────┤
│ databend                  │
└───────────────────────────┘
```