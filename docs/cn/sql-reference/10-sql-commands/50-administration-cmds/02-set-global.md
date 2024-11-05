---
title: SET
---

更改当前会话的系统设置值。要显示所有当前设置，请使用 [SHOW SETTINGS](03-show-settings.md)。

另请参阅：
- [SETTINGS 子句](../20-query-syntax/settings.md)
- [SET_VAR](03-set-var.md)
- [UNSET](02-unset.md)

## 语法

```sql
SET [ SESSION | GLOBAL ] <setting_name> = <new_value>
```

| 参数      | 描述                                                                                                                                                                                     |
|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SESSION   | 在会话级别应用设置更改。如果省略，默认应用于会话级别。                                                                                                                                     |
| GLOBAL    | 在全局级别应用设置更改，而不仅仅是当前会话。有关设置级别的更多信息，请参阅 [设置级别](03-show-settings.md#setting-levels)。 |

## 示例

以下示例将 `max_memory_usage` 设置为 `4 GB`：

```sql
SET max_memory_usage = 1024*1024*1024*4;
```

以下示例将 `max_threads` 设置为 `4`：

```sql
SET max_threads = 4;
```

以下示例将 `max_threads` 设置为 `4`，并将其更改为全局级别设置：

```sql
SET GLOBAL max_threads = 4;
```