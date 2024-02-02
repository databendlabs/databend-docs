---
title: JSON 路径
---

Databend 支持[半结构化数据类型](../../00-sql-reference/10-data-types/43-data-type-variant.md)并允许通过 JSON 路径操作符检索内部元素：

## 语法

### 冒号表示法

冒号表示法 `:` 用于通过名称检索对象的元素：`<column>:<level1_name>:<level2_name>`。

### 点表示法

点表示法 `.` 用于通过名称检索对象的元素：`<column>:<level1_name>.<level2_name>`。

:::note
请注意，点表示法不能用作第一级名称表示法，以避免与表和列之间的点表示法混淆。
:::

### 括号表示法

括号表示法 `[]` 用于通过索引检索数组的元素：`<column>[<level1_index>][<level2_index>]` 或通过单引号名称检索对象的元素：`<column>['<level1_name>']['<level2_name>']`。

:::tip
这些表示法可以混合使用。
:::

## 示例

```sql
CREATE TABLE test(var Variant, arr Variant);
INSERT INTO test VALUES (parse_json('{"a":{"b":1,"c":[1,2]}}'), parse_json('[["a","b"],{"k":"a"}]')),
                        (parse_json('{"a":{"b":2,"c":[3,4]}}'), parse_json('[["c","d"],{"k":"b"}]'));

-- 冒号表示法
SELECT var:a:b FROM test;
+---------+
| var:a:b |
+---------+
| 1       |
| 2       |
+---------+

-- 点表示法
SELECT var:a.c FROM test;
+---------+
| var:a.c |
+---------+
| [1,2]   |
| [3,4]   |
+---------+

-- 括号表示法
SELECT var['a']['c'], arr[0][1] FROM test;
+---------------+-----------+
| var['a']['c'] | arr[0][1] |
+---------------+-----------+
| [1,2]         | "b"       |
| [3,4]         | "d"       |
+---------------+-----------+

-- 混合表示法
SELECT var['a']:b, var:a['c'][0], arr[1].k FROM test;
+------------+---------------+----------+
| var['a']:b | var:a['c'][0] | arr[1].k |
+------------+---------------+----------+
| 1          | 1             | "a"      |
| 2          | 3             | "b"      |
+------------+---------------+----------+
```
