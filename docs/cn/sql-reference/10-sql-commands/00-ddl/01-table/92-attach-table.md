---
title: ATTACH TABLE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.698"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ATTACH TABLE'/>

将现有表附加到另一个表。该命令将表的数据和模式从一个数据库移动到另一个数据库，但实际上并不复制数据。相反，它创建一个指向原始表数据的链接以访问数据。

- Attach Table 使您能够无缝地将云服务平台中的表连接到私有化部署环境中现有的表，而无需物理移动数据。这在您希望将数据从 Databend 的私有化部署迁移到 [Databend Cloud](https://www.databend.com) 同时最小化数据传输开销时特别有用。

- 附加的表以 READ_ONLY 模式运行。在此模式下，源表中的更改会立即反映在附加的表中。然而，附加的表仅用于查询目的，不支持更新。这意味着在附加的表上不允许执行 INSERT、UPDATE 和 DELETE 操作；只能执行 SELECT 查询。

## 语法

```sql
ATTACH TABLE <目标表名> [ ( <列列表> ) ] '<源表数据_URI>'
CONNECTION = ( <连接参数> )
```
- `<列列表>`: 一个可选的、逗号分隔的列列表，用于包含源表中的列，允许用户指定仅需要的列，而不是包含所有列。如果未指定，将包含源表中的所有列。

  - 在源表中重命名包含的列会更新其在附加表中的名称，并且必须使用新名称访问它。
  - 在源表中删除包含的列会使其在附加表中无法访问。
  - 对未包含的列的更改，例如在源表中重命名或删除它们，不会影响附加表。

- `<源表数据_URI>` 表示源表数据的路径。对于 S3 类似的对象存储，格式为 `s3://<bucket-name>/<database_ID>/<table_ID>`，例如 _s3://databend-toronto/1/23351/_，它表示桶内表文件夹的确切路径。

  ![Alt text](/img/sql/attach.png)

  要获取表的数据库 ID 和表 ID，请使用 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数。在下面的示例中，_snapshot_location_ 值中的 **1/23351/** 部分表示数据库 ID 为 **1**，表 ID 为 **23351**。

  ```sql
  SELECT * FROM FUSE_SNAPSHOT('default', 'employees');

  Name                |Value                                              |
  --------------------+---------------------------------------------------+
  snapshot_id         |d6cd1f3afc3f4ad4af298ad94711ead1                   |
  snapshot_location   |1/23351/_ss/d6cd1f3afc3f4ad4af298ad94711ead1_v4.mpk|
  format_version      |4                                                  |
  previous_snapshot_id|                                                   |
  segment_count       |1                                                  |
  block_count         |1                                                  |
  row_count           |3                                                  |
  bytes_uncompressed  |122                                                |
  bytes_compressed    |523                                                |
  index_size          |470                                                |
  timestamp           |2023-07-11 05:38:27.0                              |
  ```

- `CONNECTION` 指定建立与存储源表数据的对象存储链接所需的连接参数。连接参数因不同存储服务的特定要求和认证机制而异。有关更多信息，请参见 [连接参数](../../../00-sql-reference/51-connect-parameters.md)。

## 教程

- [使用 ATTACH TABLE 链接表](/tutorials/databend-cloud/link-tables)

## 示例

此示例创建一个附加表，其中包含存储在 AWS S3 中的源表的所有列：

```sql
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```

此示例创建一个附加表，其中仅包含存储在 AWS S3 中的源表的选定列（`city` 和 `population`）：

```sql
ATTACH TABLE population_only (city, population) 's3://databend-doc/1/16/' CONNECTION = (
  REGION='us-east-2',
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```