---
title: Information_Schema 表
---

## 信息模式（Information Schema）

| 表                                        | 描述                                    |
|----------------------------------------------|------------------------------------------------|
| [tables](information-schema-tables.md)       | 用于表的 ANSI SQL 标准元数据视图。    |
| [schemata](information-schema-schemata.md) | 用于数据库的 ANSI SQL 标准元数据视图。 |
| [views](information-schema-views.md)         | 用于视图（View）的 ANSI SQL 标准元数据视图。     |
| [keywords](information-schema-keywords.md)   | 用于关键字的 ANSI SQL 标准元数据视图。  |
| [columns](information-schema-columns.md)     | 用于列的 ANSI SQL 标准元数据视图。   |


```sql
SHOW VIEWS FROM INFORMATION_SCHEMA;
╭─────────────────────────────╮
│ Views_in_information_schema │
│            String           │
├─────────────────────────────┤
│ columns                     │
│ key_column_usage            │
│ keywords                    │
│ schemata                    │
│ statistics                  │
│ tables                      │
│ views                       │
╰─────────────────────────────╯
```