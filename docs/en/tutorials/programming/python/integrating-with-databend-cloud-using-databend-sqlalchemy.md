---
title: Integrating with Databend Cloud using databend-sqlalchemy
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
from databend_sqlalchemy import connector

# Connecting to Databend Cloud with your credentials (replace PASSWORD, HOST, DATABASE, and WAREHOUSE_NAME)
cursor = connector.connect(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}").cursor()
cursor.execute('DROP TABLE IF EXISTS data')
cursor.execute('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )')
cursor.execute("INSERT INTO data (Col1, Col2) VALUES (%s, %s), (%s, %s)", [1, 'yy', 2, 'xx'])
cursor.execute("SELECT * FROM data")
print(cursor.fetchall())
```

2. Run `python main.py`:

```bash
python main.py
[(1, 'yy'), (2, 'xx')]
```