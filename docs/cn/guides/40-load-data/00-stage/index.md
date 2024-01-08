---
title: 理解 Stage
slug: whystage
---

在 Databend 中，Stage 是一个存储位置，数据文件在加载到表中或导出到外部系统之前存储在这里。使用 Databend 中的 Stage 的好处之一是它简化了数据文件的管理和访问。通过使用 Stage，您可以轻松地从 Stage 文件中加载数据或使用提供的工具和命令将数据卸载到 Stage，而无需担心它们的具体存储位置。此外，Databend 提供了易于管理 Stage 中文件的 API 和 SQL 命令。

Databend 提供了三种不同类型的 Stage：用户 Stage（User stage）、内部 Stage（Internal stage）和外部 Stage（External stage）。

### 用户 Stage {/_user-stage_/}

在 Databend 中，每个用户都有一个默认的 Stage，称为用户 Stage。当您将数据文件存储在用户 Stage 时，它们实际上是保存在对象存储上您的存储桶中。例如，如果您在 Amazon S3 上的存储桶是 "databend-toronto"，如下所配置：

```toml title='databend-query.toml'
...
# 要使用与 S3 兼容的对象存储，请取消注释此块并设置您的值。
[storage.s3]
bucket = "databend-toronto"
...
```

每个用户的用户 Stage 中保存的文件可以在下面的快照中显示的路径中找到。_root_ 文件夹存储 root 用户的文件。

![Alt text](@site/docs/public/img/load/userstage.png)

在使用用户 Stage 时，请注意以下事项：

- 用户 Stage 开箱即用。在使用前无需创建，您也不能更改或删除它。
- 您的用户 Stage 中存储的数据文件对其他用户不可访问。
- 您不能为用户 Stage 设置格式选项。相反，您可以在加载数据时在 COPY INTO 命令中设置它们。

要引用用户 Stage，请使用 `@~`。请参见下面的示例：

```sql
-- 列出用户Stage中的Stage文件
LIST @~;

-- 从用户Stage删除所有文件
REMOVE @~;
```

### 内部 Stage {/_internal-stage_/}

在 Databend 中，内部 Stage 将数据文件存储在 databend-query.toml 中指定的存储后端。例如，如果您在 Amazon S3 上的存储桶是 "databend-toronto"，如下所配置：

```toml title='databend-query.toml'
...
# 要使用与 S3 兼容的对象存储，请取消注释此块并设置您的值。
[storage.s3]
bucket = "databend-toronto"
...
```

在内部 Stage 中保存的文件可以在下面的快照中显示的路径中找到。_my_internal_stage/_ 文件夹存储名为 "my_internal_stage" 的内部 Stage 的文件。

![Alt text](@site/docs/public/img/load/internalstage.png)

与自动为每个用户创建且无法修改的用户 Stage 不同，内部 Stage 可以由用户创建，并提供更多对数据加载和访问的控制。拥有适当权限的其他用户可以访问内部 Stage 中的 Stage 数据文件，并将它们加载到表中。

### 外部 Stage {/_external-stage_/}

Databend 中的外部 Stage 将数据文件存储在 databend-query.toml 中指定的存储后端之外。当您使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建外部 Stage 时，您需要指定存储数据文件的 Stage 位置。数据可以存储在云存储服务上，如 AWS S3 和 Google Cloud Storage。

使用外部 Stage 的好处之一是它可以在有权访问同一外部存储系统的多个用户之间共享数据文件。此外，您可以使用外部 Stage 直接从外部存储系统中存储的文件加载数据到 Databend 表中，或将 Databend 数据导出到存储在外部存储系统中的文件。
