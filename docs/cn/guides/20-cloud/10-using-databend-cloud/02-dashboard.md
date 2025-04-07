---
title: 仪表盘
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg';

仪表盘用于通过各种图表类型展示查询结果，包括 **记分卡**、**饼图**、**柱状图** 和 **折线图**。这些图表由查询结果生成。在工作表中执行查询后，您可以选择基于查询结果创建图表。刷新仪表盘允许您重新执行与图表对应的查询，从而使用最新的结果更新图表。

![Alt text](@site/static/img/documents/dashboard/dashboard.png)

## 创建仪表盘

在 Databend Cloud 中，您可以根据需要创建多个仪表盘。一个仪表盘可以包含一个或多个图表。每个单独的图表对应于一个特定的查询结果，但它可以集成到多个仪表盘中。

**创建仪表盘**:

1. 在工作表中，运行一个您打算使用查询结果生成图表的查询。

2. 在结果区域，点击 **Chart** 标签。

![Alt text](@site/static/img/documents/dashboard/chart-btn.png)

3. 在 **Chart** 标签上，从右侧的下拉菜单中选择一个图表类型。接下来，使用下拉列表下方的 **Data** 和 **Style** 标签上的选项，指定数据并自定义图表的外观。

请注意，这些聚合函数有助于总结和揭示查询结果中原始数据的有价值的模式。可用的聚合函数因不同的数据类型和您选择的图表类型而异。

| Function             | Description                                                    |
|----------------------|----------------------------------------------------------------|
| None                 | 不对数据应用任何更改。                                         |
| Count                | 计算查询结果中该字段的记录数（不包括包含 NULL 和 '' 值的记录）。 |
| Min                  | 计算查询结果中的最小值。                                       |
| Max                  | 计算查询结果中的最大值。                                       |
| Median               | 计算查询结果中的中位数。                                       |
| Sum                  | 计算查询结果中数值的总和。                                     |
| Average              | 计算查询结果中数值数据的平均值。                               |
| Mode                 | 识别查询结果中最常出现的值。                                   |

4. 返回到 Databend Cloud 主页，在左侧导航菜单中选择 **Dashboards**，然后点击 **New Dashboard**。

5. 在新的仪表盘中，点击 **Add Chart**。将左侧窗格中的图表拖放到仪表盘上。如果左侧窗格中有多个可用的图表，您可以随意拖动任意数量的图表。

:::note
在工作表中从查询结果生成图表后，请避免在同一工作表中运行其他查询，因为这样做可能会导致图表在仪表盘上不可用。
:::

## 共享仪表盘

您可以与组织中的所有人或特定个人共享您的仪表盘。为此，点击要共享的仪表盘上的省略号按钮 <EllipsisSVG/>，然后选择 **Share**。

![alt text](@site/static/img/documents/dashboard/dashboard-share.png)

共享仪表盘时，您可以选择以下权限级别之一来控制其他人访问它的方式：

- **Read Only**: 查看仪表盘，但不能进行更改或运行查询来检索最新的结果。
- **Execute**: 运行查询以检索最新的结果或与仪表盘交互，而无需修改它。
- **Edit**: 修改仪表盘，包括更改查询以及仪表盘反映结果的方式。

要查看其他人与您共享的仪表盘，请点击侧边栏中的 **Dashboards**，然后点击右侧的 **Shared with Me** 标签。

## 教程

- [Dashboarding COVID-19 Data](/tutorials/databend-cloud/dashboard)
