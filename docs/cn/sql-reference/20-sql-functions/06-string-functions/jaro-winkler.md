---
title: JARO_WINKLER
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.675"/>

计算两个字符串之间的 [Jaro-Winkler 距离](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance)。它通常用于衡量字符串之间的相似性，取值范围从 0.0（完全不相似）到 1.0（完全相同）。

## 语法

```sql
JARO_WINKLER(<string1>, <string2>)
```

## 返回类型

JARO_WINKLER 函数返回一个 FLOAT64 值，表示两个输入字符串之间的相似性。返回值遵循以下规则：

- 相似性范围：结果范围从 0.0（完全不相似）到 1.0（完全相同）。

    ```sql title='示例:'
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
- NULL 处理：如果 string1 或 string2 为 NULL，结果为 NULL。

    ```sql title='示例:'
    SELECT JARO_WINKLER('databend', NULL) AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │ NULL       │
    └────────────┘
    ```
- 空字符串：
    - 比较两个空字符串返回 1.0。

    ```sql title='示例:'
    SELECT JARO_WINKLER('', '') AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │          1 │
    └────────────┘
    ```
    - 比较一个空字符串与一个非空字符串返回 0.0。

    ```sql title='示例:'
    SELECT JARO_WINKLER('databend', '') AS similarity;

    ┌────────────┐
    │ similarity │
    ├────────────┤
    │          0 │
    └────────────┘
    ```