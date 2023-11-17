---
title: SHOW FILE FORMATS
sidebar_position: 2
---

Returns a list of created file formats.

## Syntax

```sql
SHOW FILE FORMATS;
```

## Examples

```sql
SHOW FILE FORMATS;

+---------------+------------------------------------------------------------------------------------------------------------------------+
| name          | format_options                                                                                                         |
+---------------+------------------------------------------------------------------------------------------------------------------------+
| my_custom_csv | TYPE = CSV FIELD_DELIMITER = '\t' RECORD_DELIMITER = '\n' QUOTE = '\"' ESCAPE = '' SKIP_HEADER = 0 NAN_DISPLAY = 'NaN' |
+---------------+------------------------------------------------------------------------------------------------------------------------+
```
