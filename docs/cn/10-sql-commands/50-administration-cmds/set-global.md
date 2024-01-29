---
title: SET
---

更改系统设置的值和/或级别。要显示所有当前设置，请使用 [SHOW SETTINGS](show-settings.md)。

另请参见：
- [SET_VAR](set-var.md)
- [UNSET](unset.md)

## 语法

```sql
SET [GLOBAL] <setting_name> = <new_value>;
```

`GLOBAL`：如果在会话级设置之前包含此选项，该设置将变为全局级设置。有关设置级别的更多信息，请参见 [管理设置](/sql/sql-reference/manage-settings)。

## 示例

以下示例将 `max_memory_usage` 设置为 `4 GB`：

```sql
SET max_memory_usage = 1024*1024*1024*4;
```

以下示例将 `max_threads` 设置为 `4`：

```sql
SET max_threads = 4;
```

以下示例将 `max_threads` 设置为 `4` 并将其更改为全局级设置：

```sql
SET GLOBAL max_threads = 4;
```