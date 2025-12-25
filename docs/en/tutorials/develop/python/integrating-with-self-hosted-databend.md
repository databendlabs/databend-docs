---
title: "Python: Self-hosted Databend"
---

This tutorial demonstrates how to connect to a locally deployed Databend instance using Python. We'll cover three approaches—`databend-driver`, `databend-sqlalchemy` with the connector, and `databend-sqlalchemy` with the engine—to perform basic operations such as creating a database, adding a table, inserting data, querying, and cleaning up resources.

## Before You Start

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](/guides/self-hosted/deployment/non-production/deploying-local).

## Step 1: Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## Step 2: Write a Python Program

In this step, you'll create a simple Python program that communicates with Databend. The program will involve tasks such as creating a table, inserting data, and executing data queries.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-driver" label="databend-driver">

1. Install databend-driver.

```shell
pip install databend-driver
```

2. Copy and paste the following code to the file `main.py`:

```python title='main.py'
from databend_driver import BlockingDatabendClient

# Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
client = BlockingDatabendClient('databend://user1:abc123@127.0.0.1:8000/?sslmode=disable')

# Create a cursor to interact with Databend
cursor = client.cursor()

# Create database and use it
cursor.execute("CREATE DATABASE IF NOT EXISTS bookstore")
cursor.execute("USE bookstore")

# Create table
cursor.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")

# Insert data into the table
cursor.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

# Query data from the table
cursor.execute("SELECT * FROM booklist")
rows = cursor.fetchall()

# Print the results
for row in rows:
    print(f"{row[0]} {row[1]} {row[2]}")

# Drop the table and database
cursor.execute('DROP TABLE booklist')
cursor.execute('DROP DATABASE bookstore')

# Close the cursor
cursor.close()
```

3. Run `python main.py`:

```bash
python main.py
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
