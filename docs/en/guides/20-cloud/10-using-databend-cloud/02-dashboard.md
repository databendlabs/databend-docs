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

## Tutorials

- [Dashboarding COVID-19 Data](/tutorials/databend-cloud/dashboard)