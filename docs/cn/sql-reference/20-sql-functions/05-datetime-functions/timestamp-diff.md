---
title: TIMESTAMP_DIFF
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.690"/>

计算两个时间戳之间的差异，并以 INTERVAL 形式返回结果。

## 语法

```sql
TIMESTAMP_DIFF(<timestamp1>, <timestamp2>)
```

## 返回类型

INTERVAL（格式为 `小时:分钟:秒`）。

## 示例

此示例展示了 2025 年 2 月 1 日与 2025 年 1 月 1 日之间的时间差为 744 小时，对应 31 天：

```sql
SELECT TIMESTAMP_DIFF('2025-02-01'::TIMESTAMP, '2025-01-01'::TIMESTAMP);

┌──────────────────────────────────────────────────────────────────┐
│ timestamp_diff('2025-02-01'::TIMESTAMP, '2025-01-01'::TIMESTAMP) │
├──────────────────────────────────────────────────────────────────┤
│ 744:00:00                                                        │
└──────────────────────────────────────────────────────────────────┘
```