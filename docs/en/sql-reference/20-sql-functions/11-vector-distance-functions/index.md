---
title: 'Vector Distance Functions'
description: 'Vector distance functions in Databend for similarity measurement'
---

This section provides reference information for vector distance functions in Databend. These functions are essential for measuring similarity between vectors in machine learning applications, vector search, and AI-powered analytics.

## Available Vector Distance Functions

| Function | Description | Example |
|----------|-------------|--------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | Calculates angular distance between vectors (range: 0-1) | `COSINE_DISTANCE([1,2,3], [4,5,6])` |
| [L2_DISTANCE](./01-vector-l2-distance.md) | Calculates Euclidean (straight-line) distance | `L2_DISTANCE([1,2,3], [4,5,6])` |

## Function Comparison

| Function | Description | Range | Best For | Use Cases |
|----------|-------------|-------|----------|-----------|
| [L2_DISTANCE](./01-vector-l2-distance.md) | Euclidean (straight-line) distance | [0, ∞) | When magnitude matters | • Image similarity<br/>• Geographical data<br/>• Anomaly detection<br/>• Feature-based clustering |
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | Angular distance between vectors | [0, 1] | When direction matters more than magnitude | • Document similarity<br/>• Semantic search<br/>• Recommendation systems<br/>• Text analysis |
