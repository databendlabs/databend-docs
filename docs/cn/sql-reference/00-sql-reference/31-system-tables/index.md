---
title: 系统表
---

# 系统表

Databend 提供了一组系统表，其中包含有关 Databend 部署、数据库、表、查询和系统性能的元数据。这些表是只读的，并由系统自动更新。

系统表位于 `system` 模式（schema）中，可以使用标准 SQL 进行查询。它们为监控、故障排查和了解 Databend 环境提供了有价值的信息。

## 可用的系统表

### 数据库和表元数据

| 表                                                             | 描述                                                                                       |
|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| [system.tables](system-tables.md)                                 | 提供所有表的元数据信息，包括属性、创建时间、大小等。 |
| [system.tables_with_history](system-tables-with-history.md)       | 提供表的历史元数据信息，包括已删除的表。                    |
| [system.databases](system-databases.md)                           | 包含系统中所有数据库的信息。                                           |
| [system.views](system-views.md)                                   | 包含系统中所有视图（View）的信息。                                               |
| [system.databases_with_history](system-databases-with-history.md) | 包含数据库的历史信息，包括已删除的数据库。                     |
| [system.columns](system-columns.md)                               | 提供所有表中列的信息。                                                 |
| [system.indexes](system-indexes.md)                               | 包含表索引（Index）的信息。                                                         |
| [system.virtual_columns](system-virtual-columns.md)               | 列出系统中可用的虚拟列 (Virtual Column)。                                                    |

### 查询与性能

| 表 | 描述 |
|-------|-------------|
| [system.query_log](system-query-log.md) | 包含有关已执行查询（Query）的信息，包括性能指标。 |
| [system.metrics](system-metrics.md) | 包含有关系统指标事件的信息。 |
| [system.query_cache](system-query-cache.md) | 提供有关查询缓存的信息。 |
| [system.locks](system-locks.md) | 包含系统中已获取锁的信息。 |

### 函数与设置

| 表 | 描述 |
|-------|-------------|
| [system.functions](system-functions.md) | 列出所有可用的内置函数。 |
| [system.table_functions](system-table-functions.md) | 列出所有可用的表函数 (Table Function)。 |
| [system.user_functions](system-user-functions.md) | 包含有关用户定义函数 (User-Defined Function) 的信息。 |
| [system.settings](system-settings.md) | 包含有关系统设置的信息。 |
| [system.configs](system-configs.md) | 包含 Databend 部署的配置信息。 |

### 系统信息

| 表 | 描述 |
|-------|-------------|
| [system.build_options](system-build-options.md) | 包含用于编译 Databend 的构建选项 (Build Option) 信息。 |
| [system.clusters](system-clusters.md) | 包含系统中集群的信息。 |
| [system.contributors](system-contributors.md) | 列出 Databend 项目的贡献者。 |
| [system.credits](system-credits.md) | 包含 Databend 中使用的第三方库的信息。 |
| [system.caches](system-caches.md) | 提供有关系统缓存的信息。 |

### 实用工具表

| 表 | 描述 |
|-------|-------------|
| [system.numbers](system-numbers.md) | 一个包含单列整数（从 0 开始）的表，可用于生成测试数据。 |
| [system.streams](system-streams.md) | 包含系统中流（stream）的信息。 |
| [system.temp_tables](system-temp-tables.md) | 包含有关临时表的信息。 |
| [system.temp_files](system-temp-files.md) | 包含有关临时文件的信息。 |