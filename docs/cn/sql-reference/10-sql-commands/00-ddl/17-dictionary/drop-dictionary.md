---
title: DROP DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.636"/>

移除指定的字典。

## 语法

```sql
DROP DICTIONARY [ IF EXISTS ] <dictionary_name>
```

## 示例

以下示例移除 `courses_dict` 字典：

```sql
DROP DICTIONARY courses_dict;
```