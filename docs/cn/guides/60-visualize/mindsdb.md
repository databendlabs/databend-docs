---
title: MindsDB
---

数据库中的数据是一项宝贵的资产。[MindsDB](https://mindsdb.com/) 使您能够使用您的数据并进行预测。它通过将机器学习引入数据库，加速了机器学习开发过程。使用MindsDB，您可以在不需要其他平台的情况下构建、训练、优化和部署您的机器学习模型。

Databend和Databend Cloud都可以集成MindsDB作为数据源，这为Databend带来了机器学习能力。以下教程将向您展示如何与MindsDB集成并使用[首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul)数据集进行数据预测。

## 教程-1：将Databend与MindsDB集成

在开始之前，请安装本地MindsDB或注册MindsDB Cloud账户。本教程使用MindsDB Cloud。有关如何安装本地MindsDB的更多信息，请参考 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤1. 将数据集加载到Databend

运行以下SQL语句，在数据库`default`中创建一个表，并使用COPY INTO命令加载[首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul)数据集：

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

### 步骤2. 将MindsDB连接到Databend

1. 复制并粘贴以下SQL语句到MindsDB Cloud编辑器，并点击**运行**：

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
上面的SQL语句将Databend中的数据库`default`连接到您的MindsDB Cloud账户。关于参数的解释，请参考 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在MindsDB Cloud编辑器中，运行以下SQL语句以验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```

![Alt text](@site/docs/public/img/integration/mindsdb-verify.png)

### 步骤3. 创建预测器

在MindsDB Cloud编辑器中，运行以下SQL语句创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

现在预测器将开始训练。您可以使用以下查询检查状态：

```sql
SELECT *
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
模型的状态必须是`complete`，然后您才能开始进行预测。
:::

### 步骤4. 进行预测

在MindsDB Cloud编辑器中，运行以下SQL语句来预测SO2的浓度：

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

![Alt text](@site/docs/public/img/integration/mindsdb-predict.png)

## 教程-2：将Databend Cloud与MindsDB集成

在开始之前，请安装本地MindsDB或注册MindsDB Cloud账户。本教程使用MindsDB Cloud。有关如何安装本地MindsDB的更多信息，请参考 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

### 步骤1. 将数据集加载到Databend Cloud

在Databend Cloud中打开一个工作表，并运行以下SQL语句在数据库`default`中创建一个表，并使用COPY INTO命令加载[首尔空气污染](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul)数据集：

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
 
COPY INTO pollution_measurement FROM 'https://repo.databend.rs/AirPolutionSeoul/Measurement_summary.csv' file_format=(type='CSV' skip_header=1);
```

### 步骤2. 将MindsDB连接到Databend Cloud

1. 复制并粘贴以下SQL语句到MindsDB Cloud编辑器，并点击**运行**：

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
上面的SQL语句将Databend Cloud中的数据库`default`连接到您的MindsDB Cloud账户。参数值可以从您的数据仓库连接信息中获得。更多信息，请参见[连接到数据仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。关于参数的解释，请参考 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在MindsDB Cloud编辑器中，运行以下SQL语句以验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```
![Alt text](@site/static/img/documents/BI/mindsdb-verify.png)

### 步骤3. 创建预测器

在MindsDB Cloud编辑器中，运行以下SQL语句创建预测器：

```sql
CREATE PREDICTOR airq_predictor
FROM databend_datasource (SELECT * FROM pollution_measurement LIMIT 50)
PREDICT so2;
```

现在预测器将开始训练。您可以使用以下查询检查状态：

```sql
SELECT * 
FROM mindsdb.models
WHERE name='airq_predictor';
```

:::note
模型的状态必须是`complete`，然后您才能开始进行预测。
:::

### 步骤4. 进行预测

在MindsDB Cloud编辑器中，运行以下SQL语句来预测SO2的浓度：

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



```markdown
![Alt text](@site/static/img/documents/BI/mindsdb-predict.png)
```