---
title: TRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.659"/>

Removes specific characters or spaces from a string, optionally specifying the position (BOTH, LEADING, or TRAILING).

## Syntax

```sql
-- Trim specific characters and specify the position
TRIM({ BOTH | LEADING | TRAILING } <trim_character> FROM <string>)

-- Trim specific characters from both sides (default BOTH)
TRIM(<string>, <trim_character>)

-- Trim spaces from both sides
TRIM(<string>)
```

## Examples

The following example removes the leading and trailing string 'xxx' from the string 'xxxdatabendxxx':

```sql
SELECT TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx'), TRIM('xxxdatabendxxx', 'xxx');

┌─────────────────────────────────────────────────────────────────────────────────┐
│ TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx') │ TRIM(BOTH 'xxx' FROM 'xxxdatabendxxx') │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ databend                               │ databend                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

The following example removes the leading string 'xxx' from the string 'xxxdatabend':

```sql
SELECT TRIM(LEADING 'xxx' FROM 'xxxdatabend' );

┌────────────────────────────────────────┐
│ TRIM(LEADING 'xxx' FROM 'xxxdatabend') │
├────────────────────────────────────────┤
│ databend                               │
└────────────────────────────────────────┘
```

The following example removes the trailing string 'xxx' from the string 'databendxxx':

```sql
SELECT TRIM(TRAILING 'xxx' FROM 'databendxxx' );

┌─────────────────────────────────────────┐
│ TRIM(TRAILING 'xxx' FROM 'databendxxx') │
├─────────────────────────────────────────┤
│ databend                                │
└─────────────────────────────────────────┘
```

The following examples remove the leading and/or trailing spaces:

```sql
SELECT TRIM('   databend   '), TRIM('   databend'), TRIM('databend   ');

┌────────────────────────────────────────────────────────────────────┐
│ TRIM('   databend   ') │ TRIM('   databend') │ TRIM('databend   ') │
│         String         │        String       │        String       │
├────────────────────────┼─────────────────────┼─────────────────────┤
│ databend               │ databend            │ databend            │
└────────────────────────────────────────────────────────────────────┘
```