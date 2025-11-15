---
title: 为 COVID-19 数据构建仪表盘（Dashboard）
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将加载、分析名为“Covid-19 Data from New York Times”的数据集，并为其创建仪表盘（Dashboard）。该数据集包含美国全境每日更新的 Covid-19 病例、死亡及相关统计信息，可全面展示 2022 年全年疫情在全国、州、县各级的影响与细节。

| 字段    | 描述                                         |
|---------|----------------------------------------------|
| date    | 报告的 Covid-19 累计数据日期。               |
| county  | 该条数据对应的县名称。                       |
| state   | 该条数据对应的州名称。                       |
| fips    | 与该地点关联的 FIPS 代码。                   |
| cases   | Covid-19 确诊病例的累计数量。                |
| deaths  | 因 Covid-19 导致的累计死亡人数。             |

### 步骤 1：准备数据

数据集“Covid-19 Data from New York Times”为内置示例，只需几次点击即可加载。目标表会自动创建，无需提前手动建表。

<StepsWrap>
<StepContent number="1">

### 加载数据集

1. 在 Databend Cloud 的**概览**页面点击 **Load Data** 按钮。
2. 在打开的页面中，选择 **A new table** 单选按钮，然后在 **Load sample data** 下拉菜单中选择 **Covid-19 Data from New York Times.CSV**：

![Alt text](@site/static/public/img/cloud/dashboard-1.png)

3. 在下一页面选择数据库，并为即将创建的目标表命名。

![Alt text](@site/static/public/img/cloud/dashboard-2.png)

4. 点击 **Confirm**。Databend Cloud 开始创建目标表并加载数据集，此过程可能需要几秒钟。

</StepContent>

<StepContent number="2">


### 处理 NULL 值

分析前建议检查表中的 NULL 与重复值，以免影响结果。

1. 新建工作区，使用以下 SQL 检查是否存在 NULL 值：

```sql
SELECT COUNT(*)
FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

该语句返回 `41571`，表示有 41571 行存在至少一个 NULL 值。

2. 删除这些含 NULL 的行：

```sql
DELETE FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR fips IS NULL OR cases IS NULL OR deaths IS NULL;
```

</StepContent>

<StepContent number="2">


### 处理重复值

1. 在同一工作区使用以下 SQL 检查重复行：

```sql
SELECT date, country, state, fips, cases, deaths, COUNT(*)
FROM covid_19_us_2022_3812
GROUP BY date, country, state, fips, cases, deaths
HAVING COUNT(*) > 1;
```

该语句返回 `0`，表示无重复行，数据已可用于分析。

</StepContent>
</StepsWrap>

### 步骤 2：用查询结果创建图表

我们将运行四条查询以获取洞察，并通过记分卡、饼图、柱状图和折线图进行可视化。**请为每条查询单独创建工作区**。

<StepsWrap>
<StepContent number="1">

### 2022 年美国死亡总数

1. 在工作区运行以下 SQL：

```sql
-- 计算 2022 年 12 月 31 日美国累计死亡数
SELECT SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31';
```

2. 利用查询结果在工作区内创建记分卡：

![Alt text](@site/static/public/img/cloud/dashboard-3.gif)

</StepContent>

<StepContent number="2">


### 2022 年各州死亡总数

1. 在工作区运行以下 SQL：

```sql
-- 计算 2022 年 12 月 31 日各州累计死亡数
SELECT state, SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31'
GROUP BY state;
```

2. 利用查询结果在工作区内创建饼图：

![Alt text](@site/static/public/img/cloud/dashboard-4.gif)

</StepContent>

<StepContent number="3">

### 维尔京群岛病例与死亡

1. 在工作区运行以下 SQL：

```sql
-- 获取 2022 年 12 月 31 日维尔京群岛的全部数据
SELECT * FROM covid_19_us_2022_3812
WHERE date = '2022-12-31' AND state = 'Virgin Islands';
```

2. 利用查询结果在工作区内创建柱状图：

![Alt text](@site/static/public/img/cloud/dashboard-5.gif)

</StepContent>

<StepContent number="4">


### 圣约翰每月累计病例与死亡

1. 在工作区运行以下 SQL：

```sql
-- 获取圣约翰每月末的数据
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

2. 利用查询结果在工作区内创建折线图：

![Alt text](@site/static/public/img/cloud/dashboard-6.gif)

</StepContent>
</StepsWrap>

### 步骤 3：将图表添加到仪表盘

1. 在 Databend Cloud 通过 **Dashboards** > **New Dashboard** 创建仪表盘，然后点击 **Add Chart**。

2. 将左侧图表拖至仪表盘，可自由调整大小与位置。

![Alt text](@site/static/public/img/cloud/dashboard-7.gif)