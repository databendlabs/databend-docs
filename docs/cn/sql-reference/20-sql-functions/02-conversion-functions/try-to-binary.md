---
title: TRY_TO_BINARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.673"/>

[TO_BINARY](to-binary.md) 的增强版本，将输入表达式转换为二进制值，如果转换失败则返回 `NULL` 而不是引发错误。

另请参阅: [TO_BINARY](to-binary.md)

## 语法

```sql
TRY_TO_BINARY( <expr> )
```

## 显式指定格式的 String 输入

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

```sql
TRY_TO_BINARY( <string_expr>, '<format>' )
```

接受 [TO_BINARY](to-binary.md) 的格式：`hex`、`base64` 或字符集标签。返回 Nullable(Binary)。输入或标量格式为 `NULL` 时返回 `NULL`。转换失败时返回 `NULL`，包括无效文本、未知标签、不受支持的 UTF-16 编码，以及目标字符集无法表示的字符。

格式必须是标量常量。即使使用 `TRY_TO_BINARY`，列格式参数仍会报错。**兼容性变化：** 在 v1.2.964-nightly 之前，两参数形式对列格式参数返回 `NULL`。请将该参数替换为常量格式。不要使用 `TRY_TO_BINARY` 来抑制此参数错误。

```sql
SELECT TO_HEX(TRY_TO_BINARY('你好', 'gbk'));
-- c4e3bac3

SELECT TRY_TO_BINARY('😀', 'gbk');
-- NULL
```

## 示例

此示例成功将 JSON 数据转换为二进制:

```sql
SELECT TRY_TO_BINARY(PARSE_JSON('{"key":"value", "number":123}')) AS binary_variant_success;

┌──────────────────────────────────────────────────────────────────────────┐
│                              binary_variant                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 40000002100000031000000610000005200000026B65796E756D62657276616C7565507B │
└──────────────────────────────────────────────────────────────────────────┘
```

此示例演示了当输入为 `NULL` 时，函数无法转换:

```sql
SELECT TRY_TO_BINARY(PARSE_JSON(NULL)) AS binary_variant_invalid_json;

┌─────────────────────────────┐
│ binary_variant_invalid_json │
├─────────────────────────────┤
│ NULL                        │
└─────────────────────────────┘
```