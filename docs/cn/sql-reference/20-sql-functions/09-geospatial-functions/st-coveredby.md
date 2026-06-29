---
title: ST_COVEREDBY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.911"/>

如果第一个 GEOMETRY 对象中没有任何点位于第二个 GEOMETRY 对象之外，则返回 TRUE。

另请参阅：[ST_COVERS](st-covers.md)

## 语法

```sql
ST_COVEREDBY(<geometry1>, <geometry2>)
```

## 参数

| 参数          | 描述                              |
|---------------|-----------------------------------|
| `<geometry1>` | GEOMETRY 表达式（被测试对象）。   |
| `<geometry2>` | GEOMETRY 表达式（覆盖对象）。     |

## 返回类型

Boolean。

## 示例

```sql
SELECT ST_COVEREDBY(
  TO_GEOMETRY('POINT(1 1)'),
  TO_GEOMETRY('POLYGON((0 0, 3 0, 3 3, 0 3, 0 0))')
);

┌────────┐
│ result │
├────────┤
│ true   │
└────────┘

SELECT ST_COVEREDBY(
  TO_GEOMETRY('POLYGON((1 1, 2 1, 2 2, 1 2, 1 1))'),
  TO_GEOMETRY('POLYGON((0 0, 3 0, 3 3, 0 3, 0 0))')
);

┌────────┐
│ result │
├────────┤
│ true   │
└────────┘

SELECT ST_COVEREDBY(
  TO_GEOMETRY('POINT(5 5)'),
  TO_GEOMETRY('POLYGON((0 0, 3 0, 3 3, 0 3, 0 0))')
);

┌────────┐
│ result │
├────────┤
│ false  │
└────────┘
```
