---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Create a database.

Please note that creating a database from a share is part of the Share feature in Databend Cloud. For more information, see [Share](../08-share/index.md).

## Syntax

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
```

## Examples

The following example creates a database named `test`:

```sql
CREATE DATABASE test;
```

The following example creates a database named `test` from the share `myshare`:

```sql
CREATE DATABASE test FROM SHARE t;
```