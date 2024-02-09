---
title: CREATE FILE FORMAT
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Create a named file format.

## Syntax

```sql
CREATE [ OR REPLACE ] FILE FORMAT [ IF NOT EXISTS ] <format_name> FileFormatOptions
```

For details about `FileFormatOptions`, see [Input & Output File Formats](../../../00-sql-reference/50-file-format-options.md).

## Examples

```sql
CREATE FILE FORMAT my_custom_csv TYPE=CSV  FIELD_DELIMITER='\t' 
```