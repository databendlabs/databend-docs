---
title: FUSE_ENCODING
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.162"/>

返回应用于表中特定列的编码类型。它可以帮助您了解数据在表中的原生格式中是如何被压缩和存储的。

## 语法

```sql
FUSE_ENCODING('<database_name>', '<table_name>', '<column_name>')
```

该函数返回一个包含以下列的结果集：

| 列                | 数据类型         | 描述                                                                                                                                                                                 |
|-------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| VALIDITY_SIZE     | Nullable(UInt32)  | 一个 bitmap 值的大小，用于指示列中的每一行是否具有非空值。此 bitmap 用于跟踪列数据中 null 值的存在与否。                                                                                                 |
| COMPRESSED_SIZE   | UInt32            | 压缩后列数据的大小。                                                                                                                                                               |
| UNCOMPRESSED_SIZE | UInt32            | 应用编码之前列数据的大小。                                                                                                                                                             |
| LEVEL_ONE         | String            | 应用于列的主要或初始编码。                                                                                                                                                           |
| LEVEL_TWO         | Nullable(String)  | 在初始编码之后应用于列的辅助或递归编码方法。                                                                                                                                                   |

## 示例

```sql
-- 创建一个包含整数列 'c' 的表，并应用 'Lz4' 压缩
CREATE TABLE t(c INT) STORAGE_FORMAT = 'native' COMPRESSION = 'lz4';

-- 将数据插入表中。
INSERT INTO t SELECT number FROM numbers(2048);

-- 分析表 't' 中列 'c' 的编码
SELECT LEVEL_ONE, LEVEL_TWO, COUNT(*) 
FROM FUSE_ENCODING('default', 't', 'c') 
GROUP BY LEVEL_ONE, LEVEL_TWO;

level_one   |level_two|count(*)|
------------+---------+--------+
DeltaBitpack|         |       1|

--  将 2,048 行值为 1 的数据插入表 't'
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