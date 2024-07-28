---
title: FUSE_ENCODING
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.162"/>

返回应用于表中特定列的编码类型。它帮助您了解数据是如何在表中以原生格式压缩和存储的。

## 语法

```sql
FUSE_ENCODING('<database_name>', '<table_name>', '<column_name>')
```

该函数返回一个结果集，包含以下列：

| 列名              | 数据类型         | 描述                                                                                                                                                                              |
|-------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| VALIDITY_SIZE     | Nullable(UInt32) | 指示列中每一行是否有非空值的位图值的大小。该位图用于跟踪列数据中空值的存在或缺失。 |
| COMPRESSED_SIZE   | UInt32           | 列数据压缩后的大小。                                                                                                                                           |
| UNCOMPRESSED_SIZE | UInt32           | 应用编码前的列数据大小。                                                                                                                                    |
| LEVEL_ONE         | String           | 应用于列的主要或初始编码。                                                                                                                                   |
| LEVEL_TWO         | Nullable(String) | 在初始编码之后应用于列的次要或递归编码方法。                                                                                               |

## 示例

```sql
-- 创建一个包含整数列 'c' 的表，并应用 'Lz4' 压缩
CREATE TABLE t(c INT) STORAGE_FORMAT = 'native' COMPRESSION = 'lz4';

-- 向表中插入数据。
INSERT INTO t SELECT number FROM numbers(2048);

-- 分析表 't' 中列 'c' 的编码
SELECT LEVEL_ONE, LEVEL_TWO, COUNT(*) 
FROM FUSE_ENCODING('default', 't', 'c') 
GROUP BY LEVEL_ONE, LEVEL_TWO;

level_one   |level_two|count(*)|
------------+---------+--------+
DeltaBitpack|         |       1|

-- 向表 't' 插入 2,048 行值为 1 的数据
INSERT INTO t (c)
SELECT 1
FROM numbers(2048);

SELECT LEVEL_ONE, LEVEL_TWO, COUNT(*) 
FROM FUSE_ENCODING('default', 't', 'c') 
GROUP BY LEVEL_ONE, LEVEL_TWO;

level_one   |level_two|count(*)|
------------+---------+--------+
OneValue    |         |       1|
DeltaBitpack|         |       1|
```