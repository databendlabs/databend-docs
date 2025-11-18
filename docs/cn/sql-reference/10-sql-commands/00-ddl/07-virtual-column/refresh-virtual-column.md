---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.832"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Databend 中的 `REFRESH VIRTUAL COLUMN` 命令用于显式触发现有表的 virtual column 的创建。虽然 Databend 会自动管理新数据的 virtual column，但在某些特定情况下，需要手动刷新才能充分利用此功能。

虚拟列自 v1.2.832 起默认启用。

## 何时使用 `REFRESH VIRTUAL COLUMN`

- **在启用功能之前已存在的表：** 如果你的表包含在启用 virtual column 功能*之前*（或在升级到具有自动 virtual column 创建的版本之前）创建的 `VARIANT` 数据，则需要刷新 virtual column 以启用查询加速。Databend 不会自动为这些表中已存在的数据创建 virtual column。

## 语法

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## 示例

此示例刷新名为“test”的表的 virtual column：

```sql
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

SHOW VIRTUAL COLUMNS WHERE table = 'test' AND database = 'default';
╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │ virtual_column_name │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │        String       │        String       │
├──────────┼────────┼───────────────┼───────────────────┼─────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']              │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']            │ String              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯
```
