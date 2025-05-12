---
title: Bitmap
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.45"/>

Databend 中的 Bitmap 是一种高效的数据结构，用于表示集合中元素或属性的存在与否。它在数据分析和查询中具有广泛的应用，提供快速的集合运算和聚合能力。

:::tip Why Bitmap?

- Distinct Count: Bitmap 用于高效计算集合中唯一元素的数量。通过对 Bitmap 执行按位运算，可以快速确定元素是否存在并实现 distinct count 功能。

- Filtering and Selection: Bitmap 在快速数据过滤和选择方面非常有效。通过对 Bitmap 执行按位运算，可以高效地识别满足特定条件的元素，从而实现高效的数据过滤和选择。

- Set Operations: Bitmap 可用于各种集合运算，如并集、交集、差集和对称差集。这些集合运算可以通过按位运算来实现，从而在数据处理和分析中提供高效的集合运算。

- Compressed Storage: Bitmap 在存储方面具有很高的压缩性能。与传统的存储方法相比，Bitmap 可以有效地利用存储空间，从而节省存储成本并提高查询性能。
:::

Databend 允许使用两种格式通过 TO_BITMAP 函数创建 Bitmap：

- String format: 您可以使用逗号分隔的值字符串创建 Bitmap。例如，TO_BITMAP('1,2,3') 创建一个 Bitmap，其中为值 1、2 和 3 设置了位。

- uint64 format: 您还可以使用 uint64 值创建 Bitmap。例如，TO_BITMAP(123) 创建一个 Bitmap，其中根据 uint64 值 123 的二进制表示设置位。

在 Databend 中，一个 Bitmap 最多可以存储 2^64 位。Databend 中的 Bitmap 数据类型是一种二进制类型，在 SELECT 语句中的表示和显示方面与其他支持的类型不同。与其他类型不同，Bitmap 不能直接显示在 SELECT 语句的结果集中。相反，它们需要使用 [Bitmap Functions](../../20-sql-functions/01-bitmap-functions/index.md) 进行操作和解释：

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

**Example**:

此示例说明了 Databend 中的 Bitmap 如何能够高效地存储和查询具有大量可能值的数据，例如用户访问历史记录。

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