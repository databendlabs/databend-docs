---
title: Python
---

本主题介绍如何使用 [Databend SQLAlchemy](https://pypi.org/project/databend-sqlalchemy/) 建立从 Python 应用程序到 Databend Cloud 的连接。

## 准备工作

在开始之前，请确保您已经成功创建计算集群并获得连接信息。欲了解如何做到这一点，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。

## 第一步：使用 pip 安装依赖

```shell
pip install databend-sqlalchemy
```

## 第二步：用 Databend SQLAlchemy 建立连接

```python
from databend_sqlalchemy import connector

cursor = connector.connect(f"{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}?secure=true").cursor()
cursor.execute('DROP TABLE IF EXISTS data')
cursor.execute('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )')
cursor.execute("INSERT INTO data (Col1,Col2) VALUES ", [1, 'yy', 2, 'xx'])
cursor.execute("SELECT * FROM data")
print(cursor.fetchall())
```
:::tip
请使用您的连接信息替换代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 。了解如何获取连接信息，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。
:::