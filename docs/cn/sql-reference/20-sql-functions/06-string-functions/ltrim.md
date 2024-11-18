---
title: LTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.659"/>

从字符串的开头（左侧）移除特定字符。

另请参阅: 

- [TRIM_LEADING](trim-leading.md)
- [RTRIM](rtrim.md)

## 语法

```sql
LTRIM(<string>, <trim_character>)
```

## 示例

```sql
SELECT LTRIM('xxdatabend', 'xx');

┌───────────────────────────┐
│ ltrim('xxdatabend', 'xx') │
├───────────────────────────┤
│ databend                  │
└───────────────────────────┘
```