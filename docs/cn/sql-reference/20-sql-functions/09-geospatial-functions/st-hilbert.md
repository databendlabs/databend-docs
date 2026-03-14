---
title: ST_HILBERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.885"/>

将 GEOMETRY 或 GEOGRAPHY 对象编码为 Hilbert 曲线索引。函数使用几何体包围盒中心作为编码点。如果提供 bounds，会先将该点归一化到指定的包围盒范围再编码。

## 语法

```sql
ST_HILBERT(<geometry_or_geography>)
ST_HILBERT(<geometry_or_geography>, <bounds>)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| `<geometry_or_geography>` | 参数必须是 GEOMETRY 或 GEOGRAPHY 类型的表达式。 |
| `<bounds>` | 可选。数组 `[xmin, ymin, xmax, ymax]`，用于在编码前对点进行归一化。 |

:::note
- Geometry：如果未提供边界，GEOMETRY 坐标不会归一化到特定范围，而是将中心点映射到 float32 的全范围，再编码为 Hilbert 索引。
- Geography：如果未提供边界，默认边界为 `[-180, -90, 180, 90]`。
:::

## 返回类型

UInt64。

## 示例

### GEOMETRY 示例

```sql
SELECT ST_HILBERT(TO_GEOMETRY('POINT(1 2)')) AS hilbert1, ST_HILBERT(TO_GEOMETRY('POINT(5 5)')) AS hilbert2;

╭───────────────────────────╮
│   hilbert1  │   hilbert2  │
├─────────────┼─────────────┤
│  3355443200 │  2155872256 │
╰───────────────────────────╯

SELECT ST_HILBERT(TO_GEOMETRY('POINT(1 2)'), [0, 0, 1, 1]) AS hilbert1, ST_HILBERT(TO_GEOMETRY('POINT(5 5)'), [0, 0, 5, 5]) AS hilbert2;

╭───────────────────────────╮
│   hilbert1  │   hilbert2  │
├─────────────┼─────────────┤
│  2863311530 │  2863311530 │
╰───────────────────────────╯
```

### GEOGRAPHY 示例

```sql
SELECT ST_HILBERT(TO_GEOGRAPHY('POINT(113.15 23.06)')) AS hilbert1, ST_HILBERT(TO_GEOGRAPHY('POINT(116.25 39.54)')) AS hilbert2;

╭───────────────────────────╮
│   hilbert1  │   hilbert2  │
├─────────────┼─────────────┤
│  3070259060 │  3033451300 │
╰───────────────────────────╯

SELECT ST_HILBERT(TO_GEOGRAPHY('POINT(113.15 23.06)'), [73, 4, 135, 53]) AS hilbert1, ST_HILBERT(TO_GEOGRAPHY('POINT(116.25 39.54)'), [73, 4, 135, 53]) AS hilbert2;

╭───────────────────────────╮
│   hilbert1  │   hilbert2  │
├─────────────┼─────────────┤
│  3533607194 │  2330429279 │
╰───────────────────────────╯
```
