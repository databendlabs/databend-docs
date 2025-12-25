---
title: 什么是 Stage？
---

Stage 是 Databend 中用于存放数据文件的虚拟位置。您可以直接查询 Stage 中的文件，也可以将其加载到表里；反过来，也可以把表数据导出到 Stage。

Stage 的好处在于使用简单，就像操作电脑里的文件夹：您只需指定 Stage 名称和文件名（如 `@mystage/mydatafile.csv`），无需关心文件在对象存储中的实际路径。您可以按需创建任意数量的 Stage，但 Stage 之间相互独立，不能嵌套。

Stage 还能提升文件管理效率。通过 [BendSQL](../../35-connect/00-sql-clients/bendsql/index.md)，一条命令即可完成文件上传或下载。加载数据时，可在 COPY INTO 命令中指定 Stage，实现文件读取和筛选；导出数据时，同样可以将文件写入 Stage。

## Stage 类型

根据存储位置和访问权限的不同，Stage 分为三种类型：

|                      | 用户 Stage                      | 内部 Stage                                   | 外部 Stage                                                                                                |
|----------------------|--------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **存储位置**         | Databend 内部对象存储       | Databend 内部对象存储                     | 外部对象存储（如 S3、Azure）                                                                              |
| **创建方式**         | 系统自动创建                       | 手动创建：`CREATE STAGE stage_name;`         | 手动创建：`CREATE STAGE stage_name` `'s3://bucket/prefix/'` `CONNECTION=(endpoint_url='x', ...);`         |
| **访问权限**         | 仅本人可用               | 可共享给其他用户或角色                       | 可共享给其他用户或角色                                                                                    |
| **删除行为**       | 不可删除                     | 删除 Stage 同时清空文件                    | 仅删除 Stage 定义，外部文件保留                                                                        |
| **文件上传**         | 需上传到 Databend        | 需上传到 Databend                      | 无需上传，直接读写外部存储                                                                    |
| **适用场景**         | 个人私有数据                  | 团队共享数据                                | 对接外部数据源或导出数据                                                                                        |
| **路径格式**         | `@~/`                          | `@stage_name/`                               | `@stage_name/`                                                                                            |

### 内部 Stage

内部 Stage 的文件存储在 Databend 所在的对象存储中，组织内所有用户都可以访问。创建时需指定名称：

```sql
-- 创建名为 my_internal_stage 的内部 Stage
CREATE STAGE my_internal_stage;
```

### 外部 Stage

外部 Stage 用于对接 Databend 之外的对象存储。例如，您的数据存放在 Google Cloud Storage 或 Amazon S3 中，就可以创建外部 Stage 来访问。创建时需提供连接信息。

假设您有一个名为 `databend-doc` 的 S3 存储桶：

![alt text](/img/guides/external-stage.png)

可以用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建外部 Stage：

```sql
-- 创建外部 Stage
CREATE STAGE my_external_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        AWS_KEY_ID = '<您的密钥ID>',
        AWS_SECRET_KEY = '<您的密钥>'
    );
```

创建后即可访问其中的数据，比如列出文件：

```sql
LIST @my_external_stage;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │                 md5                │         last_modified         │      creator     │
├───────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ Inventory.csv │  57585 │ "0cd02fb636a22ba9f4ae4d24555a7d68" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
│ Products.csv  │  42987 │ "570e5cbf6a4b6e7e9a258094192f4784" │ 2024-03-17 21:22:38.000 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

> 外部存储必须是 Databend 支持的对象存储。[CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 页面列出了各类对象存储的连接配置示例。

### 用户 Stage

用户 Stage 是一种特殊的内部 Stage：文件存储在 Databend 内部，但仅本人可见。每个用户自动拥有一个用户 Stage，无需手动创建，也无法删除。

用户 Stage 适合存放不需要共享的私有文件。访问时使用 `@~`，例如列出所有文件：

```sql
LIST @~;
```

## 管理 Stage

Databend 提供以下命令来管理 Stage 及其中的文件：

| 命令                                                         | 说明                                                                                                                                                                                                                               | 用户 Stage      | 内部 Stage          | 外部 Stage          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ------------------------- |
| [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) | 创建内部或外部 Stage                                                                                                                                                                                                               | ✗                    | ✓                        | ✓                        |
| [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage)     | 删除 Stage                                                                                                                                                                                                               | ✗                    | ✓                        | ✓                        |
| [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage)     | 查看 Stage 属性                                                                                                                                                                                                        | ✗                    | ✓                        | ✓                        |
| [LIST](/sql/sql-commands/ddl/stage/ddl-list-stage)           | 列出 Stage 中的文件。也可使用表函数 [LIST_STAGE](/sql/sql-functions/table-functions/list-stage)，支持更灵活的文件查询                                                                                | ✓                    | ✓                        | ✓                        |
| [REMOVE](/sql/sql-commands/ddl/stage/ddl-remove-stage)       | 删除 Stage 中的文件                                                                                                                                                                                                            | ✓                    | ✓                        | ✓                        |
| [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages)   | 列出已创建的 Stage                                                                                                                                                                                                  | ✗                    | ✓                        | ✓                        |