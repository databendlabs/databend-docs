---
title: 字典函数（Dictionary Functions）
---

本节提供 Databend 中字典函数（Dictionary Functions）的参考信息。字典函数允许您直接从 MySQL 和 Redis 等外部数据源实时查询数据，无需 ETL 过程。

## 字典函数的优势

- **实时数据访问**：直接查询外部数据源，无需数据同步
- **数据一致性**：确保 Databend 与外部系统之间的数据一致性
- **性能提升**：减少对频繁访问参考数据的查询延迟
- **简化数据管理**：消除对复杂 ETL 管道的需求

## 可用的字典函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [DICT_GET](dict-get) | 使用键从字典中检索值 | `DICT_GET(my_dict, 'attribute', key_value)` |