---
title: Deepnote
---

[Deepnote](https://deepnote.com) 允许您轻松地与朋友和同事一起实时地在同一平台上进行数据科学项目；帮助您更快地将想法和分析转化为产品。Deepnote 是为浏览器构建的，因此您可以在任何平台上使用它（Windows、Mac、Linux 或 Chromebook）。无需下载，每天都会向您推送更新。所有更改都会立即保存。

Databend 和 Databend Cloud 都支持与 Deepnote 集成，需要一个安全连接。在集成 Databend 时，请注意默认端口是 `8124`。

## 教程：与 Deepnote 集成

本教程将指导您完成将 Databend Cloud 与 Deepnote 集成的过程。

### 步骤 1. 设置环境

确保您可以登录到您的 Databend Cloud 账户并获取仓库的连接信息。更多详情，请参阅 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 连接到 Databend Cloud

1. 登录 Deepnote，如果您没有账户，请创建一个。

2. 点击左侧边栏中 **INTEGRATIONS** 右侧的 **+**，然后选择 **ClickHouse**。

![Alt text](/img/integration/11.png)

3. 使用您的连接信息填写字段。

| 参数             | 描述                         |
| ---------------- | ---------------------------- |
| 集成名称         | 例如，`Databend`             |
| 主机名           | 从连接信息中获取             |
| 端口             | `443`                        |
| 用户名           | `cloudapp`                   |
| 密码             | 从连接信息中获取             |

4. 创建一个笔记本。

5. 在笔记本中，导航到 **SQL** 部分，然后选择您之前创建的连接。

![Alt text](/img/integration/13.png)

您已经准备就绪！请参阅 Deepnote 文档以了解如何使用该工具。

![Alt text](/img/integration/15.png)