---
title: Grafana
---

[Grafana](https://grafana.com/) 是一个监控仪表系统，它是由 Grafana Labs 公司开源的的一个系统监测工具，它可以大大帮助我们简化监控的复杂度，我们只需要提供需要监控的数据，它就可以帮助生成各种可视化仪表，同时它还有报警功能，可以在系统出现问题时发出通知。

以下教程带您了解如何将 Databend Cloud 与 Grafana 集成，并将[分析匿名点击数据集](../01-getting-started/04-tutorials-datasets/01-tutorial1.md)教程所导入的数据在 Grafana 的仪表盘展示。

## 教程：与 Grafana 集成

### 准备工作

- 开始前，请参考[Grafana 官方安装指导](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)安装 Grafana。
- 请先完成[分析匿名点击数据集](../01-getting-started/04-tutorials-datasets/01-tutorial1.md)教程，确保数据集已经成功导入到 `Default` 数据库的 `hits_100m_obfuscated_v1` 表格中。

### 第一步：安装 Altinity plugin for ClickHouse

1. 在 Grafana 首页的侧边栏点击齿轮按钮，然后选择“Plugins”。
2. 在 Plugins 标签页，搜索并安装 `Altinity plugin for ClickHouse`。

### 第二步：创建数据源

1. 在 Grafana 首页的侧边栏点击齿轮按钮，然后选择“Data sources”。
2. 在 Data sources 标签页，选择”Add new data source“。
3. 搜索并选择数据源类型 `Altinity plugin for ClickHouse`。
4. 配置数据源。获取	Databend Cloud 计算集群的 URL 和 SQL 账号信息，请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#connecting)。

 配置项        | 描述
---------------|---------------------------------------------------------------------------------------------------------------------------
 URL           | Databend Cloud 的计算集群主机地址，例如：“<https://tnf34b0rm--small-book.ch.aliyun-cn-beijing.default.databend.com>”。请注意地址需要以"https://"开头。
 Access        | 选择“Server (default)”。                                                                                                    
 Auth          | 请选择“Basic auth”。                                                                                                          
 User/Password | 选择“Basic auth”后，请在 Basic Auth Details 中填入连接计算集群的 SQL 用户名和密码。                                                                  
 Additonal     | 选择“Add CORS flag to requests”。                                                                                            

5. 点击“Save & test”。页面提示“Data source is working”表示数据源创建成功。

### 第三步：创建仪表盘

1. 在 Grafana 首页的侧边栏点击“Dashboards”按钮，然后选择“New Dashboard” > “New Panel”。
2. 选择在[第二步](#第二步创建数据源)创建的数据源，并在“FROM”后依次选择 `default` 数据库和 `hits_100m_obfuscated_v1` 表格。

![Alt text](@site/static/img/documents_cn/BI/create-dashboard.png)

3. 点击“Go to Query”，然后复制粘贴以下查询语句：

```sql
SELECT
    eventtime as t,
    count()
FROM $table
GROUP BY t
ORDER BY t
```

4. 稍等片刻即可在页面上方看到视图，然后点击右上角”Save“按钮。

![Alt text](@site/static/img/documents_cn/BI/table-view.png)
