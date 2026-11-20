---
title: TRY_TO_STRING
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

将 Binary 输入转换为 String。与 [TO_STRING](to-string.md) 不同，转换失败时返回 `NULL`，而不是报错。本页介绍 Binary 重载，不涉及日期格式化。

## 语法

```sql
TRY_TO_STRING( <binary_expr> )
TRY_TO_STRING( <binary_expr>, '<format>' )
```

## 返回值和错误

返回 Nullable(String)。单参数形式解码 UTF-8。仅当 `binary_output_format = 'utf-8-lossy'` 时，才允许替换无效字节。

两参数形式接受 [TO_STRING](to-string.md) 中介绍的字符集标签、`hex` 或 `base64`。无效字节或不支持的标签返回 `NULL`。输入或标量格式为 `NULL` 时也返回 `NULL`。

格式必须是标量常量。列格式参数会报错，`TRY_TO_STRING` 不会抑制此参数错误。

## 示例

```sql
SELECT TRY_TO_STRING(FROM_HEX('C4E3BAC3'), 'gbk');
-- 你好

SELECT TRY_TO_STRING(FROM_HEX('C4'), 'gbk');
-- NULL
```
