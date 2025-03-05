---
title: CREATE ROLE
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.703"/>

Creates a new role.

After creating roles, you can grant object privileges to the role, enable access control security for objects in the system.

See also: [GRANT](10-grant.md)

## Syntax

```sql
CREATE ROLE [ IF NOT EXISTS ] <name> [ COMMENT = '<string_literal>' ]
```

- The `<name>` cannot contain the following illegal characters:
    - Single quote (')
    - Double quote (")
    - Backspace (\b)
    - Form feed (\f)

## Examples

```sql
CREATE ROLE role1;
```