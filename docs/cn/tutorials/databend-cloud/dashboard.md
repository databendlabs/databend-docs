---
title: COVID-19 数据仪表盘
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将加载、分析并创建一个名为“来自纽约时报的 Covid-19 数据”的数据集的仪表盘。该数据集包含每日更新的关于美国 Covid-19 病例、死亡和其他相关统计数据的信息。它提供了对疫情在美国全国、州和县各级影响的全面了解，提供了对 2022 年全年各个地区 Covid-19 情况的详细见解。

| 字段    | 描述                                       |
|----------|---------------------------------------------------|
| date     | 报告的累计 Covid-19 数据的日期。|
| county   | 数据条目的县名称。        |
| state    | 数据条目的州名称。         |
| fips     | 与位置关联的 FIPS 代码。      |
| cases    | 确诊 Covid-19 病例的累计数量。|
| deaths   | 因 Covid-19 导致的累计死亡人数。  |

### 步骤 1：准备数据

数据集“来自纽约时报的 Covid-19 数据”是一个内置的示例数据集，您只需点击几下即可加载。目标表会自动创建，因此您无需提前创建它。

<StepsWrap>
<StepContent number="1">

### 加载数据集

1. 在 Databend Cloud 中，点击**概览**页面上的 **加载数据** 按钮。
2. 在打开的页面上，选择**新表**单选按钮，然后从**加载示例数据**下拉菜单中选择 **Covid-19 Data from New York Times.CSV**：

![Alt text](@site/static/public/img/cloud/dashboard-1.png)

3. 在下一页上，选择一个数据库并为要创建的目标表设置一个名称。

![Alt text](@site/static/public/img/cloud/dashboard-2.png)

4. 点击**确认**。Databend Cloud 开始创建目标表并加载数据集。此过程可能需要几秒钟。

</StepContent>

<StepContent number="2">


### 处理 NULL 值

在进行分析工作之前，建议检查表中是否存在 NULL 值和重复值，因为它们可能会影响结果。

1. 创建一个工作表，并使用以下 SQL 语句检查表中是否存在 NULL 值：

```sql
SELECT COUNT(*)
FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

此 SQL 语句返回 `41571`，表示包含至少一个 NULL 值的行数。

2. 从表中删除包含至少一个 NULL 值的行：

```sql
DELETE FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

</StepContent>

<StepContent number="2">


### 处理重复值

1. 在同一个工作表中，使用以下 SQL 语句检查表中是否存在重复值：

```sql
SELECT date, country, state, fips, cases, deaths, COUNT(*)
FROM covid_19_us_2022_3812
GROUP BY date, country, state, fips, cases, deaths
HAVING COUNT(*) > 1;
```

此 SQL 语句返回 `0`，表示表中没有重复的行，现在可以进行数据分析了。

</StepContent>
</StepsWrap>

### 步骤 2：使用查询结果创建图表

在这一步中，我们将运行四个查询来从数据中提取见解，并通过记分卡、饼图、条形图和折线图来可视化结果。**请为每个查询创建一个单独的工作表**。

<StepsWrap>
<StepContent number="1">

### 2022 年美国总死亡人数

1. 在工作表中运行以下 SQL 语句：

```sql
-- Calculate the total number of deaths in the US on December 31, 2022
SELECT SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31';
```

2. 使用查询结果在工作表中创建一个记分卡：

![Alt text](@site/static/public/img/cloud/dashboard-3.gif)

</StepContent>

<StepContent number="2">


### 2022 年各州总死亡人数

1. 在工作表中运行以下 SQL 语句：

```sql
-- Calculate the total number of deaths by state on December 31, 2022
SELECT state, SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31'
GROUP BY state;
```

2. 使用查询结果在工作表中创建一个饼图：

![Alt text](@site/static/public/img/cloud/dashboard-4.gif)

</StepContent>

<StepContent number="3">

### 维尔京群岛的病例和死亡人数

1. 在工作表中运行以下 SQL 语句：

```sql
-- Retrieve all data for the state of Virgin Islands on December 31, 2022
SELECT * FROM covid_19_us_2022_3812
WHERE date = '2022-12-31' AND state = 'Virgin Islands';
```

2. 使用查询结果在工作表中创建一个条形图：

![Alt text](@site/static/public/img/cloud/dashboard-5.gif)

</StepContent>

<StepContent number="4">


### 圣约翰每月累计病例和死亡人数

1. 在工作表中运行以下 SQL 语句：

```sql
-- Retrieve data for St. John at the end of each month
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

2. 使用查询结果在工作表中创建一个折线图：

![Alt text](@site/static/public/img/cloud/dashboard-6.gif)

</StepContent>
</StepsWrap>

### 步骤 3：将图表添加到仪表盘

1. 在 Databend Cloud 中，在 **仪表盘** > **新建仪表盘** 上创建一个仪表盘，然后点击仪表盘上的 **添加图表**。

2. 将左侧的图表拖放到仪表盘上。您可以根据需要调整图表的大小或重新定位。

![Alt text](@site/static/public/img/cloud/dashboard-7.gif)
