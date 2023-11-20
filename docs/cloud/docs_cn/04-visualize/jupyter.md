---
title: Jupyter Notebook
---

[Jupyter Notebook](https://jupyter.org) 是一个基于 Web 的交互式应用程序，可让您创建包含实时代码、交互式绘图、小部件、方程、图像等的笔记本文档，并轻松共享这些文档。它也非常通用，因为它可以通过内核支持许多编程语言，例如 Julia、Python、Ruby、Scala、Haskell 和 R。

使用 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，您可以在 Jupyter Notebook 中建立与 Databend Cloud 的连接，从而允许您直接在 Jupyter Notebook 中 执行查询并可视化数据 Databend Cloud 中的数据。

## 教程：使用 ipython-sql 与 Jupyter Notebook 集成

在本教程中，您将首先从 Databend Cloud 获取连接信息并部署 Jupyter Notebook，然后通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 创建一个 Notebook 并将其连接到 Databend Cloud，以及在 Notebook 中写入和可视化数据。

在开始之前，请确保您的系统上安装了 [Python](https://www.python.org/)。

### 第一步：获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#连接到计算集群-connecting)。

### 第二步：Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### 第三步：创建笔记本并将其连接到 Databend Cloud

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

  这将启动 Jupyter，并且您的默认浏览器应启动（或打开新选项卡）到以下 URL：http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建笔记本。

3. 在单独的单元格中按顺序运行以下代码。通过这样做，您可以在 Databend Cloud 中创建一个包含 5 行数据的表，并使用条形图可视化数据。

```python
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Connection, Engine
import databend_sqlalchemy
import matplotlib.pyplot as plt
import pandas as pd
```

```python
engine = create_engine(f"databend://cloudapp:<your-password>@<your-host>:443/default?secure=true") 
connection = engine.connect() 
```

```python
connection.execute('create table if not exists user(created_at Date, count Int32);')
connection.execute("insert into user values('2022-04-01', 5);")
connection.execute("insert into user values('2022-04-01', 3);")
connection.execute("insert into user values('2022-04-03', 4);")
connection.execute("insert into user values('2022-04-03', 1);")
connection.execute("insert into user values('2022-04-04', 10);")
result=connection.execute('select created_at as date, count(*) as count from user group by created_at;')
```

```python
rows = result.fetchall()
df = pd.DataFrame(rows, columns=result.keys())
df.plot.bar(x='date', y='count')
plt.show()
```
您现在可以在笔记本上看到如下条形图：

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)