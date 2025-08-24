---
title: DICT_GET
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.636"/>

使用提供的键表达式（Key Expression）从字典（Dictionary）中检索指定属性（Attribute）的值。

## 语法

```sql
DICT_GET([db_name.]<dict_name>, '<attr_name>', <key_expr>)
```

| 参数 | 描述 |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dict_name | 字典（Dictionary）的名称。 |
| attr_name | 要检索其值的字典（Dictionary）中的属性（Attribute）名称。 |
| key_expr | 用于在字典（Dictionary）中定位特定条目的键表达式（Key Expression）。它代表字典（Dictionary）主键（Primary Key）的值，用于检索相应的数据。 |

## 示例

此示例演示如何使用 DICT_GET 从字典（Dictionary）中检索值：

```sql
-- 假设我们有一个名为 'user_info' 的字典，其中 'user_id' 是键，'name' 是一个属性
SELECT DICT_GET('user_info', 'name', 12345);
```