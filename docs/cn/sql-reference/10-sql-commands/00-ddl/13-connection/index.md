---
title: Connection
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

### 什么是 Connection？

在 Databend 中，Connection 是指一种指定的配置，它封装了与外部存储服务交互所需的详细信息。它作为一个集中且可重用的参数集，例如访问凭据、端点 URL 和存储类型，从而简化了 Databend 与各种存储服务的集成。

Connection 可用于创建外部 Stage、外部表和附加表，从而提供了一种简化的模块化方法来管理和访问存储在外部存储服务中的数据（通过 Databend）。有关示例，请参见 [使用示例](#usage-examples)。

### 管理 Connections

要在 Databend 中管理 Connections，请使用以下命令：

<IndexOverviewList />

### 使用示例

本节中的示例首先创建一个 Connection，其中包含连接到 Amazon S3 所需的凭据。 随后，它们利用这个已建立的 Connection 来创建一个外部 Stage 并附加一个现有表。

以下语句启动与 Amazon S3 的 Connection，指定必要的 Connection 参数：

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

```

#### 示例 1：使用 Connection 创建外部 Stage

以下示例使用先前定义的名为“toronto”的 Connection 创建一个外部 Stage：

```sql
CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');


-- 等效于以下不使用 Connection 的语句：

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (
        SECRET_ACCESS_KEY = '<your-secret-access-key>' 
        ACCESS_KEY_ID = '<your-access-key-id>'
    );

```

#### 示例 2：使用 Connection 附加表

[ATTACH TABLE](../01-table/92-attach-table.md) 页面提供了[示例](../01-table/92-attach-table.md#examples)，演示了如何将 Databend Cloud 中的新表与 Databend 中的现有表连接起来，其中数据存储在名为“databend-toronto”的 Amazon S3 bucket 中。 在每个示例中，可以使用先前定义的名为“toronto”的 Connection 来简化步骤 3：

```sql title='Databend Cloud:'
ATTACH TABLE employees_backup 
    's3://databend-toronto/1/216/' 
    CONNECTION = (CONNECTION_NAME = 'toronto');

```

```sql title='Databend Cloud:'
ATTACH TABLE population_readonly 
    's3://databend-toronto/1/556/' 
    CONNECTION = (CONNECTION_NAME = 'toronto') 
    READ_ONLY;

```

#### 示例 3：使用 Connection 创建外部表

此示例演示如何使用先前定义的名为“toronto”的 Connection 创建名为“BOOKS”的外部表：

```sql
CREATE TABLE BOOKS (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
) 
's3://databend-toronto' 
CONNECTION = (CONNECTION_NAME = 'toronto');

```