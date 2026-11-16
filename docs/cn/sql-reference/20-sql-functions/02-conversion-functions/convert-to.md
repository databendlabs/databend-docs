---
title: CONVERT_TO / TRY_CONVERT_TO
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.964-nightly"/>

将 String 编码为指定字符集的 Binary 字节。使用 [CONVERT_FROM](convert-from.md) 可将这些字节解码回 String。

## 语法

```sql
CONVERT_TO( <string_expr>, '<charset>' )
TRY_CONVERT_TO( <string_expr>, '<charset>' )
```

## 参数

- `string_expr`：要编码的 String。
- `charset`：包含不区分大小写的 WHATWG 编码标签的标量常量 String。常用标签包括 `utf-8`、`gbk`、`gb2312`（GBK 的别名）、`gb18030`、`big5`、`shift_jis`、`euc-kr` 和 `windows-1252`。参见[字符集标签](convert-from.md#参数)。

`CONVERT_TO` 仅接受字符集。如需将十六进制或 Base64 文本解码为字节，请使用 [TO_BINARY](to-binary.md)，并指定 `hex` 或 `base64`。

## 返回值和错误

`CONVERT_TO` 返回 Binary。输入或标量字符集为 `NULL` 时返回 `NULL`。标签不受支持或目标字符集无法表示某个字符时会报错。编码不会用问号或数字字符引用替换无法表示的字符。

支持 UTF-16 解码，但不支持 UTF-16 编码。如果标签会回退到其他输出编码，函数会拒绝该标签。例如，`utf-16le` 和 `utf-16be` 会报错，而不是输出 UTF-8 字节。

`TRY_CONVERT_TO` 返回 Nullable(Binary)。转换失败时返回 `NULL`，包括不支持的标签或输出编码。两个函数都拒绝列字符集参数并报错，即使该列包含有效标签。

结果存储字节，不是十六进制文本。其显示文本取决于 `binary_output_format`。使用 [TO_HEX](to-hex.md) 查看字节。

## 示例

将 String 编码为 GBK 字节并重新解码：

```sql
SELECT TO_HEX(CONVERT_TO('你好', 'gbk'));
-- c4e3bac3

SELECT CONVERT_FROM(CONVERT_TO('你好', 'gbk'), 'gbk');
-- 你好
```

GBK 无法表示此表情符号，但 GB18030 可以：

```sql
SELECT TRY_CONVERT_TO('😀', 'gbk');
-- NULL

SELECT TO_HEX(CONVERT_TO('😀', 'gb18030'));
-- 9439fc36
```
