---
title: ST_AREA
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.555"/>

返回 GEOMETRY 或 GEOGRAPHY 对象的面积。对于 GEOMETRY 类型，使用基于[鞋带公式](https://en.wikipedia.org/wiki/Shoelace_formula)的平面面积计算；对于 GEOGRAPHY 类型，则采用 [Karney (2013)](https://arxiv.org/pdf/1109.4448.pdf) 描述的方法，在地球椭球模型上计算测地面积。

## 语法

```sql
ST_AREA(<geometry_or_geography>)
```

## 参数

| 参数                      | 说明                                          |
|---------------------------|-----------------------------------------------|
| `<geometry_or_geography>` | 类型为 GEOMETRY 或 GEOGRAPHY 的表达式。 |

## 返回类型

Double。

## 示例

### GEOMETRY 示例

```sql
SELECT
  ST_AREA(
    TO_GEOMETRY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))')
  ) AS area

┌──────┐
│ area │
├──────┤
│ 1.0  │
└──────┘
```

### GEOGRAPHY 示例

```sql
SELECT
  ST_AREA(
    TO_GEOGRAPHY('POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))')
  ) AS area

╭────────────────────╮
│        area        │
├────────────────────┤
│ 12308778361.469452 │
╰────────────────────╯
```
