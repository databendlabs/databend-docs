---
title: REFRESH INVERTED INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

Refreshes an inverted index in Databend. An inverted index requires refresh in the following scenarios:

- When data is inserted into the table before creating the inverted index, manual refreshing of the inverted index is necessary post-creation to effectively index the inserted data.
- When the inverted index encounters issues or becomes corrupted, it needs to be refreshed. If the inverted index breaks due to certain blocks' inverted index files being corrupted, a query such as `where match(body, 'wiki')` will return an error. In such instances, you need to refresh the inverted index to fix the issue.

## Syntax

```sql
REFRESH INVERTED INDEX <index> ON [<database>.]<table> [LIMIT <limit>]
```

| Parameter | Description                                                                                                                      |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `<limit>` | Specifies the maximum number of rows to process during index refresh. If not specified, all rows in the table will be processed. |

## Examples

```sql
-- Refresh an inverted index named "customer_feedback_idx" for the table "customer_feedback"
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```
