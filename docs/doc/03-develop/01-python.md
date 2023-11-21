---
title: Developing with Databend using Python
sidebar_label: Python
---

Databend offers the following Python packages enabling you to develop Python applications that interact with Databend:

- [databend-driver](https://pypi.org/project/databend-driver/): Provides asynchronous Python support for interacting with Databend via SQL queries and managing database connections. It's important to note that this driver exclusively operates in asynchronous mode.

- [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy): Provides a SQL toolkit and [Object-Relational Mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) to interface with the Databend database. [SQLAlchemy](https://www.sqlalchemy.org/) is a popular SQL toolkit and ORM for Python, and databend-SQLAlchemy is a dialect for SQLAlchemy that allows you to use SQLAlchemy to interact with Databend.

To install the latest `databend-driver` or `databend-sqlalchemy` package:

:::note
Both packages require Python version 3.5 or higher. To check your Python version, run `python --version` in your command prompt. 
:::

```bash
# install databend-driver
pip install databend-driver

# install databend-sqlalchemy
pip install databend-sqlalchemy
```

In the following tutorial, you'll learn how to utilize the packages above to develop your Python applications. The tutorial will walk you through creating a SQL user in Databend and then writing Python code to create a table, insert data, and perform data queries.

## Tutorial: Developing with Databend using Python

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](../10-deploy/05-deploying-local.md).

### Step 1. Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### Step 2. Write a Python Program

In this step, you'll create a simple Python program that communicates with Databend. The program will involve tasks such as creating a table, inserting data, and executing data queries.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-driver" label="databend-driver">

You will use the databend-driver library to create a client instance and execute SQL queries directly.

1. Install databend-driver.

```shell
pip install databend-driver
```
2. Copy and paste the following code to the file `main.py`:

```python title='main.py'
from databend_driver import AsyncDatabendClient
import asyncio

async def main():
    client = AsyncDatabendClient('databend+http://user1:abc123@127.0.0.1:8000/?sslmode=disable')
    conn = await client.get_conn()

    await conn.exec("CREATE DATABASE IF NOT EXISTS bookstore")
    await conn.exec("USE bookstore")
    await conn.exec("CREATE TABLE IF NOT EXISTS booklist(title String, author String, date String)")
    await conn.exec("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

    results = await conn.query_iter("SELECT * FROM booklist")
    async for result in results:
        print(result.values())

    await conn.exec('DROP TABLE booklist')
    await conn.exec('DROP DATABASE bookstore')

asyncio.run(main())
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