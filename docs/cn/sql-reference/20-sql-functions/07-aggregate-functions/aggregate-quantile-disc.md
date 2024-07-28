---
title: QUANTILE_DISC
---

聚合函数。

`QUANTILE_DISC()` 函数计算数值数据序列的确切分位数。
`QUANTILE` 是 `QUANTILE_DISC` 的别名。

:::caution
NULL 值不计入。
:::

## 语法

```sql
QUANTILE_DISC(<levels>)(<expr>)
    
QUANTILE_DISC(level1, level2, ...)(<expr>)
```

## 参数

| 参数       | 描述                                                                                      |
|------------|-------------------------------------------------------------------------------------------|
| `level(s)` | 分位数水平。每个水平是一个从 0 到 1 的常量浮点数。我们建议使用 [0.01, 0.99] 范围内的水平值 |
| `<expr>`   | 任何数值表达式                                                                            |

## 返回类型

基于水平数的 InputType 或 InputType 数组。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE salary_data (
  id INT,
  employee_id INT,
  salary FLOAT
);

INSERT INTO salary_data (id, employee_id, salary)
VALUES (1, 1, 50000),
       (2, 2, 55000),
       (3, 3, 60000),
       (4, 4, 65000),
       (5, 5, 70000);
```

**查询示例：计算薪资的第 25 和第 75 百分位数**
```sql
SELECT QUANTILE_DISC(0.25, 0.75)(salary) AS salary_quantiles
FROM salary_data;
```

**结果**
```sql
|  salary_quantiles   |
|---------------------|
| [55000.0, 65000.0]  |
```