---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Create a database.

## Syntax

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
```

## Examples

The following example creates a database named `test`:

```sql
CREATE DATABASE test;
```