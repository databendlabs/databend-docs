---
title: 'L1_DISTANCE'
---

import FunctionDescription from '@site/src/components/FunctionDescription';
<FunctionDescription description="Introduced or updated: v1.2.777"/>

Calculates the Manhattan (L1) distance between two vectors, measuring the sum of absolute differences between corresponding elements.

## Syntax

```sql
L1_DISTANCE(vector1, vector2)
```

## Arguments

- `vector1`: First vector (VECTOR Data Type)
- `vector2`: Second vector (VECTOR Data Type)

## Returns

Returns a FLOAT value representing the Manhattan (L1) distance between the two vectors. The value is always non-negative:
- 0: Identical vectors
- Larger values: Vectors that are farther apart

## Description

The L1 distance, also known as Manhattan distance or taxicab distance, calculates the sum of absolute differences between corresponding elements of two vectors. It's useful for feature comparison and sparse data analysis.

Formula: `L1_DISTANCE(a, b) = |a1 - b1| + |a2 - b2| + ... + |an - bn|`

## Examples

### Basic Usage

```sql
-- Calculate L1 distance between two vectors
SELECT L1_DISTANCE([1.0, 2.0, 3.0], [4.0, 5.0, 6.0]) AS distance;
```

Result:
```
┌──────────┐
│ distance │
├──────────┤
│ 9.0      │
└──────────┘
```

### Using with VECTOR Type

```sql
-- Create table with VECTOR columns
CREATE TABLE products (
    id INT,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='l1'
);

INSERT INTO products VALUES 
    (1, [1.0, 2.0, 3.0]::VECTOR(3)),
    (2, [2.0, 3.0, 4.0]::VECTOR(3));

-- Find products similar to a query vector using L1 distance
SELECT 
    id,
    features,
    L1_DISTANCE(features, [1.5, 2.5, 3.5]::VECTOR(3)) AS distance
FROM products
ORDER BY distance ASC
LIMIT 5;
```

## Related Functions

- [COSINE_DISTANCE](../cosine-distance): Calculates cosine distance for semantic similarity
- [L2_DISTANCE](../vector-l2-distance): Calculates Euclidean distance for geometric similarity
