---
title: MindsDB
sidebar_position: 7
---

数据库中的数据是宝贵资产。[MindsDB](https://mindsdb.com/) 让您能够利用数据进行预测分析，通过将机器学习引入数据库来加速 ML 开发流程。借助 MindsDB，您无需其他平台即可构建、训练、优化和部署 ML 模型。

Databend 和 Databend Cloud 均可作为数据源与 MindsDB 集成，从而为 Databend 带来机器学习能力。以下教程以 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集为例，展示如何与 MindsDB 集成并进行数据预测。

## 教程一：Databend 与 MindsDB 集成

开始前，请安装本地 MindsDB 或注册 MindsDB Cloud 账户。本教程使用 MindsDB Cloud。如需了解本地安装 MindsDB 的详细信息，请参考 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤 1. 加载数据集到 Databend

执行以下 SQL 语句，在 `default` 数据库中创建表并使用 COPY INTO 命令加载 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集：

```sql
CREATE TABLE pollution_measurement(
  MeasurementDate Timestamp,
  StationCode String,
  Address String,
  Latitude double,
  Longitude double,
  SO2 double,
  NO2 double,
  O3 double,
  CO double,
  PM10 double,
  PM25 double
);
COPY INTO pollution_measurement FROM 'https://datasets.databend.org/AirPolutionSeoul/Measurement_summary.csv' file_format=(type='CSV' skip_header=1);
```

### 步骤 2. 连接 MindsDB 至 Databend

1. 将以下 SQL 语句复制到 MindsDB Cloud Editor 并点击 **运行**：

```sql
CREATE DATABASE databend_datasource
WITH engine='databend',
parameters={
    "protocol": "https",
    "user": "<YOUR-USERNAME>",
    "port": 8000,
    "password": "<YOUR-PASSWORD>",
    "host": "<YOUR-HOST>",
    "database": "default"
};
```

:::tip
上述 SQL 语句将 Databend 中的 `default` 数据库连接到您的 MindsDB Cloud 账户。参数说明请参考 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在 MindsDB Cloud Editor 中执行以下 SQL 语句验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```

![验证截图](/img/integration/mindsdb-verify.png)

### 步骤 3. 创建预测器

在 MindsDB Cloud Editor 中执行以下 SQL 语句创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

预测器将开始训练。您可以通过以下查询检查状态：

```sql
SELECT *
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
模型状态必须变为 `complete` 后才能开始预测。
:::

### 步骤 4. 执行预测

在 MindsDB Cloud Editor 中执行以下 SQL 语句预测 SO2 浓度：

```sql
SELECT
    SO2 AS predicted,
    SO2_confidence AS confidence,
    SO2_explain AS info
FROM mindsdb.airq_predictor
WHERE (NO2 = 0.005)
    AND (CO = 1.2)
    AND (PM10 = 5)
```

输出结果：

![预测结果](/img/integration/mindsdb-predict.png)

## 教程二：Databend Cloud 与 MindsDB 集成

开始前，请安装本地 MindsDB 或注册 MindsDB Cloud 账户。本教程使用 MindsDB Cloud。如需了解本地安装 MindsDB 的详细信息，请参考 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤 1. 加载数据集到 Databend Cloud

在 Databend Cloud 工作表中执行以下 SQL 语句，在 `default` 数据库中创建表并使用 COPY INTO 命令加载 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集：

```sql
CREATE TABLE pollution_measurement(
  MeasurementDate Timestamp,
  StationCode String,
  Address String,
  Latitude double,
  Longitude double,
  SO2 double,
  NO2 double,
  O3 double,
  CO double,
  PM10 double,
  PM25 double
);

COPY INTO pollution_measurement FROM 'https://repo.databend.com/AirPolutionSeoul/Measurement_summary.csv' file_format=(type='CSV' skip_header=1);
```

### 步骤 2. 连接 MindsDB 至 Databend Cloud

1. 将以下 SQL 语句复制到 MindsDB Cloud Editor 并点击 **运行**：

```sql
CREATE DATABASE databend_datasource
WITH engine='databend',
parameters={
    "protocol": "https",
    "user": "cloudapp",
    "port": 443,
    "password": "<YOUR-PASSWORD>",
    "host": "<YOUR-HOST>",
    "database": "default"
};
```

:::tip
上述 SQL 语句将 Databend Cloud 中的 `default` 数据库连接到您的 MindsDB Cloud 账户。参数值可从计算集群的连接信息中获取。详情请参阅 [连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。参数说明请参考 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在 MindsDB Cloud Editor 中执行以下 SQL 语句验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```

![验证截图](@site/static/img/documents/BI/mindsdb-verify.png)

### 步骤 3. 创建预测器

在 MindsDB Cloud Editor 中执行以下 SQL 语句创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

预测器将开始训练。您可以通过以下查询检查状态：

```sql
SELECT *
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
模型状态必须变为 `complete` 后才能开始预测。
:::

### 步骤 4. 执行预测

在 MindsDB Cloud Editor 中执行以下 SQL 语句预测 SO2 浓度：

```sql
SELECT
    SO2 AS predicted,
    SO2_confidence AS confidence,
    SO2_explain AS info
FROM mindsdb.airq_predictor
WHERE (NO2 = 0.005)
    AND (CO = 1.2)
    AND (PM10 = 5)
```

输出结果：

![预测结果](@site/static/img/documents/BI/mindsdb-predict.png)