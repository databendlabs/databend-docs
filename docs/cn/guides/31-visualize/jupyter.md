---
title: Jupyter Notebook
---

[Jupyter Notebook](https://jupyter.org) 是一个基于网页的交互式应用程序，使您能够创建包含实时代码、交互式图表、小部件、方程式、图像等的笔记本文档，并轻松共享这些文档。它也非常多才多艺，因为它可以通过内核支持多种编程语言，如 Julia、Python、Ruby、Scala、Haskell 和 R。

通过 Python 中的 SQLAlchemy 库或 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，您可以在 Jupyter Notebook 中建立与 Databend 和 Databend Cloud 的连接，从而直接在笔记本中执行查询并从 Databend 可视化您的数据。

或者，您可以使用 [Databend Python Binding](https://pypi.org/project/databend/) 库在 Python 中运行 SQL 查询，使您能够在本地 Python 环境或在线服务（如 Jupyter Notebook 和 Google Colab）中直接利用 DataBend 的功能，而无需部署单独的 DataBend 实例。

## 教程-1：使用 SQLAlchemy 将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署一个本地的 Databend 实例和 Jupyter Notebook，然后运行一个示例笔记本，通过 SQLAlchemy 库连接到您的本地 Databend，并在笔记本中编写和可视化数据。

在开始之前，请确保您已完成以下任务：

- 您的系统上已安装 [Python](https://www.python.org/)。
- 将示例笔记本 [databend.ipynb](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/integration/databend.ipynb) 下载到本地文件夹。

### 步骤 1. 部署 Databend

1. 按照 [部署指南](/guides/deploy) 部署一个本地的 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此账户在 Jupyter Notebook 中连接到 Databend。

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

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新标签）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 在 **Files** 标签页中，导航到您下载的示例笔记本并打开它。

3. 在示例笔记本中，依次运行单元格。通过这样做，您将在本地 Databend 中创建一个包含 5 行的表，并使用条形图可视化数据。

![Alt text](/img/integration/integration-gui-jupyter.png)

## 教程-2：使用 ipython-sql 将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署一个本地的 Databend 实例和 Jupyter Notebook，然后运行一个示例笔记本，通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 连接到您的本地 Databend，并在笔记本中编写和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### 步骤 1. 部署 Databend

1. 按照 [部署指南](/guides/deploy) 部署一个本地的 Databend。
2. 在 Databend 中创建一个 SQL 用户。您将使用此账户在 Jupyter Notebook 中连接到 Databend。

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

### 步骤 3. 创建并连接笔记本到 Databend

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新标签）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建一个笔记本。

3. 依次在单独的单元格中运行以下代码。通过这样做，您将在本地 Databend 中创建一个包含 5 行的表，并使用条形图可视化数据。

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

您现在可以在笔记本上看到一个条形图：

![Alt text](/img/integration/jupyter-ipython-sql.png)

## 教程-3：使用 Python Binding 库将 Databend 与 Jupyter Notebook 集成

在本教程中，您将首先部署一个本地的 Databend 实例和 Jupyter Notebook，然后通过 [Databend Python Binding](https://pypi.org/project/databend/) 库在笔记本中运行查询，并在笔记本中编写和可视化数据。

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

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新标签）到以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建一个笔记本。

3. 依次在单独的单元格中运行以下代码：

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
# 创建一个条形图以可视化数据
df.plot.bar(x='date', y='count')
plt.show()
```

您现在可以在笔记本上看到一个条形图：

![Alt text](/img/integration/localhost_8888_notebooks_Untitled.ipynb.png)

## 教程-4：使用 ipython-sql 将 Databend Cloud 与 Jupyter Notebook 集成

在本教程中，您将首先从 Databend Cloud 获取连接信息并部署 Jupyter Notebook，然后创建并连接一个笔记本到 Databend Cloud 通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，并在笔记本中编写和可视化数据。

在开始之前，请确保您的系统上已安装 [Python](https://www.python.org/)。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。具体操作方法请参考 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

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

### 步骤 3. 创建并连接笔记本到 Databend Cloud

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

这将启动 Jupyter，您的默认浏览器应启动（或打开一个新标签）到以下 URL：http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建一个笔记本。

3. 依次在单独的单元格中运行以下代码。通过这样做，您将在 Databend Cloud 中创建一个包含 5 行的表，并使用条形图可视化数据。

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

您现在可以在笔记本上看到一个条形图：

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)