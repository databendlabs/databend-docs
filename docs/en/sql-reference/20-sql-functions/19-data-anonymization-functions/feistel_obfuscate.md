---
title: FEISTEL_OBFUSCATE
---

Transformed numbers for anonymization

## Syntax

```sql
FEISTEL_OBFUSCATE( <number>, <seed> )
```

## Arguments

| Arguments | Description |
| ----------- | ----------- |
| `number` | Input |
| `seed` | The data for corresponding non-text columns for different tables will be transformed in the same way, so the data for different tables can be JOINed after obfuscation |

## Return Type

Same as input

## Examples

```sql
SELECT feistel_obfuscate(10000,1561819567875);
+------------------------------------------+
| feistel_obfuscate(10000, 1561819567875)  |
+------------------------------------------+
| 15669                                    |
+------------------------------------------+
```

feistel_obfuscate preserves the number of bits in the original input. If mapping to a larger range is required, an offset can be added to the original input, e.g. feistel_obfuscate(n+10000,50)
```sql
SELECT feistel_obfuscate(10,1561819567875);
+------------------------------------------+
| feistel_obfuscate(10, 1561819567875)     |
+------------------------------------------+
| 13                                       |
+------------------------------------------+
```