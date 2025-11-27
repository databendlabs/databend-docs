---
title: RETENTION
---

聚合函数

RETENTION() 函数接受一组条件作为参数，支持 1 到 32 个 UInt8 类型的参数，用于表示事件中是否满足特定条件。

任何条件都可以指定为参数（类似于 WHERE 子句中的条件）。

除了第一个条件外，其余条件均与第一个条件结合判断：如果第一个条件和第二个条件都为真，则第二个结果为真；如果第一个条件和第三个条件都为真，则第三个结果为真，依此类推。

## 语法

```sql
RETENTION( <cond1> , <cond2> , ..., <cond32> );
```

## 参数

| 参数       | 描述                                 |
|-----------|-------------------------------------|
| `<cond>`  | 返回布尔结果的表达式                 |

## 返回类型

返回一个包含 1 或 0 的数组。

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE user_events (
  id INT,
  user_id INT,
  event_date DATE,
  event_type VARCHAR
);

INSERT INTO user_events (id, user_id, event_date, event_type)
VALUES (1, 1, '2022-01-01', 'signup'),
       (2, 1, '2022-01-02', 'login'),
       (3, 2, '2022-01-01', 'signup'),
       (4, 2, '2022-01-03', 'purchase'),
       (5, 3, '2022-01-01', 'signup'),
       (6, 3, '2022-01-02', 'login');
```

**查询示例：基于注册、登录和购买事件计算用户留存**
```sql
SELECT
  user_id,
  RETENTION(event_type = 'signup', event_type = 'login', event_type = 'purchase') AS retention
FROM user_events
GROUP BY user_id;
```

**结果**
```sql
| user_id | retention |
|---------|-----------|
|   1     | [1, 1, 0] |
|   2     | [1, 0, 1] |
|   3     | [1, 1, 0] |
```