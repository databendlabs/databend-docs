---
title: Deepnote
---

[Deepnote](https://deepnote.com) 使您可以与朋友和同事一起实时共建数据科学项目；并帮助您更快地将想法和分析转化为产品。

Deepnote 专为浏览器构建，因此您可以在任何平台（Windows、Mac、Linux 或 Chromebook）上使用它。无需下载，每日推送更新。所有更改都会即时保存。

本主题介绍如何连接到 Deepnote。

## 第一步：获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

## 第二步：在 Deepnote 中创建连接

1. 使用您的账号登入 Deepnote。

2. 选择左侧边栏中的“Integrations” ，然后点击页面中的“ClickHouse” 。

![](@site/static/img/documents/BI/11.png)

3. 使用在第一步中获取的连接信息填充页面中的字段。

![](@site/static/img/documents/BI/12.png)

4. 创建 notebook。

5. 在创建的 notebook 中新增类型为“DataFrame SQL”的内容块。

![](@site/static/img/documents/BI/13.png)

6. 选择“Databend Cloud”作为数据源。

![](@site/static/img/documents/BI/14.png)

现在您已经完成了全部设置。请参考 Deepnote 文档以获取关于如何使用该工具的更多信息。 

![](@site/static/img/documents/BI/15.png)
