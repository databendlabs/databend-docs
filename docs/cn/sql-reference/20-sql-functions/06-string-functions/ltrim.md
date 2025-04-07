---
title: LTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.694"/>

从字符串左侧删除指定删除字符串中存在的任何字符的所有匹配项。

另请参阅：

- [TRIM_LEADING](trim-leading.md)
- [RTRIM](rtrim.md)

## 语法

```sql
LTRIM(<string>, <trim_string>)
```

## 示例

```sql
SELECT LTRIM('xxdatabend', 'xx'), LTRIM('xxdatabend', 'xy');

┌───────────────────────────────────────────────────────┐
│ ltrim('xxdatabend', 'xx') │ ltrim('xxdatabend', 'xy') │
├───────────────────────────┼───────────────────────────┤
│ databend                  │ databend                  │
└───────────────────────────────────────────────────────┘
```