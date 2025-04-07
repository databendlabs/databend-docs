---
title: APPROX_COUNT_DISTINCT
---

使用 [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog) 算法估算数据集中的不同值的数量。

HyperLogLog 算法使用少量内存和时间来近似计算唯一元素的数量。在处理大型数据集且可以接受估计结果时，请考虑使用此函数。为了换取一定的准确性，这是一种快速有效的返回不同计数的方法。

要获得准确的结果，请使用 [COUNT_DISTINCT](aggregate-count-distinct.md)。 有关更多说明，请参见 [示例](#examples)。

## 语法

```sql
APPROX_COUNT_DISTINCT(<expr>)
```

## 返回类型

整数。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE user_events (
  id INT,
  user_id INT,
  event_name VARCHAR
);

INSERT INTO user_events (id, user_id, event_name)
VALUES (1, 1, 'Login'),
       (2, 2, 'Login'),
       (3, 3, 'Login'),
       (4, 1, 'Logout'),
       (5, 2, 'Logout'),
       (6, 4, 'Login'),
       (7, 1, 'Login');
```

**查询演示：估算不同用户 ID 的数量**
```sql
SELECT APPROX_COUNT_DISTINCT(user_id) AS approx_distinct_user_count
FROM user_events;
```

**结果**
```sql
| approx_distinct_user_count |
|----------------------------|
|             4              |
```