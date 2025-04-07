---
title: RTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.694"/>

从字符串右侧删除指定删除字符串中出现的任何字符。

另请参阅：

- [TRIM_TRAILING](trim-trailing.md)
- [LTRIM](ltrim.md)

## 语法

```sql
RTRIM(<string>, <trim_string>)
```

## 示例

```sql
SELECT RTRIM('databendxx', 'x'), RTRIM('databendxx', 'xy');

┌──────────────────────────────────────────────────────┐
│ rtrim('databendxx', 'x') │ rtrim('databendxx', 'xy') │
├──────────────────────────┼───────────────────────────┤
│ databend                 │ databend                  │
└──────────────────────────────────────────────────────┘
```