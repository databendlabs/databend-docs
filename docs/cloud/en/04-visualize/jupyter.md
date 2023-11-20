---
title: Jupyter Notebook
---

[Jupyter Notebook](https://jupyter.org) is a web-based interactive application that enables you to create notebook documents that feature live code, interactive plots, widgets, equations, images, etc., and share these documents easily. It is also quite versatile as it can support many programming languages via kernels such as Julia, Python, Ruby, Scala, Haskell, and R.

With [ipython-sql](https://github.com/catherinedevlin/ipython-sql), you can establish a connection to Databend Cloud within a Jupyter Notebook, allowing you to execute queries and visualize your data from Databend Cloud directly in the Notebook.

## Tutorial: Integrate with Jupyter Notebook using ipython-sql

In this tutorial, you will first obtain connection information from Databend Cloud and deploy Jupyter Notebook, then create and connect a notebook to Databend Cloud through [ipython-sql](https://github.com/catherinedevlin/ipython-sql), as well as write and visualize data within the notebook.

Before you start, ensure that you have [Python](https://www.python.org/) installed on your system.

### Step 1. Obtain Connection Information

Obtain the connection information from Databend Cloud. For how to do that, refer to [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

### Step 2. Deploy Jupyter Notebook

1. Install Jupyter Notebook with pip:

```shell
pip install notebook
```

2. Install dependencies with pip:

```shell
pip install ipython-sql databend-sqlalchemy
pip install sqlalchemy
```

### Step 3. Create and Connect a Notebook to Databend Cloud

1. Run the command below to start Jupyter Notebook:

```shell
jupyter notebook
```

  This will start up Jupyter and your default browser should start (or open a new tab) to the following URL: http://localhost:8888/tree

![Alt text](@site/static/img/documents/pricing-billing/notebook-tree.png)

2. Select **New** > **Python 3** to create a notebook.

3. Run the following code sequentially in separate cells. By doing so, you create a table containing 5 rows in Databend Cloud, and visualize the data with a bar chart.

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
You can now see a bar chart on the notebook:

![Alt text](@site/static/img/documents/BI/jupyter-bar.png)