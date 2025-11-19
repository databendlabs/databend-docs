---
title: Bitmap
sidebar_position: 12
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.45"/>

## 概述

`BITMAP` 存储无符号 64 位整数的成员信息，并支持快速的集合操作（计数、并集、交集等）。SELECT 语句会显示二进制 blob，因此请使用 [Bitmap Functions](../../20-sql-functions/01-bitmap-functions/index.md) 来解释这些值。

## 示例

### 构建 Bitmap

`TO_BITMAP` 接受逗号分隔的字符串或 `UINT64` 值（视为单个元素）。`TO_STRING` 将位图序列化回可读文本。

```sql
SELECT
  TO_BITMAP('1,2,3')                     AS str_input,
  TO_STRING(TO_BITMAP('1,2,3'))          AS round_tripped,
  TO_STRING(TO_BITMAP(123))              AS from_uint64;
```

结果：
```
┌────────────────────────────────┬──────────────────────────────────┬────────────────┐
│ str_input                      │ round_tripped                    │ from_uint64    │
├────────────────────────────────┼──────────────────────────────────┼────────────────┤
│ <bitmap binary>                │ 1,2,3                            │ 123            │
└────────────────────────────────┴──────────────────────────────────┴────────────────┘
```

### 持久化 Bitmap

使用 `BUILD_BITMAP` 将数组转换为位图，然后将其插入表中。随后可以使用 `BITMAP_COUNT` 等聚合函数快速读取存储的值。

```sql
CREATE TABLE user_visits (
  user_id INT,
  page_visits BITMAP
);

INSERT INTO user_visits VALUES
  (1, BUILD_BITMAP([2, 5, 8, 10])),
  (2, BUILD_BITMAP([3, 7, 9])),
  (3, BUILD_BITMAP([1, 4, 6, 10]));

SELECT
  user_id,
  BITMAP_COUNT(page_visits) AS distinct_pages,
  BITMAP_HAS_ALL(page_visits, BUILD_BITMAP([10])) AS saw_page_10
FROM user_visits;
```

结果：
```
┌────────┬────────────────┬─────────────┐
│ user_id │ distinct_pages │ saw_page_10 │
├────────┼────────────────┼─────────────┤
│      1 │              4 │        true │
│      2 │              3 │       false │
│      3 │              4 │        true │
└────────┴────────────────┴─────────────┘
```
