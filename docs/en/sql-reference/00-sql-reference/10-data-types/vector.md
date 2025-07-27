---
title: Vector
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.777"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VECTOR INDEX'/>


The VECTOR data type stores multi-dimensional arrays of 32-bit floating-point numbers, designed for machine learning, AI applications, and similarity search operations. Each vector has a fixed dimension (length) specified at creation time.

## Syntax

```sql
column_name VECTOR(<dimension>)
```

Where:
- `dimension`: The dimension (length) of the vector. Must be a positive integer with a maximum value of 4096.
- Elements are 32-bit floating-point numbers.

## Vector Indexing

Databend supports creating vector indexes using the HNSW (Hierarchical Navigable Small World) algorithm for fast approximate nearest neighbor search, delivering **23x faster** query performance.

### Index Syntax

```sql
VECTOR INDEX index_name(column_name) distance='cosine,l1,l2'
```

Where:
- `index_name`: Name of the vector index
- `column_name`: Name of the VECTOR column to index
- `distance`: Distance functions to support. Can be `'cosine'`, `'l1'`, `'l2'`, or combinations like `'cosine,l1,l2'`


### Supported Distance Functions

| Function | Description | Use Case |
|----------|-------------|----------|
| **[cosine_distance](/sql/sql-functions/vector-functions/vector-cosine-distance)** | Calculates cosine distance between vectors | Semantic similarity, text embeddings |
| **[l1_distance](/sql/sql-functions/vector-functions/vector-l1-distance)** | Calculates L1 distance (Manhattan distance) | Feature comparison, sparse data |
| **[l2_distance](/sql/sql-functions/vector-functions/vector-l2-distance)** | Calculates L2 distance (Euclidean distance) | Geometric similarity, image features |

## Basic Usage

### Step 1: Create Table with Vector

```sql
-- Create table with vector index for efficient similarity search
CREATE OR REPLACE TABLE products (
    id INT,
    name VARCHAR,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='cosine'
);
```

**Note**: The vector index is automatically built when data is inserted into the table.

### Step 2: Insert Vector Data

```sql
-- Insert product feature vectors
INSERT INTO products VALUES 
    (1, 'Product A', [1.0, 2.0, 3.0]::VECTOR(3)),
    (2, 'Product B', [2.0, 1.0, 4.0]::VECTOR(3)),
    (3, 'Product C', [1.5, 2.5, 2.0]::VECTOR(3)),
    (4, 'Product D', [3.0, 1.0, 1.0]::VECTOR(3));
```

### Step 3: Perform Similarity Search

```sql
-- Find products similar to a query vector [1.2, 2.1, 2.8]
SELECT 
    id,
    name,
    features,
    cosine_distance(features, [1.2, 2.1, 2.8]::VECTOR(3)) AS distance
FROM products
ORDER BY distance ASC
LIMIT 3;
```

Result:
```
┌─────┬───────────┬───────────────┬──────────────────┐
│ id  │ name      │ features      │ distance         │
├─────┼───────────┼───────────────┼──────────────────┤
│ 2   │ Product B │ [2.0,1.0,4.0] │ 0.5384207        │
│ 3   │ Product C │ [1.5,2.5,2.0] │ 0.5772848        │
│ 1   │ Product A │ [1.0,2.0,3.0] │ 0.60447836       │
└─────┴───────────┴───────────────┴──────────────────┘
```

**Explanation**: The query finds the 3 most similar products to the search vector `[1.2, 2.1, 2.8]`. Lower cosine distance values indicate higher similarity.

## Unloading and Loading Vector Data

### Unloading Vector Data

```sql
-- Export vector data to stage
COPY INTO @mystage/unload/
FROM (
    SELECT 
        id,
        name,
        features
    FROM products
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### Loading Vector Data

```sql
-- Create target table for import
CREATE OR REPLACE TABLE products_imported (
    id INT,
    name VARCHAR,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='cosine'
);

-- Import vector data
COPY INTO products_imported (id, name, features)
FROM (
    SELECT 
        id,
        name,
        features
    FROM @mystage/unload/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```
