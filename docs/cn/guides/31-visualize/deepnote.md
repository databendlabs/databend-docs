---
title: Deepnote
---

[Deepnote](https://deepnote.com) 允许你和你的朋友、同事在一个地方实时地轻松处理你的数据科学项目；帮助你更快地将你的想法和分析转化为产品。Deepnote 是为浏览器构建的，因此你可以在任何平台（Windows、Mac、Linux 或 Chromebook）上使用它。无需下载，每日为你推送更新。所有更改都会立即保存。

Databend 和 Databend Cloud 都支持与 Deepnote 集成，需要安全连接。与 Databend 集成时，请注意默认端口为 `8124`。

## 教程：与 Deepnote 集成

本教程将指导你完成将 Databend Cloud 与 Deepnote 集成的过程。

### 步骤 1. 设置环境

确保你可以登录到你的 Databend Cloud 帐户并获取计算集群的连接信息。有关更多详细信息，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 连接到 Databend Cloud

1. 登录到 Deepnote，或者创建一个帐户（如果你还没有）。

2. 点击左侧边栏中 **INTEGRATIONS** 右侧的 **+**，然后选择 **ClickHouse**。

![Alt text](/img/integration/11.png)

3. 使用你的连接信息填写字段。

| 参数             | 描述                             |
| ---------------- | -------------------------------- |
| Integration name | 例如，`Databend`                 |
| Host name        | 从连接信息中获取                   |
| Port             | `443`                            |
| Username         | `cloudapp`                       |
| Password         | 从连接信息中获取                   |

4. 创建一个 notebook。

5. 在 notebook 中，导航到 **SQL** 部分，然后选择你先前创建的连接。

![Alt text](/img/integration/13.png)

一切就绪！有关如何使用该工具，请参阅 Deepnote 文档。

![Alt text](/img/integration/15.png)