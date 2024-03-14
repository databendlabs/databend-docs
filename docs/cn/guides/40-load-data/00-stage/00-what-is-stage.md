---
title: 什么是 Stage？
---

在 Databend 中，stage 是数据文件所在的虚拟位置。可以直接查询 stage 中的文件，或者将其加载到表中。或者，您也可以将表中的数据卸载到 stage 中作为文件。使用 stage 的好处在于，您可以像操作计算机上的文件夹一样方便地访问它进行数据加载和卸载。就像您将文件放入文件夹时，不必知道它在硬盘上的确切位置一样。访问 stage 中的文件时，您只需要指定 stage 名称和文件名，例如 `@mystage/mydatafile.csv`，而不是指定其在对象存储的桶中的位置。与计算机上的文件夹类似，您可以在 Databend 中根据需要创建任意多的 stage。但是，重要的是要注意，一个 stage 不能包含另一个 stage。每个 stage 都独立运作，不包含其他 stage。

使用 stage 加载数据还可以提高上传、管理和过滤数据文件的效率。通过 [BendSQL](../../30-sql-clients/00-bendsql/index.md)，您可以使用单个命令轻松地将文件上传或下载到 stage 或从 stage 中。在将数据加载到 Databend 时，您可以在 COPY INTO 命令中直接指定一个 stage，允许该命令从该 stage 读取甚至过滤数据文件。同样，当从 Databend 导出数据时，您可以将数据文件转储到 stage 中。

## Stage 类型

根据实际的存储位置和可访问性，stage 可以分为以下类型：内部 Stage、外部 Stage 和用户 Stage。下表总结了 Databend 中不同 stage 类型的特点，包括它们的存储位置、可访问性和推荐的使用场景：

| Stage 类型 | 存储位置                | 可访问性             | 何时选择                         |
| ---------- | ----------------------- | -------------------- | -------------------------------- |
| 内部 Stage | Databend 所在的对象存储 | 组织内所有用户可访问 | 适用于组织内共享数据             |
| 外部 Stage | 外部对象存储            | 组织内所有用户可访问 | 适合与外部数据源集成             |
| 用户 Stage | Databend 所在的对象存储 | 仅对相应用户可访问   | 完美适用于个人数据文件或临时数据 |

### 内部 Stage

内部 stage 中的文件实际上存储在 Databend 所在的对象存储中。内部 stage 对您组织中的所有用户可访问，允许每个用户使用该 stage 进行数据加载或导出任务。创建 stage 类似于创建一个文件夹，创建时需要指定一个名称。以下是使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建内部 stage 的示例：

```sql
-- 创建名为 my_internal_stage 的内部 stage
CREATE STAGE my_internal_stage;
```

### 外部 Stage

外部 stage 使您能够指定 Databend 所在位置之外的对象存储位置。例如，如果您在 Google Cloud Storage 容器中有数据集，您可以使用该容器创建一个外部 stage。创建外部 stage 时，必须提供连接信息，以便 Databend 连接到外部位置。

以下是创建外部 stage 的示例。假设您在对象存储的名为 `databend` 的桶中有数据集：

![alt text](@site/docs/public/img/guides/external-stage.png)

您可以使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建一个外部 stage，将 Databend 连接到该桶：

```sql
-- 创建名为 my_external_stage 的外部 stage
CREATE STAGE my_external_stage
    URL = 's3://databend'
    CONNECTION = (
        ENDPOINT_URL = '<YOUR_STORAGE_ENDPOINT>',
        AWS_KEY_ID = '<YOUR-KEY-ID>',
        AWS_SECRET_KEY = '<YOUR-SECRET-KEY>'
    );
```

一旦创建了外部 stage，您就可以从 Databend 访问数据集。例如，列出文件：

```sql
LIST @my_external_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         name        │    size   │                 md5                │         last_modified         │      creator     │
├─────────────────────┼───────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ UserBehavior.csv.gz │ 949805035 │ "604e9e2c1915732d66d36853e43c1a0d" │ 2023-10-29 03:28:49.853 +0000 │ NULL             │
│ books.parquet       │       998 │ "88432bf90aadb79073682988b39d461c" │ 2023-04-24 20:00:22.171 +0000 │ NULL             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

请注意，外部存储必须是 Databend 支持的对象存储解决方案之一。[CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令页面提供了如何为常用的对象存储解决方案指定连接信息的示例。

### 用户 Stage

用户 stage 可以被视为一种特殊类型的内部 stage：用户 stage 中的文件存储在 Databend 所在的对象存储中，但其他用户无法访问。每个用户都有自己的用户 stage，而且在使用前无需创建或命名您的用户 stage。此外，您也不能移除您的用户 stage。

用户 stage 可以作为一个便利的仓库，用于存储不需要与他人共享的数据文件。要访问您的用户 stage，请使用 `@~`。例如，列出您 stage 中的所有文件：

```sql
LIST @~;
```

## 管理 Stages

Databend 提供了多种命令来帮助您管理 stages 及其中的文件：

| 命令                                                       | 描述                                                                                                                                                         | 适用于用户 Stage | 适用于内部 Stage | 适用于外部 Stage |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------------- | ---------------- |
| [创建 Stage](/sql/sql-commands/ddl/stage/ddl-create-stage) | 创建一个内部或外部 Stage。                                                                                                                                   | 否               | 是               | 是               |
| [删除 Stage](/sql/sql-commands/ddl/stage/ddl-drop-stage)   | 移除一个内部或外部 Stage。                                                                                                                                   | 否               | 是               | 是               |
| [描述 Stage](/sql/sql-commands/ddl/stage/ddl-desc-stage)   | 显示一个内部或外部 Stage 的属性。                                                                                                                            | 否               | 是               | 是               |
| [列表](/sql/sql-commands/ddl/stage/ddl-list-stage)         | 返回一个 Stage 中已暂存文件的列表。另外，表函数 [LIST_STAGE](/sql/sql-functions/table-functions/list-stage) 提供了类似的功能，增加了获取特定文件信息的灵活性 | 是               | 是               | 是               |
| [移除](/sql/sql-commands/ddl/stage/ddl-remove-stage)       | 从一个 Stage 中移除已暂存的文件。                                                                                                                            | 是               | 是               | 是               |
| [显示 Stage](/sql/sql-commands/ddl/stage/ddl-show-stages)  | 返回已创建的内部和外部 Stage 的列表。                                                                                                                        | 否               | 是               | 是               |
