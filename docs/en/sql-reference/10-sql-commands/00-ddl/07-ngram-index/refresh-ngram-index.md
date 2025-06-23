---
title: REFRESH NGRAM INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.726"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Refresh an existing NGRAM index from a table.

## Syntax

```sql
REFRESH NGRAM INDEX [IF EXISTS] <index_name>
ON [<database>.]<table_name>;
```

## Examples

The following example refreshes the `idx1` index from the `amazon_reviews_ngram` table:

```sql
REFRESH NGRAM INDEX idx1 ON amazon_reviews_ngram;
```