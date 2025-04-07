---
title: WINDOW_FUNNEL
description: Funnel Analysis
---

<p align="center">
<img src="https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/learn/databend-funnel.png" width="550"/>
</p>

## WINDOW_FUNNEL

类似于 ClickHouse 中的 `windowFunnel` (它们由同一作者创建)，它在滑动时间窗口中搜索事件链，并计算链中事件的最大数量。

该函数按照以下算法工作：

-   该函数搜索触发链中第一个条件的数据，并将事件计数器设置为 1。这是滑动窗口开始的时刻。

-   如果在窗口中按顺序出现链中的事件，则计数器会递增。如果事件的顺序被打乱，则计数器不会递增。

-   如果数据在不同的完成点有多个事件链，则该函数将仅输出最长链的大小。


```sql
WINDOW_FUNNEL( <window> )( <timestamp>, <cond1>, <cond2>, ..., <condN> )
```

**参数**

-   `<timestamp>` — 包含时间戳的列的名称。支持的数据类型：整数类型和日期时间类型。
-   `<cond>` — 描述事件链的条件或数据。必须是 `Boolean` 数据类型。

**参数**

-   `<window>` — 滑动窗口的长度，它是第一个条件和最后一个条件之间的时间间隔。`window` 的单位取决于 `timestamp` 本身并且会有所不同。使用表达式 `timestamp of cond1 <= timestamp of cond2 <= ... <= timestamp of condN <= timestamp of cond1 + window` 确定。

**返回值**

滑动时间窗口中链中连续触发条件的最大数量。
分析选择中的所有链。

类型：`UInt8`。


**示例**

确定设定的时间段是否足够用户在网上商店中 SELECT 手机并购买两次。

设置以下事件链：

1. 用户登录到他们在商店中的帐户 (`event_name = 'login'`)。
2. 用户访问页面 (`event_name = 'visit'`)。
3. 用户添加到购物车 (`event_name = 'cart'`)。
4. 用户完成购买 (`event_name = 'purchase'`)。


```sql
CREATE TABLE events(user_id BIGINT, event_name VARCHAR, event_timestamp TIMESTAMP);

INSERT INTO events VALUES(100123, 'login', '2022-05-14 10:01:00');
INSERT INTO events VALUES(100123, 'visit', '2022-05-14 10:02:00');
INSERT INTO events VALUES(100123, 'cart', '2022-05-14 10:04:00');
INSERT INTO events VALUES(100123, 'purchase', '2022-05-14 10:10:00');

INSERT INTO events VALUES(100125, 'login', '2022-05-15 11:00:00');
INSERT INTO events VALUES(100125, 'visit', '2022-05-15 11:01:00');
INSERT INTO events VALUES(100125, 'cart', '2022-05-15 11:02:00');

INSERT INTO events VALUES(100126, 'login', '2022-05-15 12:00:00');
INSERT INTO events VALUES(100126, 'visit', '2022-05-15 12:01:00');
```

输入表：

```sql
+---------+------------+----------------------------+
| user_id | event_name | event_timestamp            |
+---------+------------+----------------------------+
|  100123 | login      | 2022-05-14 10:01:00.000000 |
|  100123 | visit      | 2022-05-14 10:02:00.000000 |
|  100123 | cart       | 2022-05-14 10:04:00.000000 |
|  100123 | purchase   | 2022-05-14 10:10:00.000000 |
|  100125 | login      | 2022-05-15 11:00:00.000000 |
|  100125 | visit      | 2022-05-15 11:01:00.000000 |
|  100125 | cart       | 2022-05-15 11:02:00.000000 |
|  100126 | login      | 2022-05-15 12:00:00.000000 |
|  100126 | visit      | 2022-05-15 12:01:00.000000 |
+---------+------------+----------------------------+
```

找出用户 `user_id` 在一小时窗口滑动中可以通过链到达多远。

查询：

```sql
SELECT
    level,
    count() AS count
FROM
(
    SELECT
        user_id,
        window_funnel(3600000000)(event_timestamp, event_name = 'login', event_name = 'visit', event_name = 'cart', event_name = 'purchase') AS level
    FROM events
    GROUP BY user_id
)
GROUP BY level ORDER BY level ASC;
```

:::tip

`event_timestamp` 类型是 timestamp，`3600000000` 是一个小时的时间窗口。

:::

结果：

```sql
+-------+-------+
| level | count |
+-------+-------+
|     2 |     1 |
|     3 |     1 |
|     4 |     1 |
+-------+-------+
```

* 用户 `100126` 的级别为 2 (`login -> visit`)。
* 用户 `100125` 的级别为 3 (`login -> visit -> cart`)。
* 用户 `100123` 的级别为 4 (`login -> visit -> cart -> purchase`)。