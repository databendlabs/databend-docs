---
title: Dictionary Functions
---

This section provides reference information for the dictionary functions in Databend. Dictionary functions allow you to directly query data from external sources like MySQL and Redis in real-time without ETL processes.

## Benefits of Dictionary Functions

- **Real-time Data Access**: Query external data sources directly without data synchronization
- **Data Consistency**: Ensure data consistency between Databend and external systems
- **Improved Performance**: Reduce query latency for frequently accessed reference data
- **Simplified Data Management**: Eliminate the need for complex ETL pipelines

## Available Dictionary Functions

| Function | Description | Example |
|----------|-------------|--------|
| [DICT_GET](dict-get) | Retrieves a value from a dictionary using a key | `DICT_GET(my_dict, 'attribute', key_value)` |
