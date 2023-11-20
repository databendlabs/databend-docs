---
title: Python
---

This topic shows how to connect to Databend Cloud from a Python application using [databend-py](https://pypi.org/project/databend-py/) and [Databend SQLAlchemy](https://pypi.org/project/databend-sqlalchemy/).

## Prerequisites

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

## databend-py

### Step 1. Install Dependencies with pip

```shell
pip install databend-py
```

### Step 2. Connect with databend-py

```python
from databend_py import Client

client = Client.from_url(f"https://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}")
client.execute('DROP TABLE IF EXISTS data')
client.execute('CREATE TABLE if not exists data (x Int32,y VARCHAR)')
client.execute('DESC  data')
client.execute("INSERT INTO data (Col1,Col2) VALUES ", [1, 'yy', 2, 'xx'])
_, res = client.execute('select * from data')
print(res)
```

## databend-sqlalchemy

### Step 1. Install Dependencies with pip

```shell
pip install databend-sqlalchemy
```

### Step 2. Connect with Databend SQLAlchemy

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
Replace {USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE} in the code with your connection information. For how to obtain the connection information, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).
:::
