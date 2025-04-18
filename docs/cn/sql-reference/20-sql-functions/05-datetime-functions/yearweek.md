---
title: YEARWEEK
---

根据 ISO 周日期返回 `YYYYWW` 格式的年份和周数。第 1 周是当年第一个星期四所在的周。

## 语法

```sql
YEARWEEK(<date_or_timestamp>)
```

## 返回类型

UInt32。

## 示例

```sql
SELECT
  YEARWEEK('2024-01-01') AS yw1,
  YEARWEEK('2024-12-31') AS yw2;   
```

```sql
┌─────────────────┐
│   yw1  │   yw2  │
├────────┼────────┤
│ 202401 │ 202501 │
└─────────────────┘
```