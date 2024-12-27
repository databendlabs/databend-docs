---
title: ALTER VIRTUAL COLUMN
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

修改表的虚拟列。请注意，修改表的虚拟列后，请使用 [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) 命令刷新它们。

## 语法

```sql
ALTER VIRTUAL COLUMN [ IF EXISTS ] ( <virtual_column_1>, <virtual_column_2>, ... ) FOR <table>
```

## 示例

```sql
-- 创建一个名为 'test' 的表，包含 'id' 和 'val' 列，类型为 Variant。
CREATE TABLE test(id int, val variant);

-- 向 'test' 表中插入一条包含 Variant 数据的示例记录。
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

SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘


-- 修改虚拟列，仅包含 "val ['name']"

ALTER VIRTUAL COLUMN (
  val ['name']
) FOR test;

SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────┐
│ database │  table │ virtual_columns │
├──────────┼────────┼─────────────────┤
│ default  │ test   │ val['name']     │
└─────────────────────────────────────┘

REFRESH VIRTUAL COLUMN FOR test;
```