---
title: CREATE VECTOR INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Creates a Vector index on a [VECTOR](/sql/sql-reference/data-types/vector) column for a table to enable efficient similarity search using the HNSW (Hierarchical Navigable Small World) algorithm.

## Syntax

```sql
-- Create a Vector index on an existing table
CREATE [OR REPLACE] VECTOR INDEX [IF NOT EXISTS] <index_name>
ON [<database>.]<table_name>(<column>)
distance = '<metric>' [m = <number>] [ef_construct = <number>]
[refine = true | false]

-- Create a Vector index when creating a table
CREATE [OR REPLACE] TABLE <table_name> (
    <column_definitions>,
    VECTOR INDEX <index_name> (<column>)
        distance = '<metric>' [m = <number>] [ef_construct = <number>]
        [refine = true | false]
)...
```

### Parameters

- **`distance`** (required) - Specifies the distance metric(s) to use for similarity search. Multiple metrics can be combined with commas:
  - `'cosine'` - Cosine distance (best for semantic similarity, text embeddings)
  - `'l1'` - L1 distance / Manhattan distance (good for feature comparison, sparse data)
  - `'l2'` - L2 distance / Euclidean distance (best for geometric similarity, image features)
  - Example: `distance = 'cosine,l1,l2'` supports all three metrics

- **`m`** (optional, default: 16) - Controls the number of bidirectional connections each node has in the HNSW graph:
  - Higher values increase memory usage but can improve search accuracy
  - Must be greater than 0
  - Typical range: 8-64

- **`ef_construct`** (optional, default: 100) - Controls the size of the dynamic candidate list during index construction:
  - Higher values improve index quality but increase construction time and memory
  - Must be >= 40
  - Typical range: 40-500

- **`refine`** (optional, default: `false`) - Stores FP16 vectors with the index for result refinement. This option was introduced in v1.2.957. It adds storage and read costs. Query settings control how Databend uses the stored FP16 data.

## FP16 Refinement

Without refinement, vector index queries use SQ8-quantized scores. An index with `refine = true` can rescore candidates with FP16 vectors before selecting the final TopN rows. FP16 scores are still approximate. Refinement does not guarantee exact nearest neighbors or scores from the original full-precision vectors.

| Setting | Default | Description |
|---------|---------|-------------|
| `vector_refine_factor` | `2` | Accepts integers from `0` to `16`. For an eligible TopN search, uses `LIMIT * factor` as the candidate budget for FP16 rescoring. `0` disables refinement. `1` rescores the original candidate budget. Indexes without `refine = true` ignore this setting. |
| `vector_search_ef` | `0` | Controls the HNSW search candidate list. `0` uses four times the candidate count. A nonzero value is raised to at least the candidate count. |

Both settings were introduced in v1.2.957. Set them for the session with `SET`, or for one query with `SETTINGS`. Changing these settings does not require an index rebuild.

```sql
SET vector_refine_factor = 4;
SET vector_search_ef = 400;
```

Eligible TopN searches read only FP16 pages that contain candidates. Queries that score every row, such as a distance projection or a search with ordinary column predicates, use FP16 scores for every scored row when refinement is enabled. Those queries do not use the TopN candidate budget to limit scoring.

To enable refinement on an existing index, replace its definition with `refine = true`. Keep the other index options that you need. Then run [REFRESH VECTOR INDEX](refresh-vector-index.md) to build the new index version for existing data:

```sql
CREATE OR REPLACE VECTOR INDEX idx_product_embedding
ON products(embedding)
distance = 'cosine,l1,l2'
m = 20
ef_construct = 150
refine = true;

REFRESH VECTOR INDEX idx_product_embedding ON products;
```

Newly written data uses the current index definition automatically. Existing legacy index files remain readable. Refresh builds the current bundle format where it is missing. `VACUUM TABLE` reclaims index files that retained snapshots no longer reference.

## How Vector Index Works

Vector indexes in Databend use the HNSW algorithm to build a multi-layered graph structure:

1. **Graph Structure**: Each vector is a node with connections to its nearest neighbors
2. **Search Process**: Queries navigate through graph layers, from coarse to fine, to find approximate nearest neighbors quickly
3. **Quantization**: SQ8 quantization reduces index storage. Optional FP16 data supports refinement. Both can affect search accuracy.
4. **Automatic Building**: The index is automatically built as data is written. Every INSERT, COPY, or data load operation automatically generates the index for new rows - no manual maintenance required

## Examples

### Creating a Table with Vector Index

```sql
-- Simple vector index for embeddings
CREATE TABLE documents (
    id INT,
    title VARCHAR,
    content TEXT,
    embedding VECTOR(1024),
    VECTOR INDEX idx_embedding(embedding) distance = 'cosine'
);
```

### Creating a Vector Index with Custom Parameters

```sql
-- Vector index with multiple distance metrics and tuned parameters
CREATE TABLE images (
    id INT,
    filename VARCHAR,
    feature_vector VECTOR(512),
    VECTOR INDEX idx_features(feature_vector)
        distance = 'cosine,l2'
        m = 32
        ef_construct = 200
);
```

### Creating a Vector Index on an Existing Table

```sql
CREATE TABLE products (
    id INT,
    name VARCHAR,
    description TEXT,
    embedding VECTOR(768)
);

-- Add vector index after table creation
CREATE VECTOR INDEX idx_product_embedding
ON products(embedding)
distance = 'cosine,l1,l2'
m = 20
ef_construct = 150;
```

### Multiple Vector Indexes on Different Columns

```sql
CREATE TABLE multimodal_data (
    id INT,
    text_embedding VECTOR(384),
    image_embedding VECTOR(512),
    VECTOR INDEX idx_text(text_embedding) distance = 'cosine',
    VECTOR INDEX idx_image(image_embedding) distance = 'l2'
);
```

### Viewing Indexes

Use [SHOW INDEXES](/sql/sql-commands/administration-cmds/show-indexes) to view all indexes:

```sql
SHOW INDEXES;
```

Result:
```
┌──────────────────────┬────────┬──────────┬────────────────────────────┬──────────────────────────┐
│ name                 │ type   │ original │ definition                 │ created_on               │
├──────────────────────┼────────┼──────────┼────────────────────────────┼──────────────────────────┤
│ idx_embedding        │ VECTOR │          │ documents(embedding)       │ 2025-05-13 01:22:34.123  │
│ idx_product_embedding│ VECTOR │          │ products(embedding)        │ 2025-05-13 01:23:45.678  │
└──────────────────────┴────────┴──────────┴────────────────────────────┴──────────────────────────┘
```

### Using Vector Index for Similarity Search

```sql
-- Create a table with vector index
CREATE TABLE wiki_articles (
    id INT,
    title VARCHAR,
    embedding VECTOR(8),
    VECTOR INDEX idx_embedding(embedding) distance = 'cosine'
);

-- Insert sample data (8-dimensional vectors for demonstration)
INSERT INTO wiki_articles VALUES
(1, 'Machine Learning', [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]),
(2, 'Deep Learning', [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85]),
(3, 'Natural Language Processing', [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]),
(4, 'Computer Vision', [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]);

-- Find the 2 most similar articles to a query vector using cosine distance
SELECT id, title, cosine_distance(embedding, [0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82]) AS distance
FROM wiki_articles
ORDER BY distance ASC
LIMIT 2;
```

Result:
```
┌────┬─────────────────┬──────────────┐
│ id │ title           │ distance     │
├────┼─────────────────┼──────────────┤
│  1 │ Machine Learning│ 0.00012345   │
│  2 │ Deep Learning   │ 0.00023456   │
└────┴─────────────────┴──────────────┘
```

### Querying with FP16 Refinement

```sql
CREATE TABLE vector_refine_demo (
    id INT NOT NULL,
    embedding VECTOR(4) NOT NULL,
    VECTOR INDEX idx(embedding) distance = 'l1' refine = true
);

INSERT INTO vector_refine_demo VALUES
    (1, [1,0,0,0]), (2, [1,1,0,0]), (3, [0,1,0,0]);
INSERT INTO vector_refine_demo VALUES
    (4, [-1,0,0,0]), (5, [1,0.5,0,0]), (6, [1,0.25,0,0]);

SETTINGS (vector_refine_factor = 4, vector_search_ef = 16)
SELECT id, l1_distance(embedding, [1,0,0,0]::VECTOR(4)) AS d
FROM vector_refine_demo
ORDER BY d
LIMIT 3;
```

For this data, the three returned rows have IDs `1`, `6`, and `5`, with distances `0`, `0.25`, and `0.5`.

Use `SETTINGS (vector_refine_factor = 0)` to disable FP16 refinement for one query. This leaves the stored FP16 data unchanged.

## Performance Tuning

### Choosing Distance Metrics

Choose the appropriate distance metric based on your use case. See [Vector Functions](/sql/sql-functions/vector-functions) for querying with distance functions.

- **Cosine distance**: Best for text embeddings from models like BERT, GPT, where vector magnitude doesn't matter
- **L2 (Euclidean) distance**: Best for image features, spatial data where absolute differences matter
- **L1 (Manhattan) distance**: Good for sparse vectors and when you want to emphasize individual dimension differences

### Tuning HNSW Parameters

| Parameter      | Lower Value                          | Higher Value                         |
|----------------|--------------------------------------|--------------------------------------|
| `m`            | Less memory, faster construction     | Better accuracy, more memory         |
| `ef_construct` | Faster construction, lower quality   | Better quality, slower construction  |

**Recommended configurations:**

- **Small datasets (< 100K vectors)**: Default settings (`m=16`, `ef_construct=100`)
- **Medium datasets (100K - 1M vectors)**: `m=24`, `ef_construct=150`
- **Large datasets (> 1M vectors)**: `m=32`, `ef_construct=200`
- **High accuracy requirements**: `m=48`, `ef_construct=300`

## Limitations

- Vector indexes only support columns with [VECTOR](/sql/sql-reference/data-types/vector) data type
- The `distance` parameter is required; indexes without it will be ignored
- HNSW search and quantized scores are approximate. Accuracy depends on the data and index/search settings. Test recall with representative queries.
- Index size increases with higher `m` values (approximately `m * vector_dimension * 4 bytes` per vector)
