---
title: 连接
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

### 什么是连接？

在 Databend 中，连接指的是一个指定的配置，它封装了与外部存储服务交互所需的详细信息。它作为一个集中的、可重用的参数集合，如访问凭证、端点 URL 和存储类型，便于 Databend 与各种存储服务的集成。

连接可用于创建外部阶段、外部表和附加表，提供了一种简化和模块化的方式，通过 Databend 管理和访问存储在外部存储服务中的数据。参见 [使用示例](#usage-examples) 以获取示例。

### 管理连接

要在 Databend 中管理连接，请使用以下命令：

<IndexOverviewList />

### 使用示例

本节中的示例首先创建一个连接，该连接包含连接到 Amazon S3 所需的凭证。随后，它们利用这个已建立的连接来创建一个外部阶段并附加一个现有表。

此语句启动与 Amazon S3 的连接，指定必要的连接参数：

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';

```

#### 示例 1：使用连接创建外部阶段

以下示例使用先前定义的名为 'toronto' 的连接创建一个外部阶段：

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

[ATTACH TABLE](../01-table/92-attach-table.md) 页面提供了 [示例](../01-table/92-attach-table.md#examples)，展示了如何在 Databend Cloud 中连接一个新表与 Databend 中的现有表，其中数据存储在名为 "databend-toronto" 的 Amazon S3 存储桶中。在每个示例中，步骤 3 可以使用先前定义的名为 'toronto' 的连接来简化：

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

此示例展示了使用先前定义的名为 'toronto' 的连接创建一个名为 'BOOKS' 的外部表：

```sql
CREATE TABLE BOOKS (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
) 
's3://databend-toronto' 
CONNECTION = (CONNECTION_NAME = 'toronto');

```