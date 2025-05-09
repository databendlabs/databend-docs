---
title: SHOW SETTINGS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.314"/>

Databend 提供了多种系统设置，使您可以控制 Databend 的工作方式。此命令显示当前值和默认值，以及可用系统设置的 [设置级别](#setting-levels)。要更新设置，请使用 [SET](02-set-global.md) 或 [UNSET](02-unset.md) 命令。

- 某些 Databend 行为无法通过系统设置进行更改；在使用 Databend 时，您必须考虑到这些行为。例如，
    - Databend 将字符串编码为 UTF-8 字符集。
    - Databend 对数组使用从 1 开始的编号约定。
- Databend 将系统设置存储在系统表 [system.settings](../../00-sql-reference/31-system-tables/system-settings.md) 中。

## 语法

```sql
SHOW SETTINGS [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 设置级别

每个 Databend 设置都带有一个级别，可以是 Global、Default 或 Session。下表说明了每个级别之间的区别：

|   Level    |   Description                                                                                                                                                                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|   Global   |   具有此级别的设置将写入元数据服务，并影响同一租户中的所有计算集群。此级别的更改具有全局影响，并适用于多个计算集群共享的整个数据库环境。                                                                                                                                             |
|   Default  |   具有此级别的设置通过 `databend-query.toml` 配置文件进行配置。此级别的更改仅影响单个查询实例，并且特定于配置文件。此级别为单个查询实例提供默认设置。  |
|   Session  |   具有此级别的设置仅限于单个请求或会话。它们具有最窄的范围，并且仅适用于正在进行的特定会话或请求，从而提供了一种在每个会话的基础上自定义设置的方法。                                       |

## 示例

:::note
由于 Databend 会不时更新系统设置，因此此示例可能不会显示最新的结果。要查看 Databend 中的最新系统设置，请在 Databend 实例中执行 `SHOW SETTINGS;`。
:::

```sql
SHOW SETTINGS LIMIT 5;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     name                    │  value │ default │   range  │  level  │                                                                     description                                                                    │  type  │
├─────────────────────────────────────────────┼────────┼─────────┼──────────┼─────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────┤
│ acquire_lock_timeout                        │ 15     │ 15      │ None     │ DEFAULT │ Sets the maximum timeout in seconds for acquire a lock.                                                                                            │ UInt64 │
│ aggregate_spilling_bytes_threshold_per_proc │ 0      │ 0       │ None     │ DEFAULT │ Sets the maximum amount of memory in bytes that an aggregator can use before spilling data to storage during query execution.                      │ UInt64 │
│ aggregate_spilling_memory_ratio             │ 0      │ 0       │ [0, 100] │ DEFAULT │ Sets the maximum memory ratio in bytes that an aggregator can use before spilling data to storage during query execution.                          │ UInt64 │
│ auto_compaction_imperfect_blocks_threshold  │ 50     │ 50      │ None     │ DEFAULT │ Threshold for triggering auto compaction. This occurs when the number of imperfect blocks in a snapshot exceeds this value after write operations. │ UInt64 │
│ collation                                   │ utf8   │ utf8    │ ["utf8"] │ DEFAULT │ Sets the character collation. Available values include "utf8".                                                                                     │ String │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```