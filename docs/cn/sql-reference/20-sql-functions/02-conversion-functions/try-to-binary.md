---
title: TRY_TO_BINARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.673"/>

[TO_BINARY](to-binary.md) 的增强版本，可将输入表达式转换为二进制值，如果转换失败，则返回 `NULL` 而不是引发错误。

另请参见：[TO_BINARY](to-binary.md)

## 语法

```sql
TRY_TO_BINARY( <expr> )
```

## 示例

此示例成功将 JSON 数据转换为二进制：

```sql
SELECT TRY_TO_BINARY(PARSE_JSON('{"key":"value", "number":123}')) AS binary_variant_success;

┌──────────────────────────────────────────────────────────────────────────┐
│                              binary_variant                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 40000002100000031000000610000005200000026B65796E756D62657276616C7565507B │
└──────────────────────────────────────────────────────────────────────────┘
```

此示例表明，当输入为 `NULL` 时，该函数无法转换：

```sql
SELECT TRY_TO_BINARY(PARSE_JSON(NULL)) AS binary_variant_invalid_json;

┌─────────────────────────────┐
│ binary_variant_invalid_json │
├─────────────────────────────┤
│ NULL                        │
└─────────────────────────────┘
```