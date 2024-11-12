---
title: Map
---

MAP 数据结构用于保存一组 `Key:Value` 对，并使用 Array(Tuple(key, value)) 的嵌套数据结构存储数据。它适用于数据类型固定，但 `Key` 的值不能完全确定的情况。

## 理解 Key:Value

`Key` 是特定的基本数据类型，包括 Boolean、Number、Decimal、String、Date 或 Timestamp。`Key` 的值不能为 Null，且不允许重复。`Value` 可以是任何数据类型，包括嵌套数组、元组等。

Map 数据可以通过包含在大括号中的 `Key:Value` 对生成，或者通过使用 Map 函数将两个数组转换为 Map。Map 函数接受两个数组作为输入，其中第一个数组的元素作为键，第二个数组的元素作为值。请参见以下示例：

```sql
-- 输入数组：[1, 2] 和 ['v1', 'v2']
-- 生成的 Map：{1: 'v1', 2: 'v2'}

SELECT {'k1': 1, 'k2': 2}, map([1, 2], ['v1', 'v2']);
+-----------------+---------------------------+
| {'k1':1,'k2':2} | map([1, 2], ['v1', 'v2']) |
+-----------------+---------------------------+
| {'k1':1,'k2':2} | {1:'v1',2:'v2'}           |
+-----------------+---------------------------+
```

## Map 和布隆过滤器索引

在 Databend Map 中，对于某些数据类型的值（`Numeric`、`String`、`Timestamp` 和 `Date`），会创建布隆过滤器索引。

这使得在 MAP 数据结构中搜索值变得更加容易和快速。

Databend Map 中布隆过滤器索引的实现见 [PR#10457](https://github.com/datafuselabs/databend/pull/10457)。

布隆过滤器在查询的值不存在时，特别有效地减少了查询时间。

例如：
```sql
SELECT *
FROM nginx_log
WHERE log['ip'] = '205.91.162.148';
```
结果：
```
┌────┬─────────────────────────────────────────┐
│ id │ log                                     │
├────┼─────────────────────────────────────────┤
│ 1  │ {'ip':'205.91.162.148','url':'test-1'}  │
└────┴─────────────────────────────────────────┘
```

```sql
SELECT *
FROM nginx_log
WHERE log['ip'] = '205.91.162.141';
```
结果：
```
┌────┬─────┐
│ id │ log │
├────┼─────┤
└────┴─────┘
```

## 示例

**创建一个包含 Map 列的表，用于存储网络流量数据**

```sql
CREATE TABLE web_traffic_data(
    id INT64, 
    traffic_info MAP(STRING, STRING)
);
```

```sql
DESC web_traffic_data;
```

结果：
```
┌─────────────┬─────────────────────┬──────┬─────────┬───────┐
│ Field       │ Type                │ Null │ Default │ Extra │
├─────────────┼─────────────────────┼──────┼─────────┼───────┤
│ id          │ INT64               │ NO   │         │       │
│ traffic_info│ MAP(STRING, STRING) │ NO   │ {}      │       │
└─────────────┴─────────────────────┴──────┴─────────┴───────┘
```

**插入包含 IP 地址和访问 URL 的 Map 数据**

```sql
INSERT INTO web_traffic_data 
VALUES
    (1, {'ip': '192.168.1.1', 'url': 'example.com/home'}),
    (2, {'ip': '192.168.1.2', 'url': 'example.com/about'}),
    (3, {'ip': '192.168.1.1', 'url': 'example.com/contact'});
```

**查询**

```sql
SELECT * FROM web_traffic_data;
```
结果：
```
┌────┬─────────────────────────────────────────────────┐
│ id │ traffic_info                                    │
├────┼─────────────────────────────────────────────────┤
│ 1  │ {'ip':'192.168.1.1','url':'example.com/home'}    │
│ 2  │ {'ip':'192.168.1.2','url':'example.com/about'}   │
│ 3  │ {'ip':'192.168.1.1','url':'example.com/contact'} │
└────┴─────────────────────────────────────────────────┘
```

**查询每个 IP 地址的访问次数**

```sql
SELECT traffic_info['ip'] AS ip_address, COUNT(*) AS visits
FROM web_traffic_data
GROUP BY traffic_info['ip'];
```

结果：
```
┌─────────────┬────────┐
│ ip_address  │ visits │
├─────────────┼────────┤
│ 192.168.1.1 │      2 │
│ 192.168.1.2 │      1 │
└─────────────┴────────┘
```

**查询访问次数最多的 URL**
```sql
SELECT traffic_info['url'] AS url, COUNT(*) AS visits
FROM web_traffic_data
GROUP BY traffic_info['url']
ORDER BY visits DESC
LIMIT 3;
```

结果：
```
┌─────────────────────┬────────┐
│ url                 │ visits │
├─────────────────────┼────────┤
│ example.com/home    │      1 │
│ example.com/about   │      1 │
│ example.com/contact │      1 │
└─────────────────────┴────────┘
```