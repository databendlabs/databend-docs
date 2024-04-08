---
title: REFRESH INVERTED INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

Refreshes an asynchronous inverted index in Databend. Asynchronous inverted indexes require manual refresh after creation or data updates.

## Syntax

```sql
REFRESH INVERTED INDEX <index> ON [<database>.]<table> [LIMIT <limit>]
```

| Parameter | Description                                                                                                                      |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `<limit>` | Specifies the maximum number of rows to process during index refresh. If not specified, all rows in the table will be processed. |

## Examples

```sql
-- Create and refresh an asynchronous inverted index for the 'comment_title' and 'comment_body' columns in the table 'user_comments'
CREATE ASYNC INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```