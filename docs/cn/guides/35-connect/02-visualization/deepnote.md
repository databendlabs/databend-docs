---
title: Deepnote
sidebar_position: 5
---

[Deepnote](https://deepnote.com) 让您能够轻松开展数据科学项目，与团队成员实时协作，将想法和分析快速转化为产品。Deepnote 基于浏览器构建，可在任何平台 (Windows、Mac、Linux 或 Chromebook) 上使用，无需下载安装，每日自动更新，所有更改即时保存。

Databend 和 Databend Cloud 均支持与 Deepnote 集成，需建立安全连接。集成 Databend 时请注意默认端口为 `8124`。

## 教程：与 Deepnote 集成

本教程将指导您完成 Databend Cloud 与 Deepnote 的集成过程。

### 步骤 1. 环境准备

确保您已登录 Databend Cloud 账户并获取计算集群的连接信息。详见[连接计算集群](/guides/cloud/resources/warehouses#connecting)。

### 步骤 2. 连接 Databend Cloud

1. 登录 Deepnote 账户，若无账号请先注册。

2. 在左侧边栏找到 **INTEGRATIONS**，点击右侧的 **+** 按钮，选择 **ClickHouse**。

![Alt text](/img/integration/11.png)

3. 填写连接信息：

| 参数            | 说明                              |
| --------------- | --------------------------------- |
| Integration name | 例如输入 `Databend`              |
| Host name       | 从连接信息中获取                  |
| Port            | `443`                            |
| Username        | `cloudapp`                       |
| Password        | 从连接信息中获取                  |

4. 创建新笔记本。

5. 在笔记本中进入 **SQL** 功能区，选择之前创建的连接。

![Alt text](/img/integration/13.png)

配置完成！具体操作方式请参考 Deepnote 官方文档。

![Alt text](/img/integration/15.png)