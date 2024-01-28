---
title: 映射
---

MAP数据结构用于保存一组`Key:Value`对，并使用Array(Tuple(key, value))的嵌套数据结构来存储数据。它适用于数据类型恒定，但无法完全确定`Key`的值的情况。

## 理解Key:Value

`Key`是指定的基本数据类型，包括布尔值、数字、小数、字符串、日期或时间戳。`Key`的值不能为Null，且不允许有重复。`Value`可以是任何数据类型，包括嵌套数组、元组等。

可以通过大括号中的`Key:Value`对或使用Map函数将两个数组转换为Map来生成Map数据。Map函数接受两个数组作为输入，其中第一个数组的元素作为键，第二个数组的元素作为值。请看下面的示例：

```sql
-- 输入数组: [1, 2] 和 ['v1', 'v2']
-- 生成的Map: {1: 'v1', 2: 'v2'}

SELECT {'k1': 1, 'k2': 2}, map([1, 2], ['v1', 'v2']);
+-----------------+---------------------------+
| {'k1':1,'k2':2} | map([1, 2], ['v1', 'v2']) |
+-----------------+---------------------------+
| {'k1':1,'k2':2} | {1:'v1',2:'v2'}           |
+-----------------+---------------------------+
```

## Map和布隆过滤器索引

在Databend Map中，为某些数据类型的值创建了布隆过滤器索引：`数值型`、`字符串`、`时间戳`和`日期`。

这使得在MAP数据结构中搜索值变得更加容易和快速。

Databend Map中布隆过滤器索引的实现在[PR#10457](https://github.com/datafuselabs/databend/pull/10457)。

当查询的值不存在时，布隆过滤器特别有效地减少了查询时间。

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

**创建一个包含Map列的表来存储网页流量数据**

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

**插入包含IP地址和访问过的URL的Map数据**

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

**查询每个IP地址的访问次数**

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

**查询访问次数最多的URL**
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