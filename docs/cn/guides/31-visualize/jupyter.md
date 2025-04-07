```md
---
title: Jupyter Notebook
---

[Jupyter Notebook](https://jupyter.org) 是一个基于 Web 的交互式应用程序，使您能够创建包含实时代码、交互式绘图、小部件、公式、图像等的 notebook 文档，并轻松共享这些文档。它也用途广泛，因为它可以通过 Julia、Python、Ruby、Scala、Haskell 和 R 等内核支持多种编程语言。

借助 Python 中的 SQLAlchemy 库或 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，您可以在 Jupyter Notebook 中建立与 Databend 和 Databend Cloud 的连接，从而可以直接在 notebook 中执行查询并可视化来自 Databend 的数据。

或者，您可以使用 [Databend Python Binding](https://pypi.org/project/databend/) 库在 Python 中运行 SQL 查询，从而可以直接在本地 Python 环境或 Jupyter Notebook 和 Google Colab 等在线服务中利用 DataBend 的功能，而无需部署单独的 DataBend 实例。

## Tutorial-1: 使用 SQLAlchemy 将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后运行示例 notebook 以通过 SQLAlchemy 库连接到本地 Databend，以及在 notebook 中写入和可视化数据。

在开始之前，请确保已完成以下任务：

- 您的系统上已安装 [Python](https://www.python.org/)。
- 将示例 notebook [databend.ipynb](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/integration/databend.ipynb) 下载到本地文件夹。

### Step 1. 部署 Databend

1. 按照[部署指南](/guides/deploy)部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Jupyter Notebook 中连接到 Databend。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### Step 2. 部署 Jupyter Notebook

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

### Step 3. 运行示例 Notebook

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新选项卡）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 在 **Files** 选项卡上，导航到您下载的示例 notebook 并将其打开。

3. 在示例 notebook 中，按顺序运行单元格。通过这样做，您将在本地 Databend 中创建一个包含 5 行的表，并使用条形图可视化数据。

![Alt text](/img/integration/integration-gui-jupyter.png)

## Tutorial-2: 使用 ipython-sql 将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后运行示例 notebook 以通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 连接到本地 Databend，以及在 notebook 中写入和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### Step 1. 部署 Databend

1. 按照[部署指南]/guides/deploy)部署本地 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此帐户在 Jupyter Notebook 中连接到 Databend。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### Step 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

:::note
要继续学习本教程，您需要一个低于 2.0 的 SQLAlchemy 版本。请注意，在 SQLAlchemy 2.0 及更高版本中，result.DataFrame() 方法已被弃用且不再可用。相反，您可以使用 pandas 库直接从查询结果创建 DataFrame 并执行绘图。
:::

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### Step 3. 创建 Notebook 并将其连接到 Databend

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新选项卡）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 以创建一个 notebook。

3. 在单独的单元格中按顺序运行以下代码。通过这样做，您将在本地 Databend 中创建一个包含 5 行的表，并使用条形图可视化数据。

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

您现在可以在 notebook 上看到一个条形图：

![Alt text](/img/integration/jupyter-ipython-sql.png)

## Tutorial-3: 使用 Python Binding 库将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署本地 Databend 实例和 Jupyter Notebook，然后通过 [Databend Python Binding](https://pypi.org/project/databend/) 库在 notebook 中运行查询，以及在 notebook 中写入和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### Step 1. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install databend
pip install matplotlib
```

### Step 2. 创建 Notebook

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新选项卡）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 以创建一个 notebook。

3. 在单独的单元格中按顺序运行以下代码：

```python title='In [1]:'
# Import the necessary libraries
from databend import SessionContext

# Create a DataBend session
ctx = SessionContext()
```

```python title='In [2]:'
# Create a table in DataBend
ctx.sql("CREATE TABLE IF NOT EXISTS user (created_at Date, count Int32)")
```

```python title='In [3]:'
# Insert multiple rows of data into the table
ctx.sql("INSERT INTO user VALUES ('2022-04-01', 5), ('2022-04-01', 3), ('2022-04-03', 4), ('2022-04-03', 1), ('2022-04-04', 10)")
```

```python title='In [4]:'
# Execute a query
result = ctx.sql("SELECT created_at as date, count(*) as count FROM user GROUP BY created_at")

# Display the query result
result.show()
```

```python title='In [5]:'
# Import libraries for data visualization
import matplotlib.pyplot as plt

# Convert the query result to a Pandas DataFrame
df = result.to_pandas()
```

```python title='In [6]:'
# Create a bar chart to visualize the data
df.plot.bar(x='date', y='count')
plt.show()
```

您现在可以在 notebook 上看到一个条形图：

![Alt text](/img/integration/localhost_8888_notebooks_Untitled.ipynb.png)

## Tutorial-4: 使用 ipython-sql 将 Databend Cloud 与 Jupyter Notebook 集成

在本教程中，您将首先从 Databend Cloud 获取连接信息并部署 Jupyter Notebook，然后创建 notebook 并通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 将其连接到 Databend Cloud，以及在 notebook 中写入和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### Step 1. 获取连接信息

从 Databend Cloud 获取连接信息。有关如何执行此操作，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### Step 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 使用 pip 安装依赖项：

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### Step 3. 创建 Notebook 并将其连接到 Databend Cloud

1. 运行以下命令以启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新选项卡）到以下 URL：http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. 选择 **New** > **Python 3** 以创建一个 notebook。

3. 在单独的单元格中按顺序运行以下代码。通过这样做，您将在 Databend Cloud 中创建一个包含 5 行的表，并使用条形图可视化数据。

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

您现在可以在 notebook 上看到一个条形图：

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)
```