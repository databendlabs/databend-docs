---
title: SET_VAR
---

使用 `SET_VAR` 可以为单条 SQL 语句临时指定设置。

:::note
SET_VAR 将在即将发布的版本中弃用。请考虑改用 [SETTINGS Clause](../20-query-syntax/settings.md)。
:::

该设置不会更改数据库配置。可用设置请参阅 [SHOW SETTINGS](03-show-settings.md)。用法请参阅以下示例：

- [示例 1：临时设置时区](#example-1-temporarily-set-timezone)
- [示例 2：控制 COPY INTO 的并行处理](#example-2-control-parallel-processing-for-copy-into)

另请参阅：
- [SETTINGS Clause](../20-query-syntax/settings.md)
- [SET](02-set-global.md)

## 语法

```sql
/*+ SET_VAR(key=value) SET_VAR(key=value) ... */
```

- 该提示必须紧跟在开始 SQL 语句的 [SELECT](../20-query-syntax/01-query-select.md)、[INSERT](../10-dml/dml-insert.md)、[UPDATE](../10-dml/dml-update.md)、[REPLACE](../10-dml/dml-replace.md)、[MERGE](../10-dml/dml-merge.md)、[DELETE](../10-dml/dml-delete-from.md) 或 [COPY](../10-dml/dml-copy-into-table.md) (INTO) 关键字之后。
- 一个 SET_VAR 只能包含一个 Key=Value 对，这意味着您只能使用一个 SET_VAR 配置一个设置。但是，您可以使用多个 SET_VAR 提示来配置多个设置。
    - 如果多个 SET_VAR 提示包含相同的键，则将应用第一个 Key=Value 对。
    - 如果某个键无法解析或绑定，则所有提示都将被忽略。

## 示例

### 示例 1：临时设置时区

```sql
root@localhost> SELECT TIMEZONE();

SELECT
  TIMEZONE();

┌────────────┐
│ timezone() │
│   String   │
├────────────┤
│ UTC        │
└────────────┘

1 row in 0.011 sec. Processed 1 rows, 1B (91.23 rows/s, 91B/s)

root@localhost> SELECT /*+SET_VAR(timezone='America/Toronto') */ TIMEZONE();

SELECT
  /*+SET_VAR(timezone='America/Toronto') */
  TIMEZONE();

┌─────────────────┐
│    timezone()   │
│      String     │
├────────────┤
│ America/Toronto │
└────────────┘

1 row in 0.023 sec. Processed 1 rows, 1B (43.99 rows/s, 43B/s)

root@localhost> SELECT TIMEZONE();

SELECT
  TIMEZONE();

┌────────────┐
│ timezone() │
│   String   │
├────────────┤
│ UTC        │
└────────────┘

1 row in 0.010 sec. Processed 1 rows, 1B (104.34 rows/s, 104B/s)
```
### 示例 2：控制 COPY INTO 的并行处理

在 Databend 中，*max_threads* 设置指定可用于执行请求的最大线程数。默认情况下，此值通常设置为与计算机上可用的 CPU 核心数相匹配。

当使用 COPY INTO 将数据加载到 Databend 中时，您可以通过将提示注入到 COPY INTO 命令并设置 *max_threads* 参数来控制并行处理能力。例如：

```sql
COPY /*+ set_var(max_threads=6) */ INTO mytable FROM @mystage/ pattern='.*[.]parq' FILE_FORMAT=(TYPE=parquet);
```
