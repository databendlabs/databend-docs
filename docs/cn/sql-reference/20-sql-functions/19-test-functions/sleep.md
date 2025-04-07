---
title: SLEEP
---

使每个数据块休眠 `seconds` 秒。

!!! warning 
    仅用于需要休眠的测试。


## Syntax

```sql
SLEEP(seconds)
```

## Arguments

| Arguments   | Description |
| ----------- | ----------- |
| seconds  | 必须是任何非负数或浮点数的常量列。｜

## Return Type

UInt8

## Examples

```sql
SELECT sleep(2);
+----------+
| sleep(2) |
+----------+
|        0 |
+----------+
```