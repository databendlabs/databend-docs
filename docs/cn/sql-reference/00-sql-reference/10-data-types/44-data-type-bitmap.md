---
title: 位图
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.45"/>

在Databend中，位图是一种用于表示集合中元素或属性存在与否的高效数据结构。它在数据分析和查询中有广泛应用，提供快速的集合操作和聚合能力。

:::tip 为什么使用位图？

- 唯一计数：位图用于高效计算集合中唯一元素的数量。通过对位图进行位运算，可以快速确定元素的存在性，实现唯一计数功能。

- 过滤和选择：位图对于快速数据过滤和选择非常有效。通过对位图进行位运算，可以高效地识别满足特定条件的元素，实现高效的数据过滤和选择。

- 集合操作：位图可用于各种集合操作，如并集、交集、差集和对称差集。这些集合操作可以通过位运算实现，提供数据处理和分析中的高效集合操作。

- 压缩存储：位图在存储方面提供了高压缩性能。与传统存储方法相比，位图可以有效利用存储空间，节省存储成本并提高查询性能。
:::

Databend通过TO_BITMAP函数支持使用两种格式创建位图：

- 字符串格式：您可以使用逗号分隔的字符串创建位图。例如，TO_BITMAP('1,2,3') 创建一个为值1、2和3设置了位的位图。

- uint64格式：您也可以使用uint64值创建位图。例如，TO_BITMAP(123) 创建一个根据uint64值123的二进制表示设置了位的位图。

在Databend中，位图最多可以存储2^64位。Databend中的位图数据类型是一种二进制类型，与其他支持的类型在表示和SELECT语句中的显示方面不同。与其他类型不同，位图不能直接在SELECT语句的结果集中显示。相反，它们需要使用[位图函数](../../20-sql-functions/01-bitmap-functions/index.md)进行操作和解释：

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
+-------------------------------+
|            1,2,3              |
+-------------------------------+
```

**示例**：

此示例说明了位图如何在Databend中实现数据的高效存储和查询，这些数据具有大量可能的值，例如用户访问历史。

```sql
-- 使用build_bitmap表示page_visits，创建包含user_id和page_visits列的表user_visits。
CREATE TABLE user_visits (
  user_id INT,
  page_visits Bitmap
)

-- 为3个用户插入访问记录，使用bitmap_count计算总访问量。
INSERT INTO user_visits (user_id, page_visits)
VALUES
  (1, build_bitmap([2, 5, 8, 10])),
  (2, build_bitmap([3, 7, 9])),
  (3, build_bitmap([1, 4, 6, 10]))

-- 查询表格
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