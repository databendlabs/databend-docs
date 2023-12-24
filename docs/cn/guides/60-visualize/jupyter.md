---
title: Jupyter Notebook
---

[Jupyter Notebook](https://jupyter.org) 是一个基于网络的交互式应用程序，允许您创建包含实时代码、交互式图表、小部件、方程式、图像等的笔记本文档，并且可以轻松地分享这些文档。它也非常灵活，因为它可以通过内核支持许多编程语言，如 Julia、Python、Ruby、Scala、Haskell 和 R。

通过 Python 中的 SQLAlchemy 库或 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，您可以在 Jupyter Notebook 中建立与 Databend 和 Databend Cloud 的连接，允许您直接在笔记本中执行查询和可视化您的 Databend 数据。

或者，您可以使用 [Databend Python 绑定](https://pypi.org/project/databend/) 库在 Python 中运行 SQL 查询，允许您直接在本地 Python 环境或在线服务（如 Jupyter Notebook 和 Google Colab）中利用 DataBend 的功能，无需部署单独的 DataBend 实例。

## 教程-1：使用 SQLAlchemy 将 Databend 集成到 Jupyter Notebook 中 {#tutorial-1-integrating-databend-with-jupyter-notebook-using-sqlalchemy}

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后运行一个示例笔记本，通过 SQLAlchemy 库连接到您的本地 Databend，并在笔记本中编写和可视化数据。

在开始之前，请确保您已完成以下任务：

- 您的系统上已安装 [Python](https://www.python.org/)。
- 将示例笔记本 [databend.ipynb](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/integration/databend.ipynb) 下载到本地文件夹。

### 步骤 1. 部署 Databend

1. 按照 [部署指南](/guides/deploy) 部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Jupyter Notebook 中连接到 Databend。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install sqlalchemy
pip install pandas
pip install pymysql
```

### 步骤 3. 运行示例笔记本

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

  这将启动 Jupyter，您的默认浏览器应该会启动（或在新标签页中打开）以下 URL：http://localhost:8888/tree

![Alt text](@site/docs/public/img/integration/notebook-tree.png)

2. 在 **Files** 标签页中，导航到您下载的示例笔记本并打开它。

3. 在示例笔记本中，依次运行单元格。通过这样做，您在本地 Databend 中创建了一个包含 5 行的表，并使用条形图可视化数据。

![Alt text](@site/docs/public/img/integration/integration-gui-jupyter.png)

## 教程-2：使用 ipython-sql 将 Databend 集成到 Jupyter Notebook 中 {#tutorial-2-integrating-databend-with-jupyter-notebook-using-ipython-sql}

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后运行一个示例笔记本，通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 连接到您的本地 Databend，并在笔记本中编写和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### 步骤 1. 部署 Databend

1. 按照 [部署指南](/guides/deploy) 部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Jupyter Notebook 中连接到 Databend。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

:::note
要继续本教程，您需要一个低于 2.0 版本的 SQLAlchemy。请注意，在 SQLAlchemy 2.0 及更高版本中，result.DataFrame() 方法已被弃用，不再可用。相反，您可以使用 pandas 库直接从查询结果创建 DataFrame 并进行绘图。
:::

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### 步骤 3. 创建并连接到 Databend 的笔记本

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

  这将启动 Jupyter，您的默认浏览器应该会启动（或在新标签页中打开）以下 URL：http://localhost:8888/tree

![Alt text](@site/docs/public/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建一个笔记本。

3. 在单独的单元格中依次运行以下代码。通过这样做，您在本地 Databend 中创建了一个包含 5 行的表，并使用条形图可视化数据。

```python title='In [1]:'
%load_ext sql
```

```sql title='In [2]:'
%%sql databend://user1:abc123@localhost:8000/default
create table if not exists user(created_at Date, count Int32);
insert into user values('2022-04-01', 5);
insert into user values('2022-04-01', 3);
insert into user values('2022-04-03', 4);
insert into user values('2022-04-03', 1);
insert into user values('2022-04-04', 10);
```

```python title='In [3]:'
result = %sql select created_at as date, count(*) as count from user group by created_at;
result
```

```python title='In [4]:'
%matplotlib inline

df = result.DataFrame()
df.plot.bar(x='date', y='count')
```

现在您可以在笔记本上看到一个条形图：

![Alt text](@site/docs/public/img/integration/jupyter-ipython-sql.png)

## 教程-3：使用 Python 绑定库将 Databend 集成到 Jupyter Notebook 中 {#tutorial-3-integrating-databend-with-jupyter-notebook-with-python-binding-library}

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后通过 [Databend Python 绑定](https://pypi.org/project/databend/) 库在笔记本中运行查询，并在笔记本中编写和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### 步骤 1. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install databend
pip install matplotlib
```
### 步骤 2. 创建一个笔记本

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

  这将启动 Jupyter，您的默认浏览器应该会启动（或在新标签页中打开）以下 URL：http://localhost:8888/tree

![Alt text](@site/docs/public/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建一个笔记本。

3. 在单独的单元格中依次运行以下代码：

```python title='In [1]:'
# 导入必要的库
from databend import SessionContext

# 创建一个 DataBend 会话
ctx = SessionContext()
```

```python title='In [2]:'
# 在 DataBend 中创建一个表
ctx.sql("CREATE TABLE IF NOT EXISTS user (created_at Date, count Int32)")
```

```python title='In [3]:'
# 向表中插入多行数据
ctx.sql("INSERT INTO user VALUES ('2022-04-01', 5), ('2022-04-01', 3), ('2022-04-03', 4), ('2022-04-03', 1), ('2022-04-04', 10)")
```

```python title='In [4]:'
# 执行查询
result = ctx.sql("SELECT created_at as date, count(*) as count FROM user GROUP BY created_at")

# 显示查询结果
result.show()
```

```python title='In [5]:'
# 导入数据可视化库
import matplotlib.pyplot as plt

# 将查询结果转换为 Pandas DataFrame
df = result.to_pandas()
```

```python title='In [6]:'
# 创建条形图以可视化数据
df.plot.bar(x='date', y='count')
plt.show()
```

现在你可以在笔记本上看到一个条形图：

![Alt text](@site/docs/public/img/integration/localhost_8888_notebooks_Untitled.ipynb.png)

## 教程-4：使用 ipython-sql 将 Databend Cloud 与 Jupyter Notebook 集成

在本教程中，你将首先从 Databend Cloud 获取连接信息并部署 Jupyter Notebook，然后创建并通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 将笔记本连接到 Databend Cloud，以及在笔记本中编写和可视化数据。

在开始之前，请确保你的系统上已安装了 [Python](https://www.python.org/)。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。有关如何操作，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### 步骤 3. 创建并连接 Databend Cloud 的笔记本

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

  这将启动 Jupyter，你的默认浏览器应该会启动（或在新标签页中打开）以下 URL：http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. 选择 **New** > **Python 3** 来创建一个笔记本。

3. 按顺序在不同的单元格中运行以下代码。通过这样做，你在 Databend Cloud 中创建了一个包含 5 行的表，并使用条形图可视化数据。

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
现在你可以在笔记本上看到一个条形图：

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)