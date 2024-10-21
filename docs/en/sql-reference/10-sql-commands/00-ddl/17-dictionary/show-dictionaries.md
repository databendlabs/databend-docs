---
title: SHOW DICTIONARIES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.646"/>

Lists dictionaries in a specified database, displaying their names, column details, and source information.

## Syntax

```sql
SHOW DICTIONARIES [FROM ｜ IN <database_name>] [LIKE '<pattern>'] [WHERE <condition>]
```

## Examples

This example lists all dictionaries in the current database:

```sql
SHOW DICTIONARIES;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ database │ dictionary │   key_names   │   key_types   │         attribute_names         │       attribute_types       │                                      source                                      │ comment │
├──────────┼────────────┼───────────────┼───────────────┼─────────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼─────────┤
│ default  │ order_dict │ ['order_id']  │ ['INT NULL']  │ ['customer_name','order_total'] │ ['VARCHAR NULL','INT NULL'] │ mysql(db=dict host=mysql password=[hidden] port=3306 table=orders username=root) │         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This example uses the LIKE clause to filter dictionaries whose names start with 'order':

```sql
SHOW DICTIONARIES LIKE 'order%';

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ database │ dictionary │   key_names   │   key_types   │         attribute_names         │       attribute_types       │                                      source                                      │ comment │
├──────────┼────────────┼───────────────┼───────────────┼─────────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼─────────┤
│ default  │ order_dict │ ['order_id']  │ ['INT NULL']  │ ['customer_name','order_total'] │ ['VARCHAR NULL','INT NULL'] │ mysql(db=dict host=mysql password=[hidden] port=3306 table=orders username=root) │         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This example uses the WHERE clause to show dictionaries with the exact name 'order_dict':

```sql
SHOW DICTIONARIES WHERE name = 'order_dict';

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ database │ dictionary │   key_names   │   key_types   │         attribute_names         │       attribute_types       │                                      source                                      │ comment │
├──────────┼────────────┼───────────────┼───────────────┼─────────────────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼─────────┤
│ default  │ order_dict │ ['order_id']  │ ['INT NULL']  │ ['customer_name','order_total'] │ ['VARCHAR NULL','INT NULL'] │ mysql(db=dict host=mysql password=[hidden] port=3306 table=orders username=root) │         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```