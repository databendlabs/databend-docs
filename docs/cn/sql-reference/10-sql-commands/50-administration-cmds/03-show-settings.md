---
title: SHOW SETTINGS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.314"/>

Databend 提供了多种系统设置，使您能够控制 Databend 的工作方式。此命令显示可用系统设置的当前值和默认值，以及[设置级别](#setting-levels)。要更新设置，请使用 [SET](02-set-global.md) 或 [UNSET](02-unset.md) 命令。

- 某些 Databend 行为无法通过系统设置更改；您在使用 Databend 时必须考虑这些行为。例如，
    - Databend 将字符串编码为 UTF-8 字符集。
    - Databend 使用基于 1 的数组编号约定。
- Databend 将系统设置存储在系统表 [system.settings](../../00-sql-reference/20-system-tables/system-settings.md) 中。

## 语法

```sql
SHOW SETTINGS [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 设置级别

每个 Databend 设置都有一个级别，可以是 Global、Default 或 Session。下表说明了每个级别之间的区别：

|   级别    |   描述                                                                                                                                                                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|   Global   |   具有此级别的设置会写入元数据服务，并影响同一租户中的所有集群。此级别的更改具有全局影响，适用于由多个集群共享的整个数据库环境。                                                |
|   Default  |   具有此级别的设置通过 `databend-query.toml` 配置文件进行配置。此级别的更改仅影响单个查询实例，并且特定于配置文件。此级别为单个查询实例提供默认设置。  |
|   Session  |   具有此级别的设置仅限于单个请求或会话。它们的范围最窄，仅适用于当前正在进行的特定会话或请求，提供了一种按会话自定义设置的方式。                                       |

## 示例

:::note
由于 Databend 会不时更新系统设置，此示例可能无法显示最新的结果。要查看 Databend 中的最新系统设置，请在您的 Databend 实例中执行 `SHOW SETTINGS;`。
:::

```sql
SHOW SETTINGS LIMIT 5;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     名称                    │  值  │ 默认值 │   范围   │   级别   │                                                                     描述                                                                   │  类型  │
├─────────────────────────────────────────────┼──────┼────────┼──────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────┤
│ acquire_lock_timeout                        │ 15   │ 15     │ None     │ DEFAULT  │ 设置获取锁的最大超时时间（秒）。                                                                                            │ UInt64 │
│ aggregate_spilling_bytes_threshold_per_proc │ 0    │ 0      │ None     │ DEFAULT  │ 设置聚合器在执行查询期间在将数据溢出到存储之前可以使用的最大内存量（字节）。                      │ UInt64 │
│ aggregate_spilling_memory_ratio             │ 0    │ 0      │ [0, 100] │ DEFAULT  │ 设置聚合器在执行查询期间在将数据溢出到存储之前可以使用的最大内存比例（字节）。                          │ UInt64 │
│ auto_compaction_imperfect_blocks_threshold  │ 50   │ 50     │ None     │ DEFAULT  │ 触发自动压缩的阈值。当写入操作后快照中的不完美块数量超过此值时，将触发自动压缩。 │ UInt64 │
│ collation                                   │ utf8 │ utf8   │ ["utf8"] │ DEFAULT  │ 设置字符排序规则。可用值包括 "utf8"。                                                                                     │ String │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```