---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Databend 中的 `REFRESH VIRTUAL COLUMN` 命令用于显式触发现有表的 virtual column 的创建。虽然 Databend 会自动管理新数据的 virtual column，但在某些特定情况下，需要手动刷新才能充分利用此功能。

## 何时使用 `REFRESH VIRTUAL COLUMN`

- **在启用功能之前已存在的表：** 如果你的表包含在启用 virtual column 功能*之前*（或在升级到具有自动 virtual column 创建的版本之前）创建的 `VARIANT` 数据，则需要刷新 virtual column 以启用查询加速。Databend 不会自动为这些表中已存在的数据创建 virtual column。
- **禁用写入时自动刷新：** 如果在数据摄取期间将 `enable_refresh_virtual_column_after_write` 设置为 `0`（禁用），则 Databend 将*不会*在写入数据时自动创建 virtual column。在这种情况下，如果希望从性能改进中受益，则必须在加载数据后手动刷新 virtual column。

## 语法

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## 示例

此示例刷新名为“test”的表的 virtual column：

```sql
SET enable_experimental_virtual_column=1;

SET enable_refresh_virtual_column_after_write=0;

CREATE TABLE test(id int, val variant);

INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend"}'
  ),
  (
    2,
    '{"id":2,"name":"databricks"}'
  );

REFRESH VIRTUAL COLUMN FOR test;

SHOW VIRTUAL COLUMNS WHERE table = 'test';
╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │ virtual_column_name │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │        String       │        String       │
├──────────┼────────┼───────────────┼───────────────────┼─────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']              │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']            │ String              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯
```