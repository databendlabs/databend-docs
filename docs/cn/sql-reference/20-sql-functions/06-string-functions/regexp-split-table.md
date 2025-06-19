---
title: REGEXP_SPLIT_TO_TABLE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.754"/>

使用正则表达式（regular expression）模式拆分字符串，并将每个分段作为表返回。

## 语法

```sql
REGEXP_SPLIT_TO_TABLE(string, pattern [, flags text])
```

| 参数         | 描述                                                         |
|--------------|--------------------------------------------------------------|
| `string`     | 要拆分的输入字符串（可变字符（VARCHAR）类型）                  |
| `pattern`    | 用于拆分的正则表达式模式（可变字符（VARCHAR）类型）            |
| `flags text` | 用于修改正则表达式行为的标志字符串。                         |


**支持的 `flags` 参数：**
提供灵活的正则表达式配置选项，通过组合以下字符来控制匹配行为：
*   `i`（不区分大小写）：模式匹配忽略大小写。
*   `c`（区分大小写）：模式匹配区分大小写（默认行为）。
*   `n` 或 `m`（多行）：启用多行模式。在此模式下，`^` 和 `$` 分别匹配字符串的开头和结尾，以及每行的开头和结尾；点 `.` 不匹配换行符。
*   `s`（单行）：启用单行模式（也称为点匹配换行符）。在此模式下，点 `.` 匹配任何字符，包括换行符。
*   `x`（忽略空白）：忽略模式中的空白字符（提高模式的可读性）。
*   `q`（字面量）：将 `pattern` 视为字面量字符串而不是正则表达式。

## 示例

### 基本行生成
```sql
SELECT REGEXP_SPLIT_TO_TABLE('one,two,three', ',');
┌─────────┐
│ one     │
│ two     │
│ three   │
└─────────┘
```

### 日志解析
```sql
SELECT REGEXP_SPLIT_TO_TABLE('ERR:404:File Not Found', ':');
┌──────────────────┐
│ ERR              │
│ 404              │
│ File Not Found   │
└──────────────────┘
```

### 使用标志文本

```sql
SELECT regexp_split_to_table('One_Two_Three', '[_-]', 'i')

╭────────╮
│ One    │
│ Two    │
│ Three  │
╰────────╯

```

### 嵌套使用

```sql
WITH data AS (
  SELECT 'id=123,name=John' AS kv_pairs
)
SELECT 
  REGEXP_SPLIT_TO_TABLE(kv_pairs, ',') AS pair
FROM data;
┌──────────────┐
│ id=123       │
│ name=John    │
└──────────────┘
```

## 另请参阅

- [SPLIT](split.md)：用于简单的字符串拆分
- [REGEXP_SPLIT_TO_ARRAY](regexp-split-array.md)：将字符串拆分为数组