---
title: 创建虚拟列
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='虚拟列'/>

为表创建虚拟列。请注意，虚拟列专门支持 [FUSE 引擎](../../../00-sql-reference/30-table-engines/00-fuse.md)，旨在与 [Variant](../../../00-sql-reference/10-data-types/43-data-type-variant.md) 数据类型兼容，并使用 [JSON PATH](../../20-query-syntax/20-query-json-path.md) 查询语法来定义列。

请注意，在为已包含 Variant 数据的表创建虚拟列后，需要使用 [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) 命令刷新虚拟列。

## 语法

```sql
CREATE VIRTUAL COLUMN [IF NOT EXISTS] (<virtual_column_1>, <virtual_column_2>, ...) FOR <table>
```

## 示例

此示例为名为 'test' 的表创建虚拟列：

```sql
-- 创建一个名为 'test' 的表，包含类型为 Variant 的 'id' 和 'val' 列。
CREATE TABLE test(id int, val variant);

-- 向 'test' 表插入一条包含 Variant 数据的样本记录。
INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend","tags":["powerful","fast"],"pricings":[{"type":"Standard","price":"Pay as you go"},{"type":"Enterprise","price":"Custom"}]}'
  );

-- 为 'val' 列中的特定元素创建虚拟列。
CREATE VIRTUAL COLUMN (
  val ['name'],                 -- 提取 'name' 字段。
  val ['tags'] [0],             -- 提取 'tags' 数组中的第一个元素。
  val ['pricings'] [0] ['type'] -- 提取 'pricings' 数组中第一个定价的 'type' 字段。
) FOR test;

REFRESH VIRTUAL COLUMN FOR test;
```