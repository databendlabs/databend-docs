---
title: Deepnote
---

[Deepnote](https://deepnote.com) 允许您与朋友和同事一起轻松地在实时和同一地点处理数据科学项目；帮助您更快地将想法和分析转化为产品。Deepnote 为浏览器构建，因此您可以在任何平台（Windows、Mac、Linux 或 Chromebook）上使用它。无需下载，每天向您推送更新。所有更改都会即时保存。

Databend 和 Databend Cloud 都支持与 Deepnote 集成，需要安全连接。集成 Databend 时，请注意默认端口是 `8124`。

## 教程：与 Deepnote 集成

本教程指导您完成将 Databend Cloud 与 Deepnote 集成的过程。

### 步骤 1. 设置环境

确保您能够登录到您的 Databend Cloud 账户并获取计算集群的连接信息。更多详情，请参见[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 连接到 Databend Cloud

1. 登录到 Deepnote，如果您还没有账户，则创建一个。

2. 点击左侧边栏中 **INTEGRATIONS** 右侧的 **+**，然后选择 **ClickHouse**。

![Alt text](@site/docs/public/img/integration/11.png)

3. 使用您的连接信息完成字段填写。

| 参数              | 描述                             |
|------------------|----------------------------------|
| Integration name | 例如，`Databend`                 |
| Host name        | 从连接信息中获取                 |
| Port             | `443`                            |
| Username         | `cloudapp`                       |
| Password         | 从连接信息中获取                 |

4. 创建一个笔记本。

5. 在笔记本中，导航到 **SQL** 部分，然后选择您之前创建的连接。

![Alt text](@site/docs/public/img/integration/13.png)

您已经准备好了！有关如何使用该工具，请参考 Deepnote 文档。

![Alt text](@site/docs/public/img/integration/15.png)