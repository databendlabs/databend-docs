---
title: 'L2_DISTANCE'
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.777"/>

Calculates the Euclidean (L2) distance between two vectors, measuring the straight-line distance between them in vector space.

## Syntax

```sql
L2_DISTANCE(vector1, vector2)
```

## Arguments

- `vector1`: First vector (VECTOR Data Type)
- `vector2`: Second vector (VECTOR Data Type)

## Returns

Returns a FLOAT value representing the Euclidean (L2) distance between the two vectors. The value is always non-negative:
- 0: Identical vectors
- Larger values: Vectors that are farther apart

## Description

The L2 distance, also known as Euclidean distance, measures the straight-line distance between two points in Euclidean space. It is one of the most common metrics used in vector similarity search and machine learning applications.

The function:

1. Verifies that both input vectors have the same length
2. Computes the sum of squared differences between corresponding elements
3. Returns the square root of this sum

The mathematical formula implemented is:

```
L2_distance(v1, v2) = √(Σ(v1ᵢ - v2ᵢ)²)
```

Where v1ᵢ and v2ᵢ are the elements of the input vectors.

:::info
- This function performs vector computations within Databend and does not rely on external APIs.
:::

## Examples

Create a table with vector data:

```sql
CREATE OR REPLACE TABLE vectors (
    id INT,
    vec VECTOR(3),
    VECTOR INDEX idx_vec(vec) distance='l2'
);

INSERT INTO vectors VALUES
    (1, [1.0000, 2.0000, 3.0000]),
    (2, [1.0000, 2.2000, 3.0000]),
    (3, [4.0000, 5.0000, 6.0000]);
```

Find the vector closest to [1, 2, 3] using L2 distance:

```sql
SELECT 
    id,
    vec, 
    L2_DISTANCE(vec, [1.0000, 2.0000, 3.0000]::VECTOR(3)) AS distance
FROM 
    vectors
ORDER BY 
    distance ASC;
```

```
+----+-------------------------+----------+
| id | vec                     | distance |
+----+-------------------------+----------+
| 1  | [1.0000,2.0000,3.0000]  | 0.0      |
| 2  | [1.0000,2.2000,3.0000]  | 0.2      |
| 3  | [4.0000,5.0000,6.0000]  | 5.196152 |
+----+-------------------------+----------+
```