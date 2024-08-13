---
title: Dashboards
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Dashboards are employed to present query results through a variety of chart types, including **scorecards**, **pie charts**, **bar charts**, and **line charts**. These charts are generated from the query results. You have the option to create a chart based on the query result after executing a query in a worksheet. Refreshing a dashboard allows you to re-execute the queries corresponding to the charts, thereby updating the charts with the latest results.

![Alt text](@site/static/img/documents/dashboard/dashboard.png)

## Creating a Dashboard

In Databend Cloud, you can create multiple dashboards as needed. A dashboard can contain one or multiple charts. Each individual chart corresponds to a specific query result, yet it can be integrated into multiple dashboards.

**To create a dashboard**:

1. In a worksheet, run a query for which you intend to generate a chart using the query result.

2. In the result area, click on the **Chart** tab.

![Alt text](@site/static/img/documents/dashboard/chart-btn.png)

3. On the **Chart** tab, choose a chart type from the dropdown menu on the right. Next, specify the data and customize the chart's appearance using the options found on the **Data** and **Style** tabs below the dropdown list.

Please note that these aggregation functions assist in summarizing and revealing valuable patterns from the raw data in query results. The available functions for aggregation vary based on the distinct data types and the chart types you select.


| Function             | Description                                                    |
|----------------------|----------------------------------------------------------------|
| None                 | No alteration is applied to the data.                          |
| Count                | Calculates the number of records for the field in the query results (except the records containing NULL and '' values). |
| Min                  | Computes the minimum value within the query results.           |
| Max                  | Computes the maximum value within the query results.           |
| Median               | Calculates the median value within the query results.          |
| Sum                  | Calculates the sum of numerical values within the query results. |
| Average              | Computes the average value of numerical data within the query results. |
| Mode                 | Identifies the most frequently occurring value within the query results. |

4. Return to the Databend Cloud homepage and select **Dashboards** in the left navigation menu, then click **New Dashboard**.

5. In the new dashboard, click on **Add Chart**. Drag and drop the chart from the left pane onto the dashboard. If you have multiple charts available in the left pane, feel free to drag as many as you need.

:::note
After generating a chart from the query results in a worksheet, please avoid running other queries in the same worksheet, as doing so might result in the chart becoming unavailable on the dashboard.
:::

## Tutorial: Dashboarding Covid-19 Data from New York Times

In this tutorial, we'll load, analyze, and create a dashboard for a dataset named "Covid-19 Data from New York Times". The dataset comprises daily updated information on Covid-19 cases, deaths, and other pertinent statistics for the entire United States. It offers a comprehensive view of the pandemic's impact at the national, state, and county levels, providing detailed insights into the Covid-19 situation across various regions throughout the year 2022.

| Field    | Description                                       |
|----------|---------------------------------------------------|
| date     | The date of the reported cumulative Covid-19 data.|
| county   | The name of the county for the data entry.        |
| state    | The name of the state for the data entry.         |
| fips     | The FIPS code associated with the location.      |
| cases    | The cumulative number of confirmed Covid-19 cases.|
| deaths   | The cumulative number of deaths due to Covid-19.  |

### Step 1: Preparing Data

The dataset "Covid-19 Data from New York Times" is a built-in sample dataset that you can load with just a few clicks. The target table is created automatically, so you don't need to create it in advance.

<StepsWrap>
<StepContent number="1">

### Loading Dataset

1. In Databend Cloud, click the **Load Data** button on the **Overview** page.
2. On the page that opens, choose the **A new table** radio button, and then select **Covid-19 Data from New York Times.CSV** from the **Load sample data** dropdown menu:

![Alt text](@site/static/public/img/cloud/dashboard-1.png)

3. On the next page, select a database and set a name for the target table to be created.

![Alt text](@site/static/public/img/cloud/dashboard-2.png)

4. Click **Confirm**. Databend Cloud begins creating the target table and loading the dataset. This process may take a few seconds.

</StepContent>

<StepContent number="2">


### Handling NULLs

Before the analytics work, it is recommended to check for NULL and duplicate values in the table, as they may impact the results.

1. Create a worksheet and check the existence of NULLs in the table with the following SQL statement:

```sql
SELECT COUNT(*)
FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR flip IS NULL OR cases IS NULL OR deaths IS NULL;
```

This SQL statement returns `41571`, indicating the number of rows that contain at least one NULL value.

2. Remove the rows that contain at least one NULL value from the table:

```sql
DELETE FROM covid_19_us_2022_3812
WHERE date IS NULL OR country IS NULL OR state IS NULL OR flip IS NULL OR cases IS NULL OR deaths IS NULL;
```

</StepContent>

<StepContent number="2">


### Handling Duplicates

1. In the same worksheet, check for duplicate values in the table with the following SQL statement:

```sql
SELECT date, country, state, flip, cases, deaths, COUNT(*)
FROM covid_19_us_2022_3812
GROUP BY date, country, state, flip, cases, deaths
HAVING COUNT(*) > 1;
```

This SQL statement returns `0`, indicating there are no duplicate rows in the table, and the data is now ready for analytics.

</StepContent>
</StepsWrap>

### Step 2: Creating Charts with Query Results

In this step, we'll run four queries to extract insights from the data and visualize the results through a scorecard, pie chart, bar chart, and line chart. **Please create a separate worksheet for each query**.

<StepsWrap>
<StepContent number="1">

### US Total Deaths in 2022

1. Run the following SQL statement in a worksheet:

```sql
-- Calculate the total number of deaths in the US on December 31, 2022
SELECT SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31';
```

2. Create a scorecard within the worksheet using the query result:

![Alt text](@site/static/public/img/cloud/dashboard-3.gif)

</StepContent>

<StepContent number="2">


### Total Deaths by State in 2022

1. Run the following SQL statement in a worksheet:

```sql
-- Calculate the total number of deaths by state on December 31, 2022
SELECT state, SUM(deaths)
FROM covid_19_us_2022_3812
WHERE date = '2022-12-31'
GROUP BY state;
```

2. Create a pie chart within the worksheet using the query result:

![Alt text](@site/static/public/img/cloud/dashboard-4.gif)

</StepContent>

<StepContent number="3">

### Cases & Deaths in Virgin Islands

1. Run the following SQL statement in a worksheet:

```sql
-- Retrieve all data for the state of Virgin Islands on December 31, 2022
SELECT * FROM covid_19_us_2022_3812
WHERE date = '2022-12-31' AND state = 'Virgin Islands';
```

2. Create a bar chart within the worksheet using the query result:

![Alt text](@site/static/public/img/cloud/dashboard-5.gif)

</StepContent>

<StepContent number="4">


### Cumulative Cases & Deaths per Month in St. John

1. Run the following SQL statement in a worksheet:

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

2. Create a line chart within the worksheet using the query result:

![Alt text](@site/static/public/img/cloud/dashboard-6.gif)

</StepContent>
</StepsWrap>

### Step 3: Adding Charts to Dashboard

1. In Databend Cloud, create a dashboard on **Dashboards** > **New Dashboard**, then click **Add Chart** on the dashboard.

2. Drag and drop the charts from the left onto the dashboard. You can resize or reposition a chart as needed.

![Alt text](@site/static/public/img/cloud/dashboard-7.gif)
