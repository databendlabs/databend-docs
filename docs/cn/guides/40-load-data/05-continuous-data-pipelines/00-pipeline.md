---
title: 通过管道加载数据
sidebar_label: 管道
---

在 Databend Cloud 中，管道允许自动发现对象存储中的文件更新，并自动将它们加载到表中。以下是推荐使用管道的场景：

- 您的存储桶中有大量 CSV 或 Parquet 文件，并希望一次性加载到 Databend Cloud 中进行进一步分析。

- 对象存储自动将数据加载到您的存储桶中，例如账单数据，可以自动加载到 Databend Cloud 中进行可视化和进一步分析。

- 您有一个持续的用户行为日志流存储到对象存储中，可以使用管道自动加载到 Databend Cloud 中进行进一步分析。

:::note
您可以为您的组织创建任意数量的管道。但请记住，管道需要一个仓库来运行，因此运行管道会产生成本。有关仓库定价的更多信息，请参阅[仓库定价](/guides/cloud/manage/pricing#warehouse-pricing)。
:::

## 创建管道

要在 Databend Cloud 中创建管道，您必须首先创建一个表，该表将作为要导入数据的目标。表模式必须与要导入的数据结构匹配，以便管道正常工作。

**创建管道**:

1. 在 **数据** 页面，导航并选择您的目标表，然后选择右侧的 **管道** 标签。

![Alt text](@site/static/img/documents/loading-data/pipeline-1.png)

2. 点击 **配置** 以打开管道设置页面，然后按照说明创建管道。

![Alt text](@site/static/img/documents/loading-data/pipeline-2.png)

3. 点击 **确定**。只有当所有连接信息准确无误时，数据加载过程才会开始。加载完成后，您将能够在页面上查看导入日志，如下所示：

![Alt text](@site/static/img/documents/loading-data/pipeline-3.png)

## 激活或停用管道

成功创建后，管道默认处于激活状态。管道将定期检测对象存储上的文件更改，并自动将它们加载到 Databend Cloud 中的表中，直到您停用它。

要停用管道，请转到 **管道** 标签并切换 **激活** 按钮。

![Alt text](@site/static/img/documents/loading-data/pipeline-4.png)