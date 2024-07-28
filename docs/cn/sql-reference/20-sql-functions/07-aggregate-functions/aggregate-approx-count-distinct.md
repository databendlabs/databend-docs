---
title: APPROX_COUNT_DISTINCT
---

使用 [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog) 算法估计数据集中不同值的数量。

HyperLogLog 算法通过使用少量内存和时间提供唯一元素数量的近似值。在处理大型数据集且可以接受估计结果时，考虑使用此函数。作为对一些准确性的交换，这是一种快速且高效的返回不同计数的方法。

要获得准确的结果，请使用 [COUNT_DISTINCT](aggregate-count-distinct.md)。更多解释请参见 [示例](#examples)。

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

**查询示例：估计不同用户ID的数量**
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