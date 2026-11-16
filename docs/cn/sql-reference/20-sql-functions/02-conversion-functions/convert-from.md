---
title: CONVERT_FROM / TRY_CONVERT_FROM
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

将指定字符集的 Binary 字节解码为 String。适用于以 GBK 或其他非 UTF-8 字节存储的文本。如需将 String 编码为字节，请使用 [CONVERT_TO](convert-to.md)。

## 语法

```sql
CONVERT_FROM( <binary_expr>, '<charset>' )
TRY_CONVERT_FROM( <binary_expr>, '<charset>' )
```

## 参数

- `binary_expr`：要解码的 Binary 值。
- `charset`：包含 WHATWG 编码标签的标量常量 String。标签不区分大小写。常用标签包括 `utf-8`、`gbk`、`gb2312`（GBK 的别名）、`gb18030`、`big5`、`shift_jis`、`euc-kr`、`windows-1252`、`utf-16le` 和 `utf-16be`。

字符集标签遵循 [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/#names-and-labels)，不是任意数据库排序规则名称。`CONVERT_FROM` 仅接受字符集，不接受 `hex` 或 `base64`。如需将字节转换为十六进制或 Base64 文本，请使用 [TO_STRING](to-string.md)。

## 返回值和错误

`CONVERT_FROM` 返回 String。输入或标量字符集为 `NULL` 时返回 `NULL`。字节序列无效或标签不受支持时会报错。解码不会用替换字符代替无效字节。显式标签决定解码方式，字节顺序标记不会选择其他字符集。

`TRY_CONVERT_FROM` 返回 Nullable(String)。转换失败时返回 `NULL`，包括无效字节和不支持的标签。两个函数都拒绝列字符集参数并报错，即使该列包含有效标签。

## 示例

解码直接存储或经过 Base64 包装的 GBK 字节：

```sql
SELECT CONVERT_FROM(FROM_HEX('C4E3BAC3'), 'gbk');
-- 你好

SELECT CONVERT_FROM(FROM_BASE64('xOO6ww=='), 'GBK');
-- 你好
```

使用 GB18030 解码四字节字符，或解码 UTF-16LE：

```sql
SELECT CONVERT_FROM(FROM_HEX('9439FC36'), 'gb18030');
-- 😀

SELECT CONVERT_FROM(FROM_HEX('604F7D59'), 'utf-16le');
-- 你好
```

对不完整的 GBK 字节序列返回 `NULL`：

```sql
SELECT TRY_CONVERT_FROM(FROM_HEX('C4'), 'gbk');
-- NULL
```
