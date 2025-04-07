---
title: DROP DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

删除指定的 dictionary。

## 语法

```sql
DROP DICTIONARY [ IF EXISTS ] <dictionary_name>
```

## 示例

以下示例删除 `courses_dict` dictionary：

```sql
DROP DICTIONARY courses_dict;
```