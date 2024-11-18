---
title: RTRIM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.659"/>

从字符串的末尾（右侧）移除特定字符。

另请参阅: 

- [TRIM_TRAILING](trim-trailing.md)
- [LTRIM](ltrim.md)

## 语法

```sql
RTRIM(<string>, <trim_character>)
```

## 示例

```sql
SELECT RTRIM('databendxx', 'xx');

┌───────────────────────────┐
│ rtrim('databendxx', 'xx') │
├───────────────────────────┤
│ databend                  │
└───────────────────────────┘
```