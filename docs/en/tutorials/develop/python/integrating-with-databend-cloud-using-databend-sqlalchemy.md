---
title: "Python: Databend Cloud with SQLAlchemy"
---

In this tutorial, we'll walk you through how to use the `databend-sqlalchemy` library to connect to Databend Cloud, create a table, insert data, and query results using Python.

## Before You Start

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

## Step 1: Install Dependencies with pip

```shell
pip install databend-sqlalchemy
```

## Step 2: Connect with databend_sqlalchemy

1. Copy and paste the following code to the file `main.py`:

```python
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Connection, Engine

# Connecting to Databend Cloud with your credentials (replace PASSWORD, HOST, DATABASE, and WAREHOUSE_NAME)
engine = create_engine(
    f"databend://{username}:{password}@{host_port_name}/{database_name}?sslmode=disable"
)
cursor = engine.connect()
cursor.execute(text('DROP TABLE IF EXISTS data'))
cursor.execute(text('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )'))
cursor.execute(text("INSERT INTO data VALUES (1,'zz')"))
res = cursor.execute(text("SELECT * FROM data"))
print(res.fetchall())
```

2. Run `python main.py`:

```bash
python main.py
[(1, 'zz')]
```
