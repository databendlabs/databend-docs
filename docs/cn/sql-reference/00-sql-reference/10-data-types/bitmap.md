---
title: Bitmap
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.45"/>

Databend 中的 Bitmap 是一种高效的数据结构，用于表示集合中元素或属性的存在与否。它在数据分析和查询中具有广泛的应用，提供快速的集合操作和聚合能力。

:::tip 为什么选择 Bitmap？

- 独立计数: Bitmap 用于高效计算集合中唯一元素的数量。通过对 Bitmap 执行位操作，可以快速确定元素的存在并实现独立计数功能。

- 过滤和选择: Bitmap 可有效实现快速数据过滤和选择。通过对 Bitmap 执行位操作，可以高效识别满足特定条件的元素，从而实现高效的数据过滤和选择。

- 集合操作: Bitmap 可用于各种集合操作，例如并集、交集、差集和对称差集。这些集合操作可以通过位操作实现，在数据处理和分析中提供高效的集合操作。

- 压缩存储: Bitmap 在存储方面具有高压缩性能。与传统的存储方法相比，Bitmap 可以有效利用存储空间，节省存储成本并提高查询性能。
:::

Databend 支持使用 TO_BITMAP 函数以两种格式创建 Bitmap：

- 字符串格式: 可以使用逗号分隔值的字符串创建 Bitmap。例如，TO_BITMAP('1,2,3') 创建一个 Bitmap，其中位 1、2 和 3 被设置。

- uint64 格式: 还可以使用 uint64 值创建 Bitmap。例如，TO_BITMAP(123) 创建一个 Bitmap，其中位根据 uint64 值 123 的二进制表示进行设置。

在 Databend 中，一个 Bitmap 最多可以存储 2^64 位。Databend 中的 Bitmap 数据类型是一种二进制类型，其表示和在 SELECT 语句中的显示方式与其他支持的类型不同。与其他类型不同，Bitmap 不能直接显示在 SELECT 语句的结果集中。相反，它们需要使用 [Bitmap 函数](../../20-sql-functions/01-bitmap-functions/index.md)进行操作和解释：

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

**示例**:

此示例说明了 Databend 中的 Bitmap 如何高效存储和查询具有大量可能值的数据，例如用户访问历史记录。

```sql
-- 创建表 user_visits，包含 user_id 和 page_visits 列，使用 build_bitmap 表示 page_visits。
CREATE TABLE user_visits (
  user_id INT,
  page_visits Bitmap
)

-- 插入 3 个用户的访问数据，使用 bitmap_count 计算总访问量。
INSERT INTO user_visits (user_id, page_visits)
VALUES
  (1, build_bitmap([2, 5, 8, 10])),
  (2, build_bitmap([3, 7, 9])),
  (3, build_bitmap([1, 4, 6, 10]))

-- 查询表
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