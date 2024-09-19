---
title: Continuous Data Pipelines
---

## Introduction to Data Pipelines

Data pipelines automate the process of moving and changing data from different sources into Databend. They make sure data flows smoothly and are vital for processing and analyzing data quickly and continuously.

In Continuous Data Pipelines, a special feature called **Change Data Capture (CDC)** plays a key role. With Databend, CDC becomes easy and efficient, requiring only a few simple commands through Streams and Tasks.

## Understanding Change Data Capture (CDC)

CDC is a process where a stream object captures insertions, updates, and deletions—applied to database tables. It includes metadata about each change, enabling actions based on the modified data. CDC in Databend tracks changes at the row level in a source table, creating a "change table" that reflects modifications between two transactional points in time.

## Advantages of Using Change Data Capture (CDC)

1. **Fast Real-Time Data Loading**: Streamlines the loading of real-time data from transactional databases, almost in seconds.
2. **Doesn't Affect Original Data**: Safe to use as it doesn’t damage the data or the systems where the data comes from.
3. **Overcoming Limitations of Batch ETL**: Surpasses traditional batch ETL methods, which are slower and less effective for continuous data updates.

## Key Features of Databend's Continuous Data Pipelines

Databend enhances continuous data pipelines with the following features:

- **Continuous Data Tracking and Transformation**: Enables real-time tracking and transformation of data. [Discover more about Tracking and Transforming Data via Streams](./01-stream.md).

- **Recurring Tasks**: Supports the scheduling and management of recurring data processing tasks to ensure efficiency and reliability of the data pipeline. This feature is currently in private preview.
