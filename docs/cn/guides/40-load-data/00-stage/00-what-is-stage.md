---
title: 什么是 Stage？
---

在 Databend 中，Stage 是一个存放数据文件的虚拟位置。您可以直接查询 Stage 中的文件，或将数据加载到表中。反之，您也可以将表中的数据卸载到 Stage 作为文件存储。使用 Stage 的妙处在于，您可以像访问电脑文件夹一样便捷地进行数据加载和卸载操作。就像将文件放入文件夹时无需知晓其在硬盘上的确切位置一样，访问 Stage 中的文件只需指定 Stage 名称和文件名（例如 `@mystage/mydatafile.csv`），而无需指明其在对象存储桶中的具体路径。与电脑文件夹类似，您可以在 Databend 中创建任意数量的 Stage。但需注意，Stage 不能嵌套包含其他 Stage，每个 Stage 都是独立存在的。

通过 Stage 加载数据还能提升文件上传、管理和筛选的效率。借助 [BendSQL](../../30-sql-clients/00-bendsql/index.md)，您只需一条命令即可轻松上传或下载 Stage 中的文件。向 Databend 加载数据时，您可以在 COPY INTO 命令中直接指定 Stage，使命令从该 Stage 读取甚至筛选数据文件。同样，从 Databend 导出数据时，您也可以将数据文件转储至 Stage。

## Stage 类型

根据实际存储位置和可访问性，Stage 可分为以下类型：内部 Stage、外部 Stage 和用户 Stage。下表总结了 Databend 中不同 Stage 类型的特性，包括存储位置、可访问性及推荐使用场景：

|                      | 用户 Stage                      | 内部 Stage                                   | 外部 Stage                                                                                                |
|----------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **存储位置**         | 内部对象存储（Databend）       | 内部对象存储（Databend）                     | 外部对象存储（如 S3、Azure）                                                                              |
| **创建方式**         | 自动创建                       | 手动创建：`CREATE STAGE stage_name;`         | 手动创建：`CREATE STAGE stage_name` `'s3://bucket/prefix/'` `CONNECTION=(endpoint_url='x', ...);`         |
| **访问控制**         | 仅创建用户可访问               | 可与其他用户或角色共享                       | 可与其他用户或角色共享                                                                                    |
| **删除 Stage**       | 不允许删除                     | 删除 Stage 并清空其中文件                    | 仅删除 Stage；外部存储中的文件保留                                                                        |
| **文件上传**         | 必须上传文件至 Databend        | 必须上传文件至 Databend                      | 无需上传；用于从外部存储读取或卸载数据                                                                    |
| **使用场景**         | 个人/私有数据                  | 团队/共享数据                                | 外部数据集成或卸载                                                                                        |
| **路径格式**         | `@~/`                          | `@stage_name/`                               | `@stage_name/`                                                                                            |

### 内部 Stage

内部 Stage 的文件实际存储在 Databend 所在的对象存储中。组织内所有用户均可访问内部 Stage，每个用户都能利用该 Stage 进行数据加载或导出任务。与创建文件夹类似，创建 Stage 时需要指定名称。以下是使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建内部 Stage 的示例：

```sql
-- 创建名为 my_internal_stage 的内部 Stage
CREATE STAGE my_internal_stage;
```

### 外部 Stage

外部 Stage 允许您指定 Databend 所在位置之外的对象存储。例如，若您的数据集存储在 Google 云存储容器中，可使用该容器创建外部 Stage。创建外部 Stage 时，必须提供连接信息以便 Databend 访问外部存储位置。

以下是创建外部 Stage 的示例。假设您有一个名为 `databend-doc` 的 Amazon S3 存储桶存放数据集：

![alt text](/img/guides/external-stage.png)

您可以使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建外部 Stage 连接该存储桶：

```sql
-- 创建名为 my_external_stage 的外部 Stage
CREATE STAGE my_external_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        AWS_KEY_ID = '<您的密钥ID>',
        AWS_SECRET_KEY = '<您的密钥>'
    );
```

创建外部 Stage 后，即可从 Databend 访问数据集。例如列出文件：

```sql
LIST @my_external_stage;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │                 md5                │         last_modified         │      creator     │
├───────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ Inventory.csv │  57585 │ "0cd02fb636a22ba9f4ae4d24555a7d68" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
│ Products.csv  │  42987 │ "570e5cbf6a4b6e7e9a258094192f4784" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

请注意，外部存储必须是 Databend 支持的对象存储方案。[CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令页面提供了常用对象存储的连接信息配置示例。

### 用户 Stage

用户 Stage 可视为特殊的内部 Stage：其文件存储在 Databend 内部对象存储中，但其他用户无法访问。每个用户都默认拥有专属的用户 Stage，无需预先创建或命名。此外，用户无法删除自己的用户 Stage。

用户 Stage 适合作为无需共享的私有数据文件仓库。访问用户 Stage 需使用 `@~` 符号。例如列出 Stage 中所有文件：

```sql
LIST @~;
```

## 管理 Stage

Databend 提供多种命令帮助您管理 Stage 及其中的暂存文件：

| 命令                                                         | 描述                                                                                                                                                                                                                               | 适用于用户 Stage      | 适用于内部 Stage          | 适用于外部 Stage          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ------------------------- |
| [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) | 创建内部或外部 stage                                                                                                                                                                                                               | 否                    | 是                        | 是                        |
| [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage)     | 删除内部或外部 stage                                                                                                                                                                                                               | 否                    | 是                        | 是                        |
| [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage)     | 显示内部或外部 stage 的属性                                                                                                                                                                                                        | 否                    | 是                        | 是                        |
| [LIST](/sql/sql-commands/ddl/stage/ddl-list-stage)           | 返回 stage 中暂存文件的列表。或者，表函数 [LIST_STAGE](/sql/sql-functions/table-functions/list-stage) 提供类似功能，并增加了获取特定文件信息的灵活性                                                                                | 是                    | 是                        | 是                        |
| [REMOVE](/sql/sql-commands/ddl/stage/ddl-remove-stage)       | 从 stage 中移除暂存文件                                                                                                                                                                                                            | 是                    | 是                        | 是                        |
| [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages)   | 返回已创建的内部和外部 stage 列表                                                                                                                                                                                                  | 否                    | 是                        | 是                        |