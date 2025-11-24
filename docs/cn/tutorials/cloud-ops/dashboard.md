---
title: "Databend Cloud：仪表盘导览"
sidebar_label: "Dashboard"
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将加载、分析并为数据集“纽约时报 Covid-19 数据”创建一个 Dashboard。该数据集每日更新美国全国的病例、死亡和其他相关指标，可从国家、州、县等不同维度展现 2022 年疫情的全貌。

| 字段   | 说明                         |
|--------|------------------------------|
| date   | 已累积 Covid-19 数据的日期。 |
| county | 数据所属的县。               |
| state  | 数据所属的州。               |
| fips   | 对应地区的 FIPS 代码。       |
| cases  | 已确认病例的累计数量。       |
| deaths | 因 Covid-19 去世的累计数量。 |

### 步骤 1：准备数据

“纽约时报 Covid-19 数据”是一个内置示例数据集，只需几次点击即可加载。Databend Cloud 会自动创建目标表，无需事先建表。

<StepsWrap>
<StepContent number="1">

### 加载数据集

1. 在 Databend Cloud 的 **Overview** 页面点击 **Load Data**。
2. 在弹出的向导中选择 **A new table**，然后在 **Load sample data** 下拉列表中选择 **Covid-19 Data from New York Times.CSV**：

![Alt text](@site/static/public/img/cloud/dashboard-1.png)

3. 在下一页中，选择数据库并为要创建的目标表命名。

![Alt text](@site/static/public/img/cloud/dashboard-2.png)

4. 点击 **Confirm**。Databend Cloud 会创建目标表并加载数据，过程可能需要几秒钟。

</StepContent>

<StepContent number="2">

### 处理 NULL

在分析前建议检查并处理表中的 NULL 与重复值，以免影响结果。

1. 新建 Worksheet，运行以下 SQL 检查表内是否存在 NULL：

```sql
SELECT COUNT(*)
FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

返回的 `41571` 表示至少包含一个 NULL 的行数。

2. 删除所有包含 NULL 的行：

```sql
DELETE FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

</StepContent>

<StepContent number="2">

### 处理重复行

1. 在同一个 Worksheet 中运行以下 SQL 检查重复记录：

```sql
SELECT date, country, state, fips, cases, deaths, COUNT(*)
FROM covid_19_us_2022_3812
GROUP BY date, country, state, fips, cases, deaths
HAVING COUNT(*) > 1;
```

该查询返回 `0`，表示没有重复记录，数据可以用于分析。

</StepContent>
</StepsWrap>

### 步骤 2：基于查询结果创建图表

此步骤将运行四条查询，并将结果可视化为计分卡、饼图、柱状图与折线图。**请为每条查询创建单独的 Worksheet**。

<StepsWrap>
<StepContent number="1">

### 2022 年全美死亡总数

1. 在 Worksheet 中运行以下 SQL：

```sql
-- 统计 2022-12-31 当天美国的累积死亡总数
SELECT SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31';
```

2. 基于查询结果创建计分卡：

![Alt text](@site/static/public/img/cloud/dashboard-3.gif)

</StepContent>

<StepContent number="2">

### 各州死亡总数（2022）

1. 在 Worksheet 中运行以下 SQL：

```sql
-- 统计 2022-12-31 当天各州的累积死亡人数
SELECT state, SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31'
GROUP BY state;
```

2. 使用查询结果创建饼图：

![Alt text](@site/static/public/img/cloud/dashboard-4.gif)

</StepContent>

<StepContent number="3">

### 维京群岛的病例与死亡

1. 在 Worksheet 中运行以下 SQL：

```sql
-- 查询 2022-12-31 维京群岛的全部数据
SELECT * FROM covid_19_us_2022_3812
WHERE date = '2022-12-31' AND state = 'Virgin Islands';
```

2. 基于结果创建柱状图：

![Alt text](@site/static/public/img/cloud/dashboard-5.gif)

</StepContent>

<StepContent number="4">

### 圣约翰各月的病例与死亡

1. 在 Worksheet 中运行以下 SQL：

```sql
-- 获取 2022 年每月底圣约翰的数据
SELECT * FROM covid_19_us_2022_3812
WHERE
    (date = '2022-01-31'
    OR date = '2022-02-28'
    OR date = '2022-03-31'
    OR date = '2022-04-30'
    OR date = '2022-05-31'
    OR date = '2022-06-30'
    OR date = '2022-07-31'
    OR date = '2022-08-31'
    OR date = '2022-09-30'
    OR date = '2022-10-31'
    OR date = '2022-11-30'
    OR date = '2022-12-31')
    AND country = 'St. John' ORDER BY date;
```

2. 创建折线图展示结果：

![Alt text](@site/static/public/img/cloud/dashboard-6.gif)

</StepContent>
</StepsWrap>

### 步骤 3：将图表添加到 Dashboard

1. 在 Databend Cloud 中访问 **Dashboards** > **New Dashboard** 创建一个新的 Dashboard，并点击 **Add Chart**。
2. 将左侧的图表拖放到 Dashboard，可以根据需要调整尺寸与位置。

![Alt text](@site/static/public/img/cloud/dashboard-7.gif)
