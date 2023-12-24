---
title: 位图
---

位图在 Databend 中是一种高效的数据结构，用于表示集合中元素或属性的存在或缺失。它在数据分析和查询中具有广泛的应用，提供快速的集合运算和聚合能力。

:::tip 为什么使用位图？

- 唯一计数：位图用于高效计算集合中唯一元素的数量。通过对位图执行位运算，可以快速确定元素的存在并实现唯一计数功能。

- 过滤和选择：位图对于快速数据过滤和选择非常有效。通过对位图执行位运算，可以高效地识别满足特定条件的元素，实现高效的数据过滤和选择。

- 集合运算：位图可以用于各种集合运算，如并集、交集、差集和对称差集。这些集合运算可以通过位运算实现，在数据处理和分析中提供高效的集合运算。

- 压缩存储：位图在存储方面具有高压缩性能。与传统的存储方法相比，位图可以有效利用存储空间，节省存储成本并提高查询性能。

:::

Databend 通过 TO_BITMAP 函数支持使用两种格式创建位图：

- 字符串格式：可以使用逗号分隔的值字符串创建位图。例如，TO_BITMAP('1,2,3')将创建一个在值 1、2 和 3 处设置位的位图。

- uint64 格式：也可以使用 uint64 值创建位图。例如，TO_BITMAP(123)将根据 uint64 值 123 的二进制表示设置位图的位。

在 Databend 中，位图最多可以存储 2^64 个位。Databend 中的位图数据类型是一种二进制类型，与其他支持的类型在表示和 SELECT 语句中的显示方面有所不同。与其他类型不同，位图不能直接显示在 SELECT 语句的结果集中。相反，它们需要使用 [位图函数](../../20-sql-functions/01-bitmap-functions/index.md) 进行操作和解释：

```sql
SELECT TO_BITMAP('1,2,3')

+---------------------+
|  to_bitmap('1,2,3') |
+---------------------+
|  <bitmap binary>    |
+---------------------+

SELECT TO_STRING(TO_BITMAP('1,2,3'))

+-------------------------------+
| to_string(to_bitmap('1,2,3')) |
--------------------------------+
|            1,2,3              |
+-------------------------------+
```

**示例**：

此示例演示了在 Databend 中使用位图可以高效存储和查询具有大量可能值的数据，例如用户访问历史。

```sql
-- Create table user_visits with user_id and page_visits columns, using build_bitmap for representing page_visits.
CREATE TABLE user_visits (
  user_id INT,
  page_visits Bitmap
)

-- Insert user visits for 3 users, calculate total visits using bitmap_count.
INSERT INTO user_visits (user_id, page_visits)
VALUES
  (1, build_bitmap([2, 5, 8, 10])),
  (2, build_bitmap([3, 7, 9])),
  (3, build_bitmap([1, 4, 6, 10]))

-- Query the table
SELECT user_id, bitmap_count(page_visits) AS total_visits
FROM user_visits

+--------+------------+
|user_id |total_visits|
+--------+------------+
|       1|           4|
|       2|           3|
|       3|           4|
+--------+------------+
```
