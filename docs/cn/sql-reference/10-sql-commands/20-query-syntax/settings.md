---
title: SETTINGS Clause
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

SETTINGS Clause 用于配置影响其前面 SQL 语句执行行为的特定设置。要查看 Databend 中可用的设置及其值，请使用 [SHOW SETTINGS](../50-administration-cmds/03-show-settings.md)。

另请参阅：[SET](../50-administration-cmds/02-set-global.md)

## 语法

```sql
SETTINGS ( <setting> = <value> [, <setting> = <value>, ...] ) <statement>
```

## 支持的语句

SETTINGS Clause 可以与以下 SQL 语句一起使用：

- [SELECT](01-query-select.md)
- [INSERT](../10-dml/dml-insert.md)
- [INSERT (multi-table)](../10-dml/dml-insert-multi.md)
- [MERGE](../10-dml/dml-merge.md)
- [`COPY INTO <table>`](../10-dml/dml-copy-into-table.md)
- [`COPY INTO <location>`](../10-dml/dml-copy-into-location.md)
- [UPDATE](../10-dml/dml-update.md)
- [DELETE](../10-dml/dml-delete-from.md)
- [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md)
- [EXPLAIN](../40-explain-cmds/explain.md)

## 示例

此示例演示了如何使用 SETTINGS Clause 调整 SELECT 查询中的 timezone 参数，从而影响 `now()` 的显示结果：

```sql
-- 当未设置 timezone 时，Databend 默认为 UTC，因此 now() 返回当前的 UTC 时间戳
SELECT timezone(), now();

┌─────────────────────────────────────────┐
│ timezone() │            now()           │
│   String   │          Timestamp         │
├────────────┼────────────────────────────┤
│ UTC        │ 2024-11-04 19:42:28.424925 │
└─────────────────────────────────────────┘

-- 通过将 timezone 设置为 Asia/Shanghai，now() 函数返回上海的本地时间，比 UTC 快 8 小时。
SETTINGS (timezone = 'Asia/Shanghai') SELECT timezone(), now();

┌────────────────────────────────────────────┐
│   timezone()  │            now()           │
├───────────────┼────────────────────────────┤
│ Asia/Shanghai │ 2024-11-05 03:42:42.209404 │
└────────────────────────────────────────────┘

-- 将 timezone 设置为 America/Toronto 会将 now() 输出调整为多伦多的本地时间，反映东部时区（UTC-5 或夏令时期间的 UTC-4）。
SETTINGS (timezone = 'America/Toronto') SELECT timezone(), now();

┌──────────────────────────────────────────────┐
│    timezone()   │            now()           │
│      String     │          Timestamp         │
├─────────────────┼────────────────────────────┤
│ America/Toronto │ 2024-11-04 14:42:48.353577 │
└──────────────────────────────────────────────┘
```

此示例允许 COPY INTO 操作使用最多 100 个线程进行并行处理：

```sql
SETTINGS (max_threads = 100) COPY INTO ...
```