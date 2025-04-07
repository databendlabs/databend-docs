---
title: SHOW CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

检索并显示用于创建指定 dictionary 的 SQL 语句。

## 语法

```sql
SHOW CREATE DICTIONARY <dictionary_name>
```

## 示例

以下示例检索用于创建 `courses_dict` dictionary 的 SQL 语句：

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