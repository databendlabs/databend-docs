---
title: 'Vector Distance Functions'
description: 'Vector distance functions in Databend for similarity measurement'
---


# Vector Distance Functions

Databend provides functions for measuring distance or similarity between vectors, essential for vector search and machine learning applications.

## Function Comparison
| Function | Description | Range | Best For | Use Cases |
|----------|-------------|-------|----------|-----------|
| [L2_DISTANCE](01-vector-l2-distance.md) | Euclidean (straight-line) distance | [0, ∞) | When magnitude matters | • Image similarity<br/>• Geographical data<br/>• Anomaly detection<br/>• Feature-based clustering |
| [COSINE_DISTANCE](00-vector-cosine-distance.md) | Angular distance between vectors | [0, 1] | When direction matters more than magnitude | • Document similarity<br/>• Semantic search<br/>• Recommendation systems<br/>• Text analysis |
