---
title: SETTINGS 子句
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.652"/>

SETTINGS 子句用于配置影响其前置 SQL 语句执行行为的特定设置。要查看 Databend 中可用的设置及其值，请使用 [SHOW SETTINGS](../50-administration-cmds/03-show-settings.md)。

另请参阅: [SET](../50-administration-cmds/02-set-global.md)

## 语法

```sql
SETTINGS ( <setting> = <value> [, <setting> = <value>, ...] ) <statement>
```

## 支持的语句

SETTINGS 子句可以与以下 SQL 语句一起使用:

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

此示例演示了如何使用 SETTINGS 子句在 SELECT 查询中调整时区参数，从而影响 `now()` 的显示结果:

```sql
-- 当未设置时区时，Databend 默认使用 UTC，因此 now() 返回当前 UTC 时间戳
SELECT timezone(), now();

┌─────────────────────────────────────────┐
│ timezone() │            now()           │
│   String   │          Timestamp         │
├────────────┼────────────────────────────┤
│ UTC        │ 2024-11-04 19:42:28.424925 │
└─────────────────────────────────────────┘

-- 通过将时区设置为 Asia/Shanghai，now() 函数返回上海当地时间，比 UTC 早 8 小时。
SETTINGS (timezone = 'Asia/Shanghai') SELECT timezone(), now();

┌────────────────────────────────────────────┐
│   timezone()  │            now()           │
├───────────────┼────────────────────────────┤
│ Asia/Shanghai │ 2024-11-05 03:42:42.209404 │
└────────────────────────────────────────────┘

-- 将时区设置为 America/Toronto 会将 now() 输出调整为多伦多当地时间，反映东部时区 (UTC-5 或夏令时期间的 UTC-4)。
SETTINGS (timezone = 'America/Toronto') SELECT timezone(), now();

┌──────────────────────────────────────────────┐
│    timezone()   │            now()           │
│      String     │          Timestamp         │
├─────────────────┼────────────────────────────┤
│ America/Toronto │ 2024-11-04 14:42:48.353577 │
└──────────────────────────────────────────────┘
```

此示例演示了如何使用 date_format_style 设置在 MySQL 和 Oracle 日期格式化样式之间切换:

```sql
-- 默认 MySQL 样式日期格式化
SELECT to_string('2024-04-05'::DATE, '%b');

┌────────────────────────────────┐
│ to_string('2024-04-05', '%b')  │
├────────────────────────────────┤
│ Apr                            │
└────────────────────────────────┘

-- Oracle 样式日期格式化
SETTINGS (date_format_style = 'Oracle') SELECT to_string('2024-04-05'::DATE, 'MON');

┌────────────────────────────────┐
│ to_string('2024-04-05', 'MON') │
├────────────────────────────────┤
│ Apr                            │
└────────────────────────────────┘
```

此示例显示了 week_start 设置如何影响与周相关的日期函数:

```sql
-- 默认 week_start = 1 (周一作为一周的第一天)
SELECT date_trunc(WEEK, to_date('2024-04-03'));  -- 周三

┌────────────────────────────────────────┐
│ date_trunc(WEEK, to_date('2024-04-03')) │
├────────────────────────────────────────┤
│ 2024-04-01                             │
└────────────────────────────────────────┘

-- 设置 week_start = 0 (周日作为一周的第一天)
SETTINGS (week_start = 0) SELECT date_trunc(WEEK, to_date('2024-04-03'));  -- 周三

┌────────────────────────────────────────┐
│ date_trunc(WEEK, to_date('2024-04-03')) │
├────────────────────────────────────────┤
│ 2024-03-31                             │
└────────────────────────────────────────┘
```

此示例允许 COPY INTO 操作使用最多 100 个线程进行并行处理:

```sql
SETTINGS (max_threads = 100) COPY INTO ...
```