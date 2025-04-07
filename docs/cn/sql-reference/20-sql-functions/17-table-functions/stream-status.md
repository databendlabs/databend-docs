---
title: STREAM_STATUS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.225"/>

提供关于指定 stream 状态的信息，产生一个单列结果 (`has_data`)，其值可以为 `true` 或 `false`：

- `true`: 表示 stream **可能包含** 变更数据捕获记录。
- `false`: 表示 stream 当前不包含任何变更数据捕获记录。

:::note
结果 (`has_data`) 中存在 `true` **不能** 确保一定存在变更数据捕获记录。其他操作，例如执行表压缩操作，也可能导致 `true` 值，即使没有实际的变更数据捕获记录。
:::

:::note
在任务中使用 `STREAM_STATUS` 时，引用 stream 时必须包含数据库名称（例如，`STREAM_STATUS('mydb.stream_name')`）。
:::

## 语法

```sql
SELECT * FROM STREAM_STATUS('<database_name>.<stream_name>');
-- OR
SELECT * FROM STREAM_STATUS('<stream_name>');  -- 使用当前数据库
```

## 示例

```sql
-- 创建一个包含 'c' 列的表 't'
CREATE TABLE t (c int);

-- 在表 't' 上创建一个 stream 's'
CREATE STREAM s ON TABLE t;

-- 检查 stream 's' 的初始状态
SELECT * FROM STREAM_STATUS('s');

-- 结果应为 'false'，表示最初没有变更数据捕获记录
┌──────────┐
│ has_data │
├──────────┤
│ false    │
└──────────┘

-- 向表 't' 中插入一个值
INSERT INTO t VALUES (1);

-- 检查插入后 stream 's' 的更新状态
SELECT * FROM STREAM_STATUS('s');

-- 结果现在应为 'true'，表示存在变更数据捕获记录
┌──────────┐
│ has_data │
├──────────┤
│ true     │
└──────────┘

-- 指定数据库名称的示例
SELECT * FROM STREAM_STATUS('mydb.s');
```