---
title: MindsDB
---

数据库中的数据是一项宝贵的资产。[MindsDB](https://mindsdb.com/) 使您能够使用您的数据并进行预测。它通过将机器学习引入数据库来加速 ML 开发过程。借助 MindsDB，您可以构建、训练、优化和部署 ML 模型，而无需其他平台。

Databend 和 Databend Cloud 都可以与 MindsDB 集成作为数据源，从而将机器学习功能引入 Databend。以下教程展示了如何与 MindsDB 集成并进行数据预测，以 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集为例。

## 教程 1：将 Databend 与 MindsDB 集成

在开始之前，请安装本地 MindsDB 或注册 MindsDB Cloud 帐户。本教程使用 MindsDB Cloud。有关如何安装本地 MindsDB 的更多信息，请参阅 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤 1. 将数据集加载到 Databend 中

运行以下 SQL 语句以在数据库 `default` 中创建表，并使用 COPY INTO 命令加载 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集：

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

### 步骤 2. 将 MindsDB 连接到 Databend

1. 复制以下 SQL 语句并将其粘贴到 MindsDB Cloud Editor 中，然后单击 **Run**：

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
上面的 SQL 语句将 Databend 中的数据库 `default` 连接到您的 MindsDB Cloud 帐户。有关参数的说明，请参阅 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在 MindsDB Cloud Editor 中，运行以下 SQL 语句以验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```

![Alt text](/img/integration/mindsdb-verify.png)

### 步骤 3. 创建预测器

在 MindsDB Cloud Editor 中，运行以下 SQL 语句以创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

现在，预测器将开始训练。您可以使用以下查询检查状态：

```sql
SELECT *
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
在开始进行预测之前，模型的状态必须为 `complete`。
:::

### 步骤 4. 进行预测

在 MindsDB Cloud Editor 中，运行以下 SQL 语句以预测 SO2 的浓度：

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

输出：

![Alt text](/img/integration/mindsdb-predict.png)

## 教程 2：将 Databend Cloud 与 MindsDB 集成

在开始之前，请安装本地 MindsDB 或注册 MindsDB Cloud 帐户。本教程使用 MindsDB Cloud。有关如何安装本地 MindsDB 的更多信息，请参阅 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤 1. 将数据集加载到 Databend Cloud 中

在 Databend Cloud 中打开一个工作表，然后运行以下 SQL 语句以在数据库 `default` 中创建表，并使用 COPY INTO 命令加载 [首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集：

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

### 步骤 2. 将 MindsDB 连接到 Databend Cloud

1. 复制以下 SQL 语句并将其粘贴到 MindsDB Cloud Editor 中，然后单击 **Run**：

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
上面的 SQL 语句将 Databend Cloud 中的数据库 `default` 连接到您的 MindsDB Cloud 帐户。参数值可以从您的计算集群的连接信息中获得。有关更多信息，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。有关参数的说明，请参阅 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在 MindsDB Cloud Editor 中，运行以下 SQL 语句以验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```

![Alt text](@site/static/img/documents/BI/mindsdb-verify.png)

### 步骤 3. 创建预测器

在 MindsDB Cloud Editor 中，运行以下 SQL 语句以创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

现在，预测器将开始训练。您可以使用以下查询检查状态：

```sql
SELECT *
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
在开始进行预测之前，模型的状态必须为 `complete`。
:::

### 步骤 4. 进行预测

在 MindsDB Cloud Editor 中，运行以下 SQL 语句以预测 SO2 的浓度：

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

输出：

![Alt text](@site/static/img/documents/BI/mindsdb-predict.png)