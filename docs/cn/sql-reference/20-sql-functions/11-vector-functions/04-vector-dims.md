---
title: 'VECTOR_DIMS'
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.780"/>

返回向量 (vector) 的维度（元素数量）。

## 语法

```sql
VECTOR_DIMS(vector)
```

## 参数

- `vector`: 输入向量 (vector)（VECTOR 数据类型）

## 返回值

返回表示向量维度（元素数量）的 INT 值。

## 描述

`VECTOR_DIMS` 函数返回向量的维度，即其包含的元素数量。此函数适用于：

- 执行操作前验证向量维度
- 需要维度信息的动态向量处理
- 使用向量数据进行调试与数据探索
- 确保计算中向量间的兼容性

:::info
此函数在 Databend 内部执行向量计算，不依赖外部 API。
:::

## 示例

```sql
SELECT 
    VECTOR_DIMS([1,2]::VECTOR(2)) AS dims_2d,
    VECTOR_DIMS([1,2,3]::VECTOR(3)) AS dims_3d,
    VECTOR_DIMS([1,2,3,4,5]::VECTOR(5)) AS dims_5d;
```

结果：
```
┌─────────┬─────────┬─────────┐
│ dims_2d │ dims_3d │ dims_5d │
├─────────┼─────────┼─────────┤
│       2 │       3 │       5 │
└─────────┴─────────┴─────────┘
```