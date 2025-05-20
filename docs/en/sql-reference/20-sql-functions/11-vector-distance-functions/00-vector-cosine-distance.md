---
title: 'COSINE_DISTANCE'
description: 'Measuring similarity using the cosine_distance function in Databend'
---

Calculates the cosine distance between two vectors, measuring how dissimilar they are.

## Syntax

```sql
COSINE_DISTANCE(vector1, vector2)
```

## Arguments

- `vector1`: First vector (ARRAY(FLOAT32 NOT NULL))
- `vector2`: Second vector (ARRAY(FLOAT32 NOT NULL))

## Returns

Returns a FLOAT value between 0 and 1:
- 0: Identical vectors (completely similar)
- 1: Orthogonal vectors (completely dissimilar)

## Description

The cosine distance measures the dissimilarity between two vectors based on the angle between them, regardless of their magnitude. The function:

1. Verifies that both input vectors have the same length
2. Computes the sum of element-wise products (dot product) of the two vectors
3. Calculates the square root of the sum of squares for each vector (vector magnitudes)
4. Returns `1 - (dot_product / (magnitude1 * magnitude2))`

The mathematical formula implemented is:

```
cosine_distance(v1, v2) = 1 - (Σ(v1ᵢ * v2ᵢ) / (√Σ(v1ᵢ²) * √Σ(v2ᵢ²)))
```

Where v1ᵢ and v2ᵢ are the elements of the input vectors.

:::info
This function performs vector computations within Databend and does not rely on external APIs.
:::


## Examples

Create a table with vector data:

```sql
CREATE OR REPLACE TABLE vectors (
    id INT,
    vec ARRAY(FLOAT32 NOT NULL)
);

INSERT INTO vectors VALUES
    (1, [1.0000, 2.0000, 3.0000]),
    (2, [1.0000, 2.2000, 3.0000]),
    (3, [4.0000, 5.0000, 6.0000]);
```

Find the vector most similar to [1, 2, 3]:

```sql
SELECT 
    vec, 
    COSINE_DISTANCE(vec, [1.0000, 2.0000, 3.0000]) AS distance
FROM 
    vectors
ORDER BY 
    distance ASC
LIMIT 1;
```

```
+-------------------------+----------+
| vec                     | distance |
+-------------------------+----------+
| [1.0000,2.2000,3.0000]  | 0.0      |
+-------------------------+----------+
```
