---
title: 持续数据管道（Continuous Data Pipelines）
---

## 数据管道（Data Pipelines）简介

数据管道（Data Pipelines）自动化了从不同来源将数据移动并转换到 Databend 的过程。它们确保数据流畅地流动，对于快速且连续地处理和分析数据至关重要。

在持续数据管道（Continuous Data Pipelines）中，一个名为**变更数据捕获（Change Data Capture，CDC）**的特殊功能发挥着关键作用。通过 Databend，CDC 变得简单高效，只需通过流（Streams）和任务（Tasks）执行几个简单命令即可。

## 理解变更数据捕获（Change Data Capture，CDC）

CDC 是一个过程，在此过程中，流对象（Stream Object）捕获应用于数据库表的插入、更新和删除操作。它包含每个变更的元数据，支持基于修改后的数据执行操作。Databend 中的 CDC 在源表的行级别跟踪变更，创建一个“变更表”来反映两个事务时间点之间的修改。

## 使用变更数据捕获（Change Data Capture，CDC）的优势

1. **快速实时数据加载**：简化从事务数据库加载实时数据的过程，几乎在几秒钟内完成。
2. **不影响原始数据**：使用安全，不会损坏数据或数据来源系统。
3. **克服批处理 ETL (Batch ETL) 的限制**：超越传统的批处理 ETL 方法，后者对于连续数据更新来说更慢且效率较低。

## Databend 持续数据管道（Continuous Data Pipelines）的关键特性

Databend 通过以下特性增强持续数据管道（Continuous Data Pipelines）：

- **持续数据跟踪和转换**：支持数据的实时跟踪和转换。[了解更多关于通过流（Streams）跟踪和转换数据](./01-stream.md)。

- **循环任务（Recurring Tasks）**：支持循环数据处理任务的调度和管理，确保数据管道的效率和可靠性。此功能目前处于私有预览阶段。