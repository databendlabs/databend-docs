---
title: DESC ROW ACCESS POLICY
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

Displays detailed information about a specific row access policy in Databend.

## Syntax

```sql
DESC ROW ACCESS POLICY <policy_name>
```

`DESCRIBE ROW ACCESS POLICY` is also supported.

## Access Control Requirements

| Privilege | Description |
|:----------|:------------|
| APPLY ROW ACCESS POLICY | Required to describe a row access policy unless you own that policy. |

Either the global `APPLY ROW ACCESS POLICY` privilege or APPLY/OWNERSHIP on the specific row access policy satisfies this requirement.

## Examples

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN ->
  CASE
    WHEN current_role() = 'admin' THEN true
    WHEN dept = 'Engineering' THEN true
    ELSE false
  END
  COMMENT = 'show engineering rows';

DESC ROW ACCESS POLICY rap_engineering;

Name            | Created On                  | Signature     | Return Type | Body                                                       | Comment
----------------+-----------------------------+---------------+-------------+------------------------------------------------------------+----------------------
rap_engineering | 2026-05-15 08:42:10.949 UTC | (dept STRING) | BOOLEAN     | CASE WHEN current_role() = 'admin' THEN true WHEN...       | show engineering rows
```
