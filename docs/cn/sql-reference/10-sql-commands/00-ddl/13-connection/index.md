---
title: 连接
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

### 什么是连接？

在 Databend 中，连接指的是一个指定的配置，它封装了与外部存储服务交互所需的详细信息。它作为一组集中且可重用的参数，例如访问凭证、端点 URL 和存储类型，便于 Databend 与各种存储服务的集成。

连接可用于创建外部 Stage、外部表以及附加表，提供了一种流线化和模块化的方法来管理和访问通过 Databend 存储在外部存储服务中的数据。有关示例，请参见[使用示例](#usage-examples)。

### 管理连接

要管理 Databend 中的连接，请使用以下命令：

<IndexOverviewList />

### 使用示例

本节中的示例首先创建了一个连接，其中包含连接到 Amazon S3 所需的凭证。随后，它们利用这个已建立的连接来创建一个外部 Stage 并附加一个现有表。

以下语句启动了一个到 Amazon S3 的连接，指定了必要的连接参数：

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

```

#### 示例 1：使用连接创建外部 Stage

以下示例使用先前定义的名为 'toronto' 的连接创建了一个外部 Stage：

```sql
CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');


-- 等同于以下不使用连接的语句：

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (
        SECRET_ACCESS_KEY = '<your-secret-access-key>' 
        ACCESS_KEY_ID = '<your-access-key-id>'
    );

```

#### 示例 2：使用连接附加表

[ATTACH TABLE](../01-table/92-attach-table.md) 页面提供了[示例](../01-table/92-attach-table.md#examples)，展示了如何在 Databend Cloud 中连接一个新表与 Databend 中的现有表，其中数据存储在名为 "databend-toronto" 的 Amazon S3 存储桶中。在每个示例中，步骤 3 可以使用先前定义的名为 'toronto' 的连接进行简化：

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

#### 示例 3：使用连接创建外部表

此示例展示了如何使用先前定义的名为 'toronto' 的连接创建一个名为 'BOOKS' 的外部表：

```sql
CREATE TABLE BOOKS (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
) 
's3://databend-toronto' 
CONNECTION = (CONNECTION_NAME = 'toronto');

```