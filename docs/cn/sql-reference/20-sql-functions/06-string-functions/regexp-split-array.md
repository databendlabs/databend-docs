---
title: REGEXP_SPLIT_TO_ARRAY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.756"/>

使用正则表达式模式拆分字符串，并将分段作为数组返回。

## 语法

```sql
REGEXP_SPLIT_TO_ARRAY(string, pattern [, flags text])
```

| 参数         | 描述                                                         |
|--------------|--------------------------------------------------------------|
| `string`     | 要拆分的输入字符串（VARCHAR 类型）                           |
| `pattern`    | 用于拆分的正则表达式模式（VARCHAR 类型）                     |
| `flags text` | 用于修改正则表达式行为的标志字符串                           |

**支持的 `flags` 参数：**
提供灵活的正则表达式配置选项，通过组合以下字符来控制匹配行为：
*   `i`（不区分大小写）：模式匹配忽略大小写
*   `c`（区分大小写）：模式匹配区分大小写（默认行为）
*   `n` 或 `m`（多行）：启用多行模式。在此模式下，`^` 和 `$` 分别匹配字符串的开头和结尾，以及每行的开头和结尾；点 `.` 不匹配换行符
*   `s`（单行）：启用单行模式（也称为点匹配换行符）。在此模式下，点 `.` 匹配任何字符，包括换行符
*   `x`（忽略空白）：忽略模式中的空白字符（提高模式的可读性）
*   `q`（字面量）：将 `pattern` 视为字面量字符串而不是正则表达式

## 示例

### 基本拆分
```sql
SELECT REGEXP_SPLIT_TO_ARRAY('apple,orange,banana', ',');
┌───────────────────────────────────────────┐
│ ["apple","orange","banana"]               │
└───────────────────────────────────────────┘
```

### 复杂分隔符
```sql
SELECT REGEXP_SPLIT_TO_ARRAY('2023-01-01T14:30:00', '[-T:]');
┌───────────────────────────────────────────────────────┐
│ ["2023","01","01","14","30","00"]                     │
└───────────────────────────────────────────────────────┘
```

### 处理空元素
```sql
SELECT REGEXP_SPLIT_TO_ARRAY('a,,b,,,c', ',+');
┌───────────────────────────────────┐
│ ["a","b","c"]                     │
└───────────────────────────────────┘
```

### 使用标志文本

```sql
SELECT regexp_split_to_array('One_Two_Three', '[_-]', 'i')

╭─────────────────────────────────────────────────────╮
│ ['One','Two','Three']                               │
╰─────────────────────────────────────────────────────╯

```


## 另请参阅

- [SPLIT](split.md)：用于简单的字符串拆分
- [REGEXP_SPLIT_TO_TABLE](regexp-split-table.md)：将字符串拆分为表