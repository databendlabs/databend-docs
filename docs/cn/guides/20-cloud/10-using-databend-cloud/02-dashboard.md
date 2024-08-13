---
title: 仪表盘
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

仪表盘用于通过各种图表类型展示查询结果，包括**计分卡**、**饼图**、**条形图**和**折线图**。这些图表是根据查询结果生成的。您可以选择在查询结果后基于查询结果创建图表。刷新仪表盘可以重新执行与图表对应的查询，从而用最新的结果更新图表。

![Alt text](@site/static/img/documents/dashboard/dashboard.png)

## 创建仪表盘

在 Databend Cloud 中，您可以根据需要创建多个仪表盘。一个仪表盘可以包含一个或多个图表。每个单独的图表对应于特定的查询结果，但它可以集成到多个仪表盘。

**创建仪表盘的步骤**：

1. 在查询表中，运行您打算使用查询结果生成图表的查询。

2. 在结果区域，点击 **图表** 标签。

![Alt text](@site/static/img/documents/dashboard/chart-btn.png)

3. 在 **图表** 标签中，从右侧的下拉菜单中选择一种图表类型。接下来，使用下拉列表下方的 **数据** 和 **样式** 标签中的选项指定数据并自定义图表的外观。

请注意，这些聚合函数有助于从查询结果的原始数据中总结和揭示有价值的模式。可用的聚合函数根据您选择的不同数据类型和图表类型而有所不同。

| 函数       | 描述                                                         |
|------------|--------------------------------------------------------------|
| None       | 不对数据进行任何更改。                                       |
| Count      | 计算查询结果中该字段的记录数（不包括包含 NULL 和 '' 值的记录）。 |
| Min        | 计算查询结果中的最小值。                                     |
| Max        | 计算查询结果中的最大值。                                     |
| Median     | 计算查询结果中的中位数值。                                   |
| Sum        | 计算查询结果中数值的总和。                                   |
| Average    | 计算查询结果中数值数据的平均值。                             |
| Mode       | 识别查询结果中最频繁出现的值。                               |

4. 返回到 Databend Cloud 主页，在左侧导航菜单中选择 **仪表盘**，然后点击 **新建仪表盘**。

5. 在新建的仪表盘页面中，点击 **添加图表**。从左侧窗格中拖放图表到仪表盘上。如果您在左侧窗格中有多个图表可用，请随意拖放您需要的图表。

:::note
在查询表中根据查询结果生成图表后，请避免在同一查询表中运行其他查询，因为这可能会导致图表在仪表盘上不可用。
:::

## 教程：从纽约时报加载 Covid-19 数据并创建仪表盘

在本教程中，我们将加载、分析并创建一个名为 "Covid-19 Data from New York Times" 的数据集的仪表盘。该数据集包含美国每日更新的 Covid-19 病例、死亡人数和其他相关统计数据。它提供了全国、州和县级别的疫情影响的全面视图，提供了 2022 年各地区 Covid-19 情况的详细洞察。

| 字段   | 描述                                       |
|--------|--------------------------------------------|
| date   | 报告的累积 Covid-19 数据的日期。           |
| county | 数据条目的县名称。                         |
| state  | 数据条目的州名称。                         |
| fips   | 与位置关联的 FIPS 代码。                   |
| cases  | 累积的确认 Covid-19 病例数。               |
| deaths | 累积的 Covid-19 死亡人数。                 |

### 步骤 1：准备数据

"Covid-19 Data from New York Times" 数据集是一个内置的示例数据集，您只需点击几下即可加载。目标表会自动创建，因此您无需提前创建它。

<StepsWrap>
<StepContent number="1">

### 加载数据集

1. 在 Databend Cloud 中，点击 **概览** 页面上的 **加载数据** 按钮。
2. 在打开的页面上，选择 **新建表** 单选按钮，然后从 **加载示例数据** 下拉菜单中选择 **Covid-19 Data from New York Times.CSV**：

![Alt text](@site/static/public/img/cloud/dashboard-1.png)

3. 在下一页上，选择一个数据库并为要创建的目标表设置一个名称。

![Alt text](@site/static/public/img/cloud/dashboard-2.png)

4. 点击 **确认**。Databend Cloud 开始创建目标表并加载数据集。此过程可能需要几秒钟。

</StepContent>

<StepContent number="2">

### 处理 NULL 值

在进行分析工作之前，建议检查表中的 NULL 和重复值，因为它们可能会影响结果。

1. 创建一个查询表，并使用以下 SQL 语句检查表中是否存在 NULL 值：

```sql
SELECT COUNT(*)
FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR flip IS NULL OR cases IS NULL OR deaths IS NULL;
```

此 SQL 语句返回 `41571`，表示包含至少一个 NULL 值的行数。

2. 从表中删除包含至少一个 NULL 值的行：

```sql
DELETE FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR flip IS NULL OR cases IS NULL OR deaths IS NULL;
```

</StepContent>

<StepContent number="2">

### 处理重复值

1. 在同一个查询表中，使用以下 SQL 语句检查表中的重复值：

```sql
SELECT date, country, state, flip, cases, deaths, COUNT(*)
FROM covid_19_us_2022_3812
GROUP BY date, country, state, flip, cases, deaths
HAVING COUNT(*) > 1;
```

此 SQL 语句返回 `0`，表示表中没有重复行，数据现在已准备好进行分析。

</StepContent>
</StepsWrap>

### 步骤 2：使用查询结果创建图表

在这一步中，我们将运行四个查询，从数据中提取洞察，并通过计分卡、饼图、条形图和折线图可视化结果。**请为每个查询创建一个单独的查询表**。

<StepsWrap>
<StepContent number="1">

### 2022 年美国总死亡人数

1. 在查询表中运行以下 SQL 语句：

```sql
-- 计算 2022 年 12 月 31 日美国的总死亡人数
SELECT SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31';
```

2. 在查询表中使用查询结果创建一个计分卡：

![Alt text](@site/static/public/img/cloud/dashboard-3.gif)

</StepContent>

<StepContent number="2">

### 2022 年各州总死亡人数

1. 在查询表中运行以下 SQL 语句：

```sql
-- 计算 2022 年 12 月 31 日各州的总死亡人数
SELECT state, SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31'
GROUP BY state;
```

2. 在查询表中使用查询结果创建一个饼图：

![Alt text](@site/static/public/img/cloud/dashboard-4.gif)

</StepContent>

<StepContent number="3">

### 维尔京群岛的病例和死亡人数

1. 在查询表中运行以下 SQL 语句：

```sql
-- 检索 2022 年 12 月 31 日维尔京群岛的所有数据
SELECT * FROM covid_19_us_2022_3812
WHERE date = '2022-12-31' AND state = 'Virgin Islands';
```

2. 在查询表中使用查询结果创建一个条形图：

![Alt text](@site/static/public/img/cloud/dashboard-5.gif)

</StepContent>

<StepContent number="4">

### 圣约翰每月累积病例和死亡人数

1. 在查询表中运行以下 SQL 语句：

```sql
-- 检索圣约翰每月末的数据
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

2. 在查询表中使用查询结果创建一个折线图：

![Alt text](@site/static/public/img/cloud/dashboard-6.gif)

</StepContent>
</StepsWrap>

### 步骤 3：将图表添加到仪表盘

1. 在 Databend Cloud 中，在 **仪表盘** > **新建仪表盘** 上创建一个仪表盘，然后在仪表盘上点击 **添加图表**。

2. 从左侧拖放图表到仪表盘上。您可以根据需要调整图表的大小或位置。

![Alt text](@site/static/public/img/cloud/dashboard-7.gif)