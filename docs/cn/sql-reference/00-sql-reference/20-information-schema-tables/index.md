---
title: Information_Schema 表
---

## Information Schema

| 表                                           | 描述                                   |
| -------------------------------------------- | -------------------------------------- |
| [tables](information-schema-tables.md)       | ANSI SQL 标准的表元数据视图。          |
| [schemata](information-schema-schemata.md)   | ANSI SQL 标准的数据库元数据视图。      |
| [views](information-schema-views.md)         | ANSI SQL 标准的视图元数据视图。        |
| [keywords](information-schema-keywords.md)   | ANSI SQL 标准的关键字元数据视图。      |
| [columns](information-schema-columns.md)     | ANSI SQL 标准的列元数据视图。          |

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