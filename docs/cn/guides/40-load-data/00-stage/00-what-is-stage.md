---
title: 什么是 Stage？
---

在 Databend 中，stage 是一个虚拟位置，数据文件存放在其中。stage 中的文件可以直接查询或加载到表中。或者，您可以将表中的数据卸载到 stage 中作为文件。使用 stage 的好处是，您可以像访问计算机上的文件夹一样方便地访问它进行数据加载和卸载。就像您将文件放入文件夹时，不一定需要知道它在硬盘上的确切位置一样。访问 stage 中的文件时，您只需要指定 stage 名称和文件名，例如 `@mystage/mydatafile.csv`，而不是指定其在对象存储桶中的位置。与计算机上的文件夹类似，您可以在 Databend 中创建任意数量的 stage。但需要注意的是，一个 stage 不能包含另一个 stage。每个 stage 独立运行，不包含其他 stage。

利用 stage 加载数据还可以提高上传、管理和过滤数据文件的效率。通过 [BendSQL](../../30-sql-clients/00-bendsql/index.md)，您可以使用单个命令轻松地将文件上传或下载到 stage 中。在将数据加载到 Databend 时，您可以直接在 COPY INTO 命令中指定一个 stage，使该命令能够从该 stage 读取甚至过滤数据文件。同样，在从 Databend 导出数据时，您可以将数据文件转储到 stage 中。

## Stage 类型

根据实际存储位置和可访问性，stage 可以分为以下几种类型：内部 Stage、外部 Stage 和用户 Stage。下表总结了 Databend 中不同 stage 类型的特点，包括其存储位置、可访问性和推荐的使用场景：

| Stage 类型     | 存储位置                           | 可访问性                                   | 何时选择                                    |
| -------------- | ---------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| 内部 Stage     | Databend 所在的对象存储             | 组织内所有用户均可访问                         | 适用于组织内共享数据                              |
| 外部 Stage     | 外部对象存储                       | 组织内所有用户均可访问                         | 适用于与外部数据源集成                            |
| 用户 Stage     | Databend 所在的对象存储             | 仅对应用户可访问                               | 适用于个人数据文件或临时数据                      |

### 内部 Stage

内部 stage 中的文件实际上存储在 Databend 所在的对象存储中。内部 stage 对组织内的所有用户都是可访问的，允许每个用户利用 stage 进行数据加载或导出任务。与创建文件夹类似，创建 stage 时需要指定名称。以下是使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建内部 stage 的示例：

```sql
-- 创建名为 my_internal_stage 的内部 stage
CREATE STAGE my_internal_stage;
```

### 外部 Stage

外部 stage 允许您指定 Databend 所在位置之外的对象存储位置。例如，如果您在 Google Cloud Storage 容器中有数据集，可以使用该容器创建外部 stage。创建外部 stage 时，必须提供连接信息，以便 Databend 连接到外部位置。

以下是创建外部 stage 的示例。假设您在名为 `databend-doc` 的 Amazon S3 桶中有数据集：

![alt text](/img/guides/external-stage.png)

您可以使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建外部 stage，将 Databend 连接到该桶：

```sql
-- 创建名为 my_external_stage 的外部 stage
CREATE STAGE my_external_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        AWS_KEY_ID = '<YOUR-KEY-ID>',
        AWS_SECRET_KEY = '<YOUR-SECRET-KEY>'
    );
```

外部 stage 创建后，您可以从 Databend 访问数据集。例如，列出文件：

```sql
LIST @my_external_stage;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │                 md5                │         last_modified         │      creator     │
├───────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ Inventory.csv │  57585 │ "0cd02fb636a22ba9f4ae4d24555a7d68" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
│ Products.csv  │  42987 │ "570e5cbf6a4b6e7e9a258094192f4784" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

请注意，外部存储必须是 Databend 支持的对象存储解决方案之一。[CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令页面提供了如何为常用对象存储解决方案指定连接信息的示例。

### 用户 Stage

用户 stage 可以视为一种特殊的内部 stage：用户 stage 中的文件存储在 Databend 所在的对象存储中，但不能被其他用户访问。每个用户都有自己的用户 stage，开箱即用，您在使用前不需要创建或命名您的用户 stage。此外，您不能删除您的用户 stage。

用户 stage 可以作为您的数据文件的便捷存储库，这些数据文件不需要与其他人共享。要访问您的用户 stage，请使用 `@~`。例如，列出您 stage 中的所有文件：

```sql
LIST @~;
```

## 管理 Stage

Databend 提供了多种命令来帮助您管理 stage 及其中的文件：

| 命令                                                         | 描述                                                                                                                                                                                                                          | 适用于用户 Stage | 适用于内部 Stage | 适用于外部 Stage |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ------------------------- | ------------------------- |
| [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) | 创建内部或外部 stage。                                                                                                                                                                                               | 否                    | 是                       | 是                       |
| [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage)     | 删除内部或外部 stage。                                                                                                                                                                                               | 否                    | 是                       | 是                       |
| [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage)     | 显示内部或外部 stage 的属性。                                                                                                                                                                               | 否                    | 是                       | 是                       |
| [LIST](/sql/sql-commands/ddl/stage/ddl-list-stage)           | 返回 stage 中已暂存的文件列表。或者，表函数 [LIST_STAGE](/sql/sql-functions/table-functions/list-stage) 提供了类似的功能，并增加了获取特定文件信息的灵活性 | 是                   | 是                       | 是                       |
| [REMOVE](/sql/sql-commands/ddl/stage/ddl-remove-stage)       | 从 stage 中删除已暂存的文件。                                                                                                                                                                                                   | 是                   | 是                       | 是                       |
| [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages)   | 返回已创建的内部和外部 stage 列表。                                                                                                                                                                          | 否                    | 是                       | 是                       |