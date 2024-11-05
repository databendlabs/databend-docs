---
title: SET_VAR
---

SET_VAR 用于在单个 SQL 语句中指定优化器提示，从而对特定语句的执行计划进行更精细的控制。这包括：

:::note
SET_VAR 将在未来的版本中被弃用。建议使用 [SETTINGS 子句](../20-query-syntax/settings.md) 替代。
:::

- 临时配置设置，仅影响 SQL 语句执行期间。需要注意的是，使用 SET_VAR 指定的设置仅会影响当前正在执行的语句的结果，不会对整个数据库配置产生持久影响。有关可以使用 SET_VAR 配置的可用设置列表，请参阅 [SHOW SETTINGS](03-show-settings.md)。要了解其工作原理，请参阅以下示例：

    - [示例 1. 临时设置时区](#example-1-temporarily-set-timezone)
    - [示例 2: 控制 COPY INTO 的并行处理](#example-2-control-parallel-processing-for-copy-into)

- 使用标签 *deduplicate_label* 控制 [INSERT](../10-dml/dml-insert.md)、[UPDATE](../10-dml/dml-update.md) 或 [REPLACE](../10-dml/dml-replace.md) 操作的去重行为。对于在 SQL 语句中带有 deduplicate_label 的这些操作，Databend 仅执行第一个语句，后续具有相同 deduplicate_label 值的语句将被忽略，无论其预期的数据修改如何。请注意，一旦设置了 deduplicate_label，它将在 24 小时内保持有效。要了解 deduplicate_label 如何协助去重，请参阅 [示例 3: 设置去重标签](#example-3-set-deduplicate-label)。

另请参阅：
- [SETTINGS 子句](../20-query-syntax/settings.md)
- [SET](02-set-global.md)

## 语法

```sql
/*+ SET_VAR(key=value) SET_VAR(key=value) ... */
```

- 提示必须紧跟在 [SELECT](../20-query-syntax/01-query-select.md)、[INSERT](../10-dml/dml-insert.md)、[UPDATE](../10-dml/dml-update.md)、[REPLACE](../10-dml/dml-replace.md)、[MERGE](../10-dml/dml-merge.md)、[DELETE](../10-dml/dml-delete-from.md) 或 [COPY](../10-dml/dml-copy-into-table.md) (INTO) 关键字之后，这些关键字开始 SQL 语句。
- 一个 SET_VAR 只能包含一个 Key=Value 对，这意味着您只能使用一个 SET_VAR 配置一个设置。但是，您可以使用多个 SET_VAR 提示来配置多个设置。
    - 如果多个 SET_VAR 提示包含相同的键，则将应用第一个 Key=Value 对。
    - 如果键解析或绑定失败，所有提示将被忽略。

## 示例

### 示例 1: 临时设置时区

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
├─────────────────┤
│ America/Toronto │
└─────────────────┘

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

### 示例 2: 控制 COPY INTO 的并行处理

在 Databend 中，*max_threads* 设置指定可以用于执行请求的最大线程数。默认情况下，此值通常设置为与机器上的 CPU 核心数匹配。

当使用 COPY INTO 将数据加载到 Databend 时，您可以通过在 COPY INTO 命令中注入提示并设置 *max_threads* 参数来控制并行处理能力。例如：

```sql
COPY /*+ set_var(max_threads=6) */ INTO mytable FROM @mystage/ pattern='.*[.]parq' FILE_FORMAT=(TYPE=parquet);
```

### 示例 3: 设置去重标签

```sql
CREATE TABLE t1(a Int, b bool);
INSERT /*+ SET_VAR(deduplicate_label='databend') */ INTO t1 (a, b) VALUES(1, false);
SELECT * FROM t1;

a|b|
-+-+
1|0|

UPDATE /*+ SET_VAR(deduplicate_label='databend') */ t1 SET a = 20 WHERE b = false;
SELECT * FROM t1;

a|b|
-+-+
1|0|

REPLACE /*+ SET_VAR(deduplicate_label='databend') */ INTO t1 on(a,b) VALUES(40, false);
SELECT * FROM t1;

a|b|
-+-+
1|0|

MERGE /*+ SET_VAR(deduplicate_label='databend') */ INTO t1 using t2 on t1.a = t2.a when matched then update *;
SELECT * FROM t1;

a|b|
-+-+
1|0|
```