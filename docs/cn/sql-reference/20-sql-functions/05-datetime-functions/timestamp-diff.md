---
title: TIMESTAMP_DIFF
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.690"/>

计算两个时间戳之间的差值，并将结果作为 INTERVAL 返回。

## 语法

```sql
TIMESTAMP_DIFF(<timestamp1>, <timestamp2>)
```

## 返回类型

INTERVAL（格式为 `hours:minutes:seconds`）。

## 示例

此示例显示 2025 年 2 月 1 日和 2025 年 1 月 1 日之间的时间差为 744 小时，对应于 31 天：

```sql
SELECT TIMESTAMP_DIFF('2025-02-01'::TIMESTAMP, '2025-01-01'::TIMESTAMP);

┌──────────────────────────────────────────────────────────────────┐
│ timestamp_diff('2025-02-01'::TIMESTAMP, '2025-01-01'::TIMESTAMP) │
├──────────────────────────────────────────────────────────────────┤
│ 744:00:00                                                        │
└──────────────────────────────────────────────────────────────────┘
```