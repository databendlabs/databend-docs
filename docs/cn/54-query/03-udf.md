---
title: 用户定义函数
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

用户定义函数（UDFs）允许您使用匿名 lambda 表达式定义自定义操作，以在 Databend 中处理数据。用户定义函数的关键特性包括：

- 自定义数据转换：UDFs 使您能够执行可能无法仅通过内置 Databend 函数实现的数据转换。这种自定义对于处理独特的数据格式或实现特定的业务逻辑特别有价值。

- 代码可重用性：UDFs 可以在多个查询中轻松重用，节省编码和维护数据处理逻辑的时间和精力。

## 管理 UDFs

Databend 提供了多种命令来管理 UDFs。详情请见 [用户定义函数](/sql/sql-commands/ddl/udf/)。

## 使用示例

此示例创建 UDFs，以使用 SQL 查询从表中的 JSON 数据中提取特定值。

```sql
-- 定义 UDFs
CREATE FUNCTION get_v1 AS (json) -> json["v1"];
CREATE FUNCTION get_v2 AS (json) -> json["v2"];

-- 创建一个表
CREATE TABLE json_table(time TIMESTAMP, data JSON);

-- 插入一个时间事件
INSERT INTO json_table VALUES('2022-06-01 00:00:00.00000', PARSE_JSON('{"v1":1.5, "v2":20.5}'));

-- 从事件中获取 v1 和 v2 值
SELECT get_v1(data), get_v2(data) FROM json_table;
+------------+------------+
| data['v1'] | data['v2'] |
+------------+------------+
| 1.5        | 20.5       |
+------------+------------+
```