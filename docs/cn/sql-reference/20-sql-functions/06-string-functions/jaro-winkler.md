---
title: JARO_WINKLER
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.675"/>

计算两个字符串之间的 [Jaro-Winkler 距离](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance)。它通常用于测量字符串之间的相似度，值的范围从 0.0（完全不同）到 1.0（完全相同）。

## 语法

```sql
JARO_WINKLER(<string1>, <string2>)
```

## 返回类型

JARO_WINKLER 函数返回一个 FLOAT64 值，表示两个输入字符串之间的相似度。返回值遵循以下规则：

- 相似度范围：结果范围从 0.0（完全不同）到 1.0（完全相同）。

    ```sql title='Examples:'
    SELECT JARO_WINKLER('databend', 'Databend') AS similarity;

    ┌────────────────────┐
    │     similarity     │
    ├────────────────────┤
    │ 0.9166666666666666 │
    └────────────────────┘

    SELECT JARO_WINKLER('databend', 'database') AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │        0.9 │
    └────────────┘
    ```
- NULL 处理：如果 string1 或 string2 为 NULL，则结果为 NULL。

    ```sql title='Examples:'
    SELECT JARO_WINKLER('databend', NULL) AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │ NULL       │
    └────────────┘
    ```
- 空字符串：
    - 比较两个空字符串返回 1.0。

    ```sql title='Examples:'
    SELECT JARO_WINKLER('', '') AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │          1 │
    └────────────┘
    ```
    - 将空字符串与非空字符串进行比较会返回 0.0。

    ```sql title='Examples:'
    SELECT JARO_WINKLER('databend', '') AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │          0 │
    └────────────┘
    ```