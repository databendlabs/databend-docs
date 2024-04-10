---
title: Python
---

Databend offers the following Python packages enabling you to develop Python applications that interact with Databend:

- [databend-py (**Recommendation**)](https://github.com/databendcloud/databend-py): Provides a direct interface to the Databend database. It allows you to perform standard Databend operations such as user login, database and table creation, data insertion/loading, and querying.
- [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy): Provides a SQL toolkit and [Object-Relational Mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) to interface with the Databend database. [SQLAlchemy](https://www.sqlalchemy.org/) is a popular SQL toolkit and ORM for Python, and databend-SQLAlchemy is a dialect for SQLAlchemy that allows you to use SQLAlchemy to interact with Databend.

Both packages require Python version 3.5 or higher. To check your Python version, run `python --version` in your command prompt. To install the latest `databend-py` or `databend-sqlalchemy` package:

```bash
# install databend-py
pip install databend-py

# install databend-sqlalchemy
pip install databend-sqlalchemy
```

In the following tutorial, you'll learn how to utilize the packages above to develop your Python applications. The tutorial will walk you through creating a SQL user in Databend and then writing Python code to create a table, insert data, and perform data queries.

## Tutorial-1: Integrating with Databend using Python

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](/guides/deploy/deploy/non-production/deploying-local).

### Step 1. Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### Step 2. Configuring Connection String (for databend-py)

`databend-py` supports various parameters that can be configured either as URL parameters or as properties passed to the Client. The two examples provided below demonstrate equivalent ways of setting these parameters for the common DSN:

Example 1: Using URL parameters

```python
# Format: <schema>://<username>:<password>@<host_port>/<database>?<connection_params>
client = Client.from_url('http://root@localhost:8000/db?secure=False&copy_purge=True&debug=True')
```

Example 2: Using Client parameters

```python
client = Client(
    host='tenant--warehouse.ch.datafusecloud.com',
    database="default",
    user="user",
    port="443",
    password="password", settings={"copy_purge": True, "force": True})
```

To create a valid DSN, select appropriate connection parameters outlined [here](https://github.com/databendcloud/databend-py/blob/main/docs/connection.md) based on your requirements.

### Step 3. Write a Python Program

In this step, you'll create a simple Python program that communicates with Databend. The program will involve tasks such as creating a table, inserting data, and executing data queries.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-py" label="databend-py">

You will use the databend-py library to create a client instance and execute SQL queries directly.

1. Install databend-py.

```shell
pip install databend-py
```

2. Copy and paste the following code to the file `main.py`:

```python title='main.py'
from databend_py import Client

# Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
# Feel free to use your own values while maintaining the same format.
# Setting secure=False means the client will connect to Databend using HTTP instead of HTTPS.
client = Client('user1:abc123@127.0.0.1', port=8000, secure=False)
client.execute("CREATE DATABASE IF NOT EXISTS bookstore")
client.execute("USE bookstore")
client.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")
client.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

_, results = client.execute("SELECT * FROM booklist")
for (title, author, date) in results:
  print("{} {} {}".format(title, author, date))
client.execute('drop table booklist')
client.execute('drop database bookstore')

# Close Connect.
client.disconnect()
```

3. Run `python main.py`:

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy (Connector)">

You will use the databend-sqlalchemy library to create a connector instance and execute SQL queries using the cursor object.

1. Install databend-sqlalchemy.

```shell
pip install databend-sqlalchemy
```

2. Copy and paste the following code to the file `main.py`:

```python title='main.py'
from databend_sqlalchemy import connector

# Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
# Feel free to use your own values while maintaining the same format.
conn = connector.connect(f"http://user1:abc123@127.0.0.1:8000").cursor()
conn.execute("CREATE DATABASE IF NOT EXISTS bookstore")
conn.execute("USE bookstore")
conn.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")
conn.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")
conn.execute('SELECT * FROM booklist')

results = conn.fetchall()
for (title, author, date) in results:
  print("{} {} {}".format(title, author, date))
conn.execute('drop table booklist')
conn.execute('drop database bookstore')

# Close Connect.
conn.close()
```

3. Run `python main.py`:

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (Engine)">

You will use the databend-sqlalchemy library to create an engine instance and execute SQL queries using the connect method to create connections that can execute queries.

1. Install databend-sqlalchemy.

```shell
pip install databend-sqlalchemy
```

2. Copy and paste the following code to the file `main.py`:

```python title='main.py'
from sqlalchemy import create_engine, text

# Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
# Feel free to use your own values while maintaining the same format.
# Setting secure=False means the client will connect to Databend using HTTP instead of HTTPS.
engine = create_engine("databend://user1:abc123@127.0.0.1:8000/default?secure=False")

connection1 = engine.connect()
connection2 = engine.connect()

with connection1.begin() as trans:
    connection1.execute(text("CREATE DATABASE IF NOT EXISTS bookstore"))
    connection1.execute(text("USE bookstore"))
    connection1.execute(text("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)"))
    connection1.execute(text("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')"))

result = connection2.execute(text("SELECT * FROM booklist"))
results = result.fetchall()

for (title, author, date) in results:
    print("{} {} {}".format(title, author, date))

# Close Connect.
connection1.close()
connection2.close()
engine.dispose()
```

3. Run `python main.py`:

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>
</Tabs>

## Tutorial-2: Integrating with Databend Cloud using Python (databend-py)

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 1. Install Dependencies with pip

```shell
pip install databend-py
```

### Step 2. Connect with databend-py

```python
from databend_py import Client

client = Client.from_url(f"databend://{USER}:{PASSWORD}@${HOST}:443/{DATABASE}?&warehouse={WAREHOUSE_NAME}&secure=True)
client.execute('DROP TABLE IF EXISTS data')
client.execute('CREATE TABLE if not exists data (x Int32,y VARCHAR)')
client.execute('DESC  data')
client.execute("INSERT INTO data (Col1,Col2) VALUES ", [1, 'yy', 2, 'xx'])
_, res = client.execute('select * from data')
print(res)
```

## Tutorial-3: Integrating with Databend Cloud using Python (databend-sqlalchemy)

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 1. Install Dependencies with pip

```shell
pip install databend-sqlalchemy
```

### Step 2. Connect with Databend SQLAlchemy

```python
from databend_sqlalchemy import connector

cursor = connector.connect(f"databend://{USER}:{PASSWORD}@${HOST}:443/{DATABASE}?&warehouse={WAREHOUSE_NAME}).cursor()
cursor.execute('DROP TABLE IF EXISTS data')
cursor.execute('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )')
cursor.execute("INSERT INTO data (Col1,Col2) VALUES ", [1, 'yy', 2, 'xx'])
cursor.execute("SELECT * FROM data")
print(cursor.fetchall())
```

:::tip
Replace {USER}, {PASSWORD}, {HOST}, {WAREHOUSE_NAME} and {DATABASE} in the code with your connection information. For how to obtain the connection information, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).
:::
