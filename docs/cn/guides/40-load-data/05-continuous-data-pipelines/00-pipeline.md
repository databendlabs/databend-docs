---
title: 通过管道加载数据
---

Databend Cloud 中的管道允许自动发现 Amazon S3 中的文件更新，并自动将它们加载到表中。以下是一些推荐使用管道的场景：

- 您在 S3 存储桶中有大量的 CSV 或 Parquet 文件，并希望一次性将它们加载到 Databend Cloud 中进行进一步分析。

- AWS 自动将数据加载到您的 S3 存储桶中，例如计费数据，可以自动加载到 Databend Cloud 中进行可视化和进一步分析。

- 您有一个持续的用户行为日志流被存储在 S3 中，可以使用管道自动加载到 Databend Cloud 中进行进一步分析。

:::tip 管道现在免费
在公共测试期间，Databend Cloud 上的管道免费提供。每个组织限制 4 条管道。如需额外请求，请通过提交工单与我们联系。
:::

## 创建管道

要在 Databend Cloud 中创建管道，您首先必须创建一个表，该表将作为要导入的数据的目标。表架构必须与要导入的数据的结构匹配，管道才能正常工作。

**创建管道**：

1. 在 **Data** 页面上，导航至并选择您的目标表，然后在右侧选择 **Pipeline** 标签。

![Alt text](@site/static/img/documents/loading-data/pipeline-1.png)

2. 点击 **Configuration** 来创建管道，然后提供所需信息以启用对 Amazon S3 存储桶中文件的访问。

    如果您导入 CSV 文件，可以通过点击 **Settings** 来指定有关文件格式的详细信息。

![Alt text](@site/static/img/documents/loading-data/pipeline-2.png)

3. 点击 **OK**。只有当所有连接信息都准确无误时，数据加载过程才会开始。加载完成后，您将能够在页面上查看像这样的导入日志：

![Alt text](@site/static/img/documents/loading-data/pipeline-3.png)

## 激活或停用管道

成功创建后，默认会激活管道。管道将定期检测您在 Amazon S3 上的文件更改，并自动将它们加载到 Databend Cloud 中的表中，直到您停用它。

要停用管道，请转到 **Pipeline** 标签并切换 **Active** 按钮。

![Alt text](@site/static/img/documents/loading-data/pipeline-4.png)
