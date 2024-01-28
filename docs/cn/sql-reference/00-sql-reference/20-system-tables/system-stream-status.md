---
title: system.stream_status
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.225"/>

提供有关指定流状态的信息，产生一个单列结果（`has_data`），该结果可以取 `true` 或 `false`：

- `true`：表示流**可能包含**变更数据捕获记录。
- `false`：表示流当前不包含任何变更数据捕获记录。

:::note
结果中的 `true`（`has_data`）并**不**确保一定存在变更数据捕获记录。其他操作，如执行表压缩操作，也可能导致 `true` 值，即使实际上没有变更数据捕获记录。
:::

## 语法

```sql
SELECT * FROM STREAM_STATUS('<stream_name>');
```

## 示例

```sql
-- 创建一个包含列 'c' 的表 't'
CREATE TABLE t (c int);

-- 在表 't' 上创建一个流 's'
CREATE STREAM s ON TABLE t;

-- 检查流 's' 的初始状态
SELECT * FROM STREAM_STATUS('s');

-- 结果应为 'false'，表示最初没有变更数据捕获记录
┌──────────┐
│ has_data │
├──────────┤
│ false    │
└──────────┘

-- 向表 't' 插入一个值
INSERT INTO t VALUES (1);

-- 插入后检查流 's' 的更新状态
SELECT * FROM STREAM_STATUS('s');

-- 结果现在应为 'true'，表示存在变更数据捕获记录
┌──────────┐
│ has_data │
├──────────┤
│ true     │
└──────────┘
```