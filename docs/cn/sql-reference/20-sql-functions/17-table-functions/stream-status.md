---
title: STREAM_STATUS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.225"/>

提供指定流的状态信息，返回一个单列结果（`has_data`），其值可以是 `true` 或 `false`：

- `true`：表示流**可能包含**变更数据捕获记录。
- `false`：表示流当前不包含任何变更数据捕获记录。

:::note
结果中的 `true`（`has_data`）**并不**确保一定存在变更数据捕获记录。其他操作，例如执行表压缩操作，也可能导致 `true` 值，即使实际上没有变更数据捕获记录。

早于 `v1.2.933-nightly` 的 query，在查询后续版本创建的 stream 状态时，也可能误报 `true`。这是因为创建 stream 时自动开启了源表的 change tracking。此时读取仍返回零行，依赖该状态的 task 可能空跑。
:::

:::note
引用流时可以只指定流名称，例如 `STREAM_STATUS('stream_name')`。省略数据库名称时，函数使用当前数据库。也可以显式指定数据库，例如 `STREAM_STATUS('mydb.stream_name')`。
:::

## 语法

```sql
SELECT * FROM STREAM_STATUS('<database_name>.<stream_name>');
-- 或
SELECT * FROM STREAM_STATUS('<stream_name>');  -- 使用当前数据库
```

## 参数

参数是包含流名称的字符串。使用单引号包裹字符串，例如 `'s'` 或 `'mydb.s'`。

- 不要用双引号或反引号替代单引号。例如，`"mydb.s"`、`"mydb"."s"` 和 `` `mydb`.`s` `` 是 SQL 标识符，不是字符串。
- 不要在字符串内部嵌套标识符引号。例如，`'"mydb"."s"'` 和 `` '`mydb`.`s`' `` 不等同于 `'mydb.s'`。函数会把内部引号当作名称的一部分。

这些规则同样适用于任务 `WHEN` 条件中的 `STREAM_STATUS`。条件保存成功不代表字符串引用了有效的流。请使用 `SELECT * FROM STREAM_STATUS('mydb.s');` 验证名称。

## 示例

```sql
-- 创建一个带有列 'c' 的表 't'
CREATE TABLE t (c int);

-- 在表 't' 上创建一个流 's'
CREATE STREAM s ON TABLE t;

-- 检查流 's' 的初始状态
SELECT * FROM STREAM_STATUS('s');

-- 结果应为 'false'，表示初始时没有变更数据捕获记录
┌──────────┐
│ has_data │
├──────────┤
│ false    │
└──────────┘

-- 向表 't' 中插入一个值
INSERT INTO t VALUES (1);

-- 插入后检查流 's' 的更新状态
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