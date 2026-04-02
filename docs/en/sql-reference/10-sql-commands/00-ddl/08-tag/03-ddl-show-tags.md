---
title: SHOW TAGS
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.863"/>

Lists tag definitions in the current tenant. You can also query tag definitions through the `system.tags` table.

See also: [CREATE TAG](01-ddl-create-tag.md), [DROP TAG](02-ddl-drop-tag.md)

## Syntax

```sql
SHOW TAGS [ LIKE '<pattern>' | WHERE <expr> ] [ LIMIT <n> ]
```

## Output Columns

| Column           | Description                                          |
|------------------|------------------------------------------------------|
| `name`           | Tag name                                             |
| `allowed_values` | Permitted values list, or NULL if any value is allowed |
| `comment`        | Tag description                                      |
| `created_on`     | Creation timestamp                                   |

## Examples

Show all tags:

```sql
SHOW TAGS;
```

Filter tags by name pattern:

```sql
SHOW TAGS LIKE 'env%';
```

Filter with a WHERE condition:

```sql
SHOW TAGS WHERE comment IS NOT NULL;
```

Limit results:

```sql
SHOW TAGS LIMIT 5;
```

Equivalent query using the system table:

```sql
SELECT * FROM system.tags;
```
