---
title: SHOW CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

Retrieves and displays the SQL statement used to create a specified dictionary.

## Syntax

```sql
SHOW CREATE DICTIONARY <dictionary_name>
```

## Examples

The following example retrieves the SQL statement for creating the `courses_dict` dictionary:

```sql
SHOW CREATE DICTIONARY courses_dict;

-[ RECORD 1 ]-----------------------------------
       Dictionary: courses_dict
Create Dictionary: CREATE DICTIONARY courses_dict
(
  course_id INT NULL,
  course_name VARCHAR NULL
)
PRIMARY KEY course_id
SOURCE(mysql(db='test' host='localhost' password='[HIDDEN]' port='3306' table='courses' username='root'))
```