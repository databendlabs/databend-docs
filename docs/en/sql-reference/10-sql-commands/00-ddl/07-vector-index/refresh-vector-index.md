---
title: REFRESH VECTOR INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Builds missing vector index files for existing data using the current index definition and format.

## Syntax

```sql
REFRESH VECTOR INDEX <index_name> ON [<database>.]<table_name>
```

## When to Use REFRESH

Run `REFRESH VECTOR INDEX` in these cases:

- You create a vector index on a table that already contains data.
- You replace an index definition, for example to enable [`refine = true`](create-vector-index.md#fp16-refinement), and need to index existing blocks with the new definition.
- You need to build current-format index bundles for blocks that have only legacy index files. This behavior was introduced in v1.2.957.

New data writes automatically build indexes with the current definition. Refresh skips blocks that already have a matching current-version bundle. Older index files remain readable. Refresh removes a legacy file reference from the current block metadata only when no other active index needs it. `VACUUM TABLE` reclaims the file after retained snapshots no longer reference it.

## Rebuild indexes after the HNSW scoring fix

<FunctionDescription description="Introduced or updated: Unreleased"/>

Existing indexes do not automatically receive fixes to HNSW graph construction and SQ8 scoring. In particular, an L2 index built before this fix can retain incorrect distance scores. Running `REFRESH VECTOR INDEX` alone does not rebuild matching index files.

To apply the fixes to existing data:

1. Save the index definition and its options.
2. [Drop the vector index](drop-vector-index.md).
3. [Create the vector index](create-vector-index.md) again with the required options.
4. Run `REFRESH VECTOR INDEX` to build files for existing data.

Do not rely on the old L2 index for distance thresholds until the rebuild completes.

## Examples

### Example: Index Existing Data

```sql
-- Step 1: Create a table without an index
CREATE TABLE products (
    id INT,
    name VARCHAR,
    embedding VECTOR(4)
) ENGINE = FUSE;

-- Step 2: Insert data (without index)
INSERT INTO products VALUES
    (1, 'Product A', [0.1, 0.2, 0.3, 0.4]),
    (2, 'Product B', [0.5, 0.6, 0.7, 0.8]),
    (3, 'Product C', [0.9, 1.0, 1.1, 1.2]);

-- Step 3: Create vector index on existing data
CREATE VECTOR INDEX idx_embedding ON products(embedding) distance='cosine';

-- Step 4: Refresh to build index for the 3 existing rows
REFRESH VECTOR INDEX idx_embedding ON products;

-- Step 5: New insertions are automatically indexed (no refresh needed)
INSERT INTO products VALUES (4, 'Product D', [1.3, 1.4, 1.5, 1.6]);
```
