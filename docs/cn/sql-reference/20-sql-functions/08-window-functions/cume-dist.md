---
title: CUME_DIST
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.2.7"/>

计算每行值的累积分布（Cumulative Distribution）。返回小于或等于当前行值的行所占比例。

另请参阅：[PERCENT_RANK](percent_rank.md)

## 语法

```sql
CUME_DIST()
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
)
```

**参数：**
- `PARTITION BY`：可选。将行划分为分区。
- `ORDER BY`：必选。确定分布顺序。
- `ASC | DESC`：可选。排序方向（默认为 ASC）。

**说明：**
- 返回值介于 0 与 1 之间（不含 0，含 1）。
- 公式：（小于或等于当前值的行数）/（总行数）
- 对于最高值始终返回 1.0。
- 可用于计算百分位数和累积百分比。

## 示例

```sql
-- 创建示例数据
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 95),
    ('Bob', 87),
    ('Charlie', 87),
    ('David', 82),
    ('Eve', 78);
```

**计算累积分布（显示得分等于或低于每个分数的学生所占百分比）：**

```sql
SELECT student, score,
       CUME_DIST() OVER (ORDER BY score) AS cume_dist,
       ROUND(CUME_DIST() OVER (ORDER BY score) * 100) AS cumulative_percent
FROM scores
ORDER BY score;
```

结果：
```
student | score | cume_dist | cumulative_percent
--------+-------+-----------+-------------------
Eve     |    78 |       0.2 |                20
David   |    82 |       0.4 |                40
Bob     |    87 |       0.8 |                80
Charlie |    87 |       0.8 |                80
Alice   |    95 |       1.0 |               100
```