---
title: DICT_GET
---

<FunctionDescription description="引入或更新版本：v1.2.636"/>

使用提供的键表达式从字典中检索指定属性的值。

## 语法

```sql
DICT_GET([db_name.]<dict_name>, '<attr_name>', <key_expr>)
```

| 参数      | 描述                                                                     |
| --------- | ------------------------------------------------------------------------ |
| dict_name | 字典的名称。                                                             |
| attr_name | 字典中要检索值的属性名称。                                               |
| key_expr  | 用于定位字典中特定条目的键表达式。它代表字典的主键值，以检索对应的数据。 |

## 示例

请参见 [使用示例](/guides/query/dictionary#usage-example).
