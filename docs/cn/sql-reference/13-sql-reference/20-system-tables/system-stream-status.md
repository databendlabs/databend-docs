---
title: system.stream_status
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.225"/>

提供有关指定流的状态信息，返回一个单列结果（`has_data`），其值可以是 `true` 或 `false`：

- `true`：表示该流 **可能包含** 变更数据捕获记录。
- `false`：表示该流当前不包含任何变更数据捕获记录。

:::note
结果（`has_data`）中的 `true` 并 **不能** 确保变更数据捕获记录的确切存在。其他操作，例如执行表压缩操作，即使实际上没有变更数据捕获记录，也可能导致结果为 `true`。
:::

## 语法

```sql
SELECT * FROM STREAM_STATUS('<stream_name>');
```

## 示例

```sql
-- Create a table 't' with a column 'c'
CREATE TABLE t (c int);

-- Create a stream 's' on the table 't'
CREATE STREAM s ON TABLE t;

-- Check the initial status of the stream 's'
SELECT * FROM STREAM_STATUS('s');

-- The result should be 'false' indicating no change data capture records initially
┌──────────┐
│ has_data │
├──────────┤
│ false    │
└──────────┘

-- Insert a value into the table 't'
INSERT INTO t VALUES (1);

-- Check the updated status of the stream 's' after the insertion
SELECT * FROM STREAM_STATUS('s');

-- The result should now be 'true' indicating the presence of change data capture records
┌──────────┐
│ has_data │
├──────────┤
│ true     │
└──────────┘
```