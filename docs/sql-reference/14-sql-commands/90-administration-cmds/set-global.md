---
title: SET
---

Changes the value and/or level of a system setting. To show all the current settings, use [SHOW SETTINGS](show-settings.md).

See also:
- [SET_VAR](set-var.md)
- [UNSET](unset.md)

## Syntax

```sql
SET [GLOBAL] <setting_name> = <new_value>;
```

`GLOBAL`: If you include this option preceding a session-level setting, the setting will become a global-level setting. For more information about the setting levels, see [Managing Settings](/sql/sql-reference/manage-settings).

## Examples

The following example sets the `max_memory_usage` setting to `4 GB`:

```sql
SET max_memory_usage = 1024*1024*1024*4;
```

The following example sets the `max_threads` setting to `4`:

```sql
SET max_threads = 4;
```

The following example sets the `max_threads` setting to `4` and changes it to be a global-level setting:

```sql
SET GLOBAL max_threads = 4;
```