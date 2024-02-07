---
title: 理解Stage
slug: whystage
---

Databend 通过称为“Stage”的机制简化了数据文件的处理。可以将 Stage 想象为一个特殊的文件夹，在您准备将数据文件用于表或发送到其他地方之前，您可以将数据文件保留在其中。它旨在通过减少关于文件存储的位置和方式的烦恼来简化您的工作。

## Stage 的类型

- **用户 Stage**：就像您开始时分配给您的私人储藏室。无需设置！
- **内部 Stage**：Databend 自己的存储空间。它会自动为您管理。
- **外部 Stage**：用于使用外部存储空间，如 S3 桶。您需要告诉 Databend 在哪里以及如何访问它。

## 用户 Stage

- 自动属于您，无需创建或删除。
- 它是私有的。只有您可以看到其中的内容。
- 不能直接在这里自定义存储格式，但在移动数据时可以。

命令概览：

- `LIST @~` 查看您的 Stage 中有什么。
- `REMOVE @~` 清空您的 Stage。

## 内部 Stage

内部 Stage 是 Databend 自己管理的文件存储。用户在这里不需要设置任何东西；Databend 已经处理了一切。要启动内部 Stage，您可以使用 [`CREATE STAGE`](/sql/sql-commands/ddl/stage/ddl-create-stage#example-1-create-internal-stage) 命令。

## 外部 Stage

对于位于 Databend 之外的文件，例如那些在 S3 桶中的文件。这个 Stage 涉及到指定外部存储位置并提供必要的访问凭证。使用 [`CREATE STAGE`](/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key) 命令创建外部 Stage。
