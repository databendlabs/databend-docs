---
title: PERCENT_RANK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.780"/>

计算每行的相对排名（以百分比表示）。返回 0 到 1 之间的值，其中 0 代表最低排名，1 代表最高排名。

另请参阅：[CUME_DIST](cume-dist.md)

## 语法

```sql
PERCENT_RANK()
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
)
```

**参数：**
- `PARTITION BY`：可选。将行划分为分区（Partition）。
- `ORDER BY`：必需。确定排名顺序。
- `ASC | DESC`：可选。排序方向（默认为 ASC）。

**说明：**
- 返回值在 0 和 1 之间（含 0 和 1）。
- 第一行的 PERCENT_RANK 始终为 0。
- 最后一行的 PERCENT_RANK 始终为 1。
- 计算公式：(rank - 1) / (total_rows - 1)。
- 乘以 100 可得到百分位数值。

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

**计算百分比排名（显示百分位位置）：**

```sql
SELECT student, score,
       PERCENT_RANK() OVER (ORDER BY score DESC) AS percent_rank,
       ROUND(PERCENT_RANK() OVER (ORDER BY score DESC) * 100) AS percentile
FROM scores
ORDER BY score DESC, student;
```

结果：
```
student | score | percent_rank | percentile
--------+-------+--------------+-----------
Alice   |    95 |          0.0 |          0
Bob     |    87 |         0.25 |         25
Charlie |    87 |         0.25 |         25
David   |    82 |         0.75 |         75
Eve     |    78 |          1.0 |        100
```