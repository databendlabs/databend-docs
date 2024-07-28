---
title: MAP_CAT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.459"/>

返回两个MAP的串联结果。

## 语法

```sql
MAP_CAT( <map1>, <map2> )
```

## 参数

| 参数       | 描述                     |
|-----------|-------------------------|
| `<map1>`  | 源MAP。                 |
| `<map2>`  | 要附加到map1的MAP。     |

:::note
- 如果map1和map2都包含具有相同键的值，则输出MAP包含来自map2的值。
- 如果任一参数为NULL，则函数返回NULL而不报告任何错误。
:::

## 返回类型

Map。

## 示例

```sql
SELECT MAP_CAT({'a':1,'b':2,'c':3}, {'c':5,'d':6});
┌─────────────────────────────────────────────┐
│ map_cat({'a':1,'b':2,'c':3}, {'c':5,'d':6}) │
├─────────────────────────────────────────────┤
│ {'a':1,'b':2,'c':5,'d':6}                   │
└─────────────────────────────────────────────┘
```