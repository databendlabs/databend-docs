---
title: MindsDB
---

数据库中的数据是宝贵的资产。 [MindsDB](https://mindsdb.com/) 使您能够使用您的数据并进行预测。它通过将机器学习引入数据库来加速 ML 开发过程。借助 MindsDB，您可以构建、训练、优化和部署您的 ML 模型，而无需其他平台。

Databend Cloud 可作为数据源与与 MindsDB 的集成作为数据源，从而将机器学习功能引入 Databend Cloud。以下教程以 [Air Pollution in Seoul](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集为例，介绍如何与 MindsDB 集成并进行数据预测。

## 教程：与 MindsDB 集成

开始前，在本地安装 MindsDB 或注册一个 MindsDB Cloud 账号。本教程使用 MindsDB Cloud。有关如何安装本地 MindsDB 的更多信息，请参阅 https://docs.mindsdb.com/quickstart#1-create-a-mindsdb-cloud-account-or-install-mindsdb-locally

## 第一步：将数据集加载到 Databend Cloud

在 Databend Cloud 中打开一个工作表，然后运行以下 SQL 语句在数据库 `default` 中创建一个表并使用 COPY INTO 命令加载 [Air Pollution in Seoul](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul) 数据集：

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

## 第二步：将 MindsDB 连接到 Databend Cloud

1. 将以下 SQL 语句复制并粘贴到 MindsDB Cloud Editor，然后单击 **Run**：

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
上面的 SQL 语句将 Databend Cloud 中的数据库“default”连接到您的 MindsDB Cloud 账号。参数值可以从您仓库的连接信息中获取。有关详细信息，请参阅[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。关于参数的解释，参考 https://docs.mindsdb.com/data-integrations/all-data-integrations#databend
:::

2. 在 MindsDB Cloud Editor 中，运行以下 SQL 语句来验证集成：

```sql
SELECT * FROM databend_datasource.pollution_measurement LIMIT 10;
```
![Alt text](@site/static/img/documents/BI/mindsdb-verify.png)

## 第三步：创建预测器

在 MindsDB Cloud Editor 中，运行以下 SQL 语句来创建预测器：

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
在开始进行预测之前，模型的状态必须为“complete”(已完成)。
:::

## 第四步：开始预测

在 MindsDB Cloud Editor 中，运行以下 SQL 语句来预测 SO2 的浓度：

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

结果：

![Alt text](@site/static/img/documents/BI/mindsdb-predict.png)