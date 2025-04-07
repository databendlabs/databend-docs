---
title: 什么是 Stage？
---

在 Databend 中，Stage 是数据文件所在的虚拟位置。Stage 中的文件可以直接查询或加载到表中。或者，您可以将数据从表卸载到 Stage 中作为文件。使用 Stage 的好处在于，您可以像使用计算机上的文件夹一样方便地访问它以进行数据加载和卸载。就像将文件放入文件夹中一样，您不一定需要知道它在硬盘上的确切位置。当访问 Stage 中的文件时，您只需要指定 Stage 名称和文件名，例如 `@mystage/mydatafile.csv`，而不是指定它在对象存储 Bucket 中的位置。与计算机上的文件夹类似，您可以在 Databend 中根据需要创建任意数量的 Stage。但是，重要的是要注意一个 Stage 不能包含另一个 Stage。每个 Stage 独立运行，不包含其他 Stage。

利用 Stage 加载数据还可以提高上传、管理和过滤数据文件的效率。使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md)，您可以使用单个命令轻松地将文件上传或下载到 Stage。将数据加载到 Databend 中时，您可以直接在 COPY INTO 命令中指定一个 Stage，允许该命令读取甚至过滤来自该 Stage 的数据文件。类似地，当从 Databend 导出数据时，您可以将数据文件转储到 Stage 中。

## Stage 类型

根据实际存储位置和可访问性，Stage 可以分为以下类型：Internal Stage、External Stage 和 User Stage。下表总结了 Databend 中不同 Stage 类型的特征，包括它们的存储位置、可访问性和推荐的使用场景：

| Stage 类型     | 存储位置                   | 可访问性                                   | 何时选择                                    |
| -------------- | ---------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Internal Stage | Databend 所在的 对象存储 | 组织内所有用户均可访问                       | 适用于组织内的共享数据                          |
| External Stage | 外部对象存储            | 组织内所有用户均可访问                       | 非常适合与外部数据源集成                        |
| User Stage     | Databend 所在的 对象存储 | 仅各自用户可访问                             | 非常适合个人数据文件或临时数据                  |

### Internal Stage

Internal Stage 中的文件实际上存储在 Databend 所在的 对象存储 中。组织内的所有用户都可以访问 Internal Stage，允许每个用户利用该 Stage 进行数据加载或导出任务。与创建文件夹类似，创建 Stage 时必须指定名称。以下是使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建 Internal Stage 的示例：

```sql
-- 创建一个名为 my_internal_stage 的 Internal Stage
CREATE STAGE my_internal_stage;
```

### External Stage

External Stage 允许您指定 Databend 之外的对象存储位置。例如，如果您的数据集位于 Google Cloud Storage 容器中，则可以使用该容器创建一个 External Stage。创建 External Stage 时，您必须提供连接信息，以便 Databend 连接到外部位置。

以下是创建 External Stage 的示例。假设您在名为 `databend-doc` 的 Amazon S3 Bucket 中有数据集：

![alt text](/img/guides/external-stage.png)

您可以使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建一个 External Stage，以将 Databend 连接到该 Bucket：

```sql
-- 创建一个名为 my_external_stage 的 External Stage
CREATE STAGE my_external_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        AWS_KEY_ID = '<YOUR-KEY-ID>',
        AWS_SECRET_KEY = '<YOUR-SECRET-KEY>'
    );
```

创建 External Stage 后，您可以从 Databend 访问数据集。例如，要列出文件：

```sql
LIST @my_external_stage;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │                 md5                │         last_modified         │      creator     │
├───────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ Inventory.csv │  57585 │ "0cd02fb636a22ba9f4ae4d24555a7d68" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
│ Products.csv  │  42987 │ "570e5cbf6a4b6e7e9a258094192f4784" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

请注意，外部存储必须是 Databend 支持的对象存储解决方案之一。[CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令页面提供了有关如何为常用对象存储解决方案指定连接信息的示例。

### User Stage

User Stage 可以被认为是一种特殊的 Internal Stage：User Stage 中的文件存储在 Databend 所在的 对象存储 中，但不能被其他用户访问。每个用户都有自己的 User Stage，开箱即用，您无需在使用前创建或命名您的 User Stage。此外，您无法删除您的 User Stage。

User Stage 可以作为您的数据文件的便捷存储库，这些数据文件无需与他人共享。要访问您的 User Stage，请使用 `@~`。例如，要列出您的 Stage 中的所有文件：

```sql
LIST @~;
```

## 管理 Stage

Databend 提供了各种命令来帮助您管理 Stage 和其中暂存的文件：

| 命令                                                      | 描述                                                                                                                                                                                                                          | 适用于 User Stage | 适用于 Internal Stage | 适用于 External Stage |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ------------------------- | ------------------------- |
| [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) | 创建一个 Internal Stage 或 External Stage。                                                                                                                                                                                               | No                    | Yes                       | Yes                       |
| [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage)     | 删除一个 Internal Stage 或 External Stage。                                                                                                                                                                                               | No                    | Yes                       | Yes                       |
| [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage)     | 显示 Internal Stage 或 External Stage 的属性。                                                                                                                                                                               | No                    | Yes                       | Yes                       |
| [LIST](/sql/sql-commands/ddl/stage/ddl-list-stage)           | 返回 Stage 中暂存文件的列表。或者，表函数 [LIST_STAGE](/sql/sql-functions/table-functions/list-stage) 提供类似的功能，并增加了获取特定文件信息的灵活性。 | Yes                   | Yes                       | Yes                       |
| [REMOVE](/sql/sql-commands/ddl/stage/ddl-remove-stage)       | 从 Stage 中删除暂存的文件。                                                                                                                                                                                                   | Yes                   | Yes                       | Yes                       |
| [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages)   | 返回已创建的 Internal Stage 和 External Stage 的列表。                                                                                                                                                                          | No                    | Yes                       | Yes                       |