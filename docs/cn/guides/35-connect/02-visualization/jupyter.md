---
title: Jupyter Notebook
sidebar_position: 6
---

[Jupyter Notebook](https://jupyter.org) 是一款基于网页的交互式应用程序，可用于创建包含实时代码、交互式图表、控件、公式、图像等内容的笔记本文档，并轻松共享这些文档。它支持通过内核运行多种编程语言，如 Julia、Python、Ruby、Scala、Haskell 和 R，具有极强的通用性。

通过 Python 的 SQLAlchemy 库或 [ipython-sql](https://github.com/catherinedevlin/ipython-sql)，您可以在 Jupyter Notebook 中建立与 Databend 和 Databend Cloud 的连接，从而直接在笔记本中执行查询并可视化 Databend 的数据。

此外，您还可以使用 [Databend Python Binding](https://pypi.org/project/databend/) 库在 Python 中运行 SQL 查询，无需部署单独的 Databend 实例，即可在本地 Python 环境或 Jupyter Notebook、Google Colab 等在线服务中直接使用 Databend 的功能。

## 教程一：使用 SQLAlchemy 集成 Databend 与 Jupyter Notebook

本教程将指导您先部署本地 Databend 实例和 Jupyter Notebook，然后运行示例笔记本通过 SQLAlchemy 库连接到本地 Databend，并在笔记本中写入和可视化数据。

开始前请确保已完成以下准备工作：

- 系统中已安装 [Python](https://www.python.org/)  
- 已将示例笔记本 [databend.ipynb](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/integration/databend.ipynb) 下载到本地文件夹

### 步骤 1. 部署 Databend

1. 按照 [部署指南](/guides/self-hosted) 部署本地 Databend  
2. 在 Databend 中创建 SQL 用户，该账户将用于在 Jupyter Notebook 中连接 Databend

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 安装依赖项：

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

启动后，默认浏览器将自动打开（或新建标签页）访问以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 在 **Files** 标签页中，导航至下载的示例笔记本并打开它。

3. 在示例笔记本中按顺序运行单元格。完成后，您将在本地 Databend 中创建包含 5 行数据的表，并通过条形图可视化数据。

![Alt text](/img/integration/integration-gui-jupyter.png)

## 教程二：使用 ipython-sql 集成 Databend 与 Jupyter Notebook

本教程将指导您先部署本地 Databend 实例和 Jupyter Notebook，然后运行示例笔记本通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 连接到本地 Databend，并在笔记本中写入和可视化数据。

开始前请确保系统中已安装 [Python](https://www.python.org/)。

### 步骤 1. 部署 Databend

1. 按照 [部署指南]/guides/self-hosted) 部署本地 Databend  
2. 在 Databend 中创建 SQL 用户，该账户将用于在 Jupyter Notebook 中连接 Databend

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL ON *.* TO user1;
```

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 安装依赖项：

:::note
进行本教程需要安装 SQLAlchemy 2.0 以下版本。请注意，在 SQLAlchemy 2.0 及更高版本中，result.DataFrame() 方法已被弃用。您可以使用 pandas 库直接从查询结果创建 DataFrame 并进行绘图。
:::

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### 步骤 3. 创建笔记本并连接 Databend

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

启动后，默认浏览器将自动打开（或新建标签页）访问以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建笔记本。

3. 在不同单元格中依次运行以下代码。完成后，您将在本地 Databend 中创建包含 5 行数据的表，并通过条形图可视化数据。

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

您现在可以在笔记本中看到条形图：

![Alt text](/img/integration/jupyter-ipython-sql.png)

## 教程三：使用 Python Binding 库集成 Databend 与 Jupyter Notebook

本教程将指导您先部署本地 Databend 实例和 Jupyter Notebook，然后通过 [Databend Python Binding](https://pypi.org/project/databend/) 库在笔记本中运行查询，并写入和可视化数据。

开始前请确保系统中已安装 [Python](https://www.python.org/)。

### 步骤 1. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 安装依赖项：

```shell
pip install databend
pip install matplotlib
```

### 步骤 2. 创建笔记本

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

启动后，默认浏览器将自动打开（或新建标签页）访问以下 URL：http://localhost:8888/tree

![Alt text](/img/integration/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建笔记本。

3. 在不同单元格中依次运行以下代码：

```python title='In [1]:'
# 导入必要库
from databend import SessionContext

# 创建 DataBend 会话
ctx = SessionContext()
```

```python title='In [2]:'
# 在 DataBend 中创建表
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
# 创建条形图可视化数据
df.plot.bar(x='date', y='count')
plt.show()
```

您现在可以在笔记本中看到条形图：

![Alt text](/img/integration/localhost_8888_notebooks_Untitled.ipynb.png)

## 教程四：使用 ipython-sql 集成 Databend Cloud 与 Jupyter Notebook

本教程将指导您先从 Databend Cloud 获取连接信息并部署 Jupyter Notebook，然后通过 [ipython-sql](https://github.com/catherinedevlin/ipython-sql) 创建笔记本并连接到 Databend Cloud，在笔记本中写入和可视化数据。

开始前请确保系统中已安装 [Python](https://www.python.org/)。

### 步骤 1. 获取连接信息

从 Databend Cloud 获取连接信息。具体操作请参考 [连接计算集群](/guides/cloud/resources/warehouses#connecting)。

### 步骤 2. 部署 Jupyter Notebook

1. 使用 pip 安装 Jupyter Notebook：

```shell
pip install notebook
```

2. 安装依赖项：

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### 步骤 3. 创建笔记本并连接 Databend Cloud

1. 运行以下命令启动 Jupyter Notebook：

```shell
jupyter notebook
```

启动后，默认浏览器将自动打开（或新建标签页）访问以下 URL：http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. 选择 **New** > **Python 3** 创建笔记本。

3. 在不同单元格中依次运行以下代码。完成后，您将在 Databend Cloud 中创建包含 5 行数据的表，并通过条形图可视化数据。

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

您现在可以在笔记本中看到条形图：

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)