---
title: "Python: Databend Cloud with databend-driver"
---

In this tutorial, we'll walk you through how to use the `databend-driver` to connect to Databend Cloud, create a table, insert data, and retrieve results with Python.

## Before You Start

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

## Step 1: Install Dependencies with pip

```shell
pip install databend-driver
```

## Step 2: Connect with databend-driver

1. Copy and paste the following code to the file `main.py`:

```python
from databend_driver import BlockingDatabendClient

# Connecting to Databend Cloud with your credentials (replace PASSWORD, HOST, DATABASE, and WAREHOUSE_NAME)
client = BlockingDatabendClient(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}")

# Get a cursor from the client to execute queries
cursor = client.cursor()

# Drop the table if it exists
cursor.execute('DROP TABLE IF EXISTS data')

# Create the table if it doesn't exist
cursor.execute('CREATE TABLE IF NOT EXISTS data (x Int32, y String)')          

# Insert data into the table
cursor.execute("INSERT INTO data (x, y) VALUES (1, 'yy'), (2, 'xx')")

# Select all data from the table
cursor.execute('SELECT * FROM data')

# Fetch all rows from the result
rows = cursor.fetchall()

# Print the result
for row in rows:
    print(row.values())
```

2. Run `python main.py`:

```bash
python main.py
(1, 'yy')
(2, 'xx')
```
