---
title: DROP TAG
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.863"/>

删除 Tag。如果 Tag 仍被任何对象引用，则无法删除——必须先从所有对象上取消该 Tag 或删除这些对象。

另请参阅：[CREATE TAG](01-ddl-create-tag.md)、[SET TAG / UNSET TAG](04-ddl-set-tag.md)

## 语法

```sql
DROP TAG [ IF EXISTS ] <tag_name>
```

## 示例

```sql
-- 如果 Tag 仍在使用中则会失败
DROP TAG env;
-- Error: Tag 'env' still has references

-- 先移除 Tag 引用
ALTER TABLE my_table UNSET TAG env;

-- 现在可以成功删除
DROP TAG env;
```

仅在 Tag 存在时删除：

```sql
DROP TAG IF EXISTS env;
```
