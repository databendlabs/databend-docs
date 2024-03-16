---
title: ATTACH TABLE
sidebar_position: 6
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.180"/>

将现有表附加到另一个表。该命令将表的数据和架构从一个数据库移动到另一个数据库，但实际上不复制数据。相反，它创建一个指向原始表数据的链接，用于访问数据。

Attach Table 允许您无缝连接云服务平台中的表与私有部署环境中已部署的现有表，而无需物理移动数据。当您想要将数据从 Databend 的私有部署迁移到 [Databend Cloud](https://www.databend.com) 同时最小化数据传输开销时，这特别有用。

Attach Table 在源表和附加表之间提供无缝连接，数据同步机制根据模式的不同而有所不同：

- 在非只读模式下，源表中的更改会立即反映在附加表中，您可以根据需要更新附加表。然而，重要的是要注意，这些更新不会同步回源表。参见 [示例 1：在 Databend Cloud 中附加表](#example-1-attaching-table-in-databend-cloud) 以获取示例。

- 在只读模式下，源表中的更改也会立即反映在附加表中。然而，附加表专门用于查询目的，没有更新能力。参见 [示例 2：在 READ_ONLY 模式下附加表](#example-2-attaching-table-in-read_only-mode) 以获取示例。

## 语法

```sql
ATTACH TABLE <target_table_name> '<source_table_data_URI>' 
CONNECTION = ( <connection_parameters> ) [ READ_ONLY ]
```

- `<source_table_data_URI>` 代表源表数据的路径。对于类 S3 的对象存储，格式为 `s3://<bucket-name>/<database_ID>/<table_ID>`，例如，*s3://databend-toronto/1/23351/*，代表桶内表文件夹的确切路径。

  ![Alt text](@site/docs/public/img/sql/attach.png)

  要获取表的数据库 ID 和表 ID，请使用 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数。在下面的示例中，*snapshot_location* 的值中的部分 **1/23351/** 表示数据库 ID 为 **1**，表 ID 为 **23351**。

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

- `CONNECTION` 指定建立链接到存储源表数据的对象存储所需的连接参数。连接参数根据不同存储服务的具体要求和认证机制而有所不同。更多信息，请参见 [连接参数](../../../00-sql-reference/51-connect-parameters.md)。

- `READ_ONLY` 是一个可选参数，包含时，限制对附加表（<target_table_name>）的数据修改操作（例如，INSERT、UPDATE、DELETE），仅允许 SELECT 查询。

  :::note
  在只读模式下，如果源表中有架构更改，已附加的表必须被删除然后重新附加。
  :::

## 示例 {#examples}

### 示例 1：在 Databend Cloud 中附加表

此示例说明如何将 Databend Cloud 中的新表与存储在名为 "databend-toronto" 的 Amazon S3 桶中的 Databend 中的现有表链接。

#### 步骤 1. 在 Databend 中创建表

创建一个名为 "employees" 的表并插入一些示例数据：

```sql title='Databend:'
CREATE TABLE employees (
  id INT,
  name VARCHAR(50),
  salary DECIMAL(10, 2)
) ;

INSERT INTO employees (id, name, salary) VALUES
  (1, 'John Doe', 5000.00),
  (2, 'Jane Smith', 6000.00),
  (3, 'Mike Johnson', 7000.00);
```

#### 步骤 2. 获取数据库 ID 和表 ID

使用 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数获取数据库 ID 和表 ID。下面的结果表明数据库 ID 为 **1**，表 ID 为 **216**：

```sql title='Databend:'
SELECT * FROM FUSE_SNAPSHOT('default', 'employees');
```

#### 步骤 3. 在 Databend Cloud 中链接表格

登录Databend Cloud并在工作表中运行以下命令以链接名为“employees_backup”的表：

```sql title='Databend Cloud:'
ATTACH TABLE employees_backup 's3://databend-toronto/1/216/' CONNECTION = (
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```

要验证链接成功，请在Databend Cloud中运行以下查询：

```sql title='Databend Cloud:'
SELECT * FROM employees_backup;

-- 预期结果：
┌───────────────────────────────────────────────────────────────┐
│        id       │       name       │          salary          │
├─────────────────┼──────────────────┼──────────────────────────┤
│               1 │ John Doe         │ 5000.00                  │
│               2 │ Jane Smith       │ 6000.00                  │
│               3 │ Mike Johnson     │ 7000.00                  │
└───────────────────────────────────────────────────────────────┘
```

一切就绪！如果您在Databend中更新源表，您可以在Databend Cloud的目标表中观察到相同的更改。例如，如果您将源表“employees”中的名字“Mike Johnson”更新为“Eric Johnson”：

```sql title='Databend:'
UPDATE employees
SET name = 'Eric Johnson'
WHERE name = 'Mike Johnson';
```

您可以看到更新已同步到Databend Cloud中的附加表：

```sql title='Databend Cloud:'
SELECT * FROM employees_backup;

-- 预期结果：
┌───────────────────────────────────────────────────────────────┐
│        id       │       name       │          salary          │
├─────────────────┼──────────────────┼──────────────────────────┤
│               1 │ John Doe         │ 5000.00                  │
│               2 │ Jane Smith       │ 6000.00                  │
│               3 │ Eric Johnson     │ 7000.00                  │
└───────────────────────────────────────────────────────────────┘
```

您也可以更新Databend Cloud中的目标表，但更改不会同步到Databend中的源表。例如，如果您在目标表“employees_backup”中将“John Doe”的薪水更新为5500：

```sql title='Databend Cloud:'
UPDATE employees_backup
SET salary = 5500
WHERE name = 'John Doe';
```

“John Doe”的薪水将在源表“employees”中保持不变：

```sql title='Databend:'
SELECT salary FROM employees WHERE name = 'John Doe';

-- 预期结果：
5000.00
```

### 示例2：以READ_ONLY模式附加表

此示例说明如何在Databend Cloud中以READ_ONLY模式链接新表，该表与存储在名为“databend-toronto”的Amazon S3桶中的现有表相关联。

#### 第1步：在Databend中创建表

创建名为“population”的表并插入一些示例数据：

```sql title='Databend:'
CREATE TABLE population (
  city VARCHAR(50),
  population INT
);

INSERT INTO population (city, population) VALUES
  ('Toronto', 2731571),
  ('Montreal', 1704694),
  ('Vancouver', 631486);
```

#### 第2步：获取数据库ID和表ID

使用[FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)函数获取数据库ID和表ID。下面的结果表明数据库ID为**1**，表ID为**556**：

```sql title='Databend:'
SELECT * FROM FUSE_SNAPSHOT('default', 'population');
```

#### 步骤 3. 在 Databend Cloud 中链接表格

登录到 Databend Cloud 并在工作表中运行以下命令，以只读模式链接名为 "population_readonly" 的表格：

```sql title='Databend Cloud:'
ATTACH TABLE population_readonly 's3://databend-toronto/1/556/' CONNECTION = (
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
) READ_ONLY;
```

为了验证链接成功，运行以下查询在 Databend Cloud 中：

```sql title='Databend Cloud:'
SELECT * FROM population_readonly;

-- 预期结果：
┌────────────────────────────────────┐
│       城市       │    人口   │
├──────────────────┼─────────────────┤
│ Toronto          │         2731571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```

一切就绪！如果你在 Databend 的源表中更新数据，你可以在 Databend Cloud 的目标表中看到相同的变化反映。例如，如果你将 Toronto 的人口改为 2,371,571 在源表中：

```sql title='Databend:'
UPDATE population
SET population = 2371571
WHERE city = 'Toronto';
```

你可以看到更新同步到了 Databend Cloud 中的附加表：

```sql title='Databend Cloud:'
SELECT * FROM population_readonly;

-- 预期结果：
┌────────────────────────────────────┐
│       城市       │    人口   │
├──────────────────┼─────────────────┤
│ Toronto          │         2371571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```

如果你尝试在 Databend Cloud 中更新附加的表 "population_readonly"，你会遇到以下错误，因为表是以只读模式附加的：

![Alt text](@site/docs/public/img/sql/attach-table-3.png)
