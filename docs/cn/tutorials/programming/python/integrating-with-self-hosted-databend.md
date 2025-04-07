```md
---
title: Integrating with Self-Hosted Databend
---

本教程演示了如何使用 Python 连接到本地部署的 Databend 实例。我们将介绍三种方法——`databend-driver`、带有连接器的 `databend-sqlalchemy` 以及带有引擎的 `databend-sqlalchemy`——来执行基本操作，例如创建数据库、添加表、插入数据、查询和清理资源。

## Before You Start

在开始之前，请确保已成功安装本地 Databend。有关详细说明，请参阅 [Local and Docker Deployments](/guides/deploy/deploy/non-production/deploying-local)。

## Step 1: Prepare a SQL User Account

要将程序连接到 Databend 并执行 SQL 操作，必须在代码中提供具有适当权限的 SQL 用户帐户。如果需要，在 Databend 中创建一个，并确保 SQL 用户仅具有必要的权限以确保安全。

本教程使用名为 'user1'，密码为 'abc123' 的 SQL 用户作为示例。由于程序会将数据写入 Databend，因此该用户需要 ALL 权限。有关如何管理 SQL 用户及其权限，请参阅 [User & Role](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## Step 2: Write a Python Program

在此步骤中，你将创建一个与 Databend 通信的简单 Python 程序。该程序将涉及创建表、插入数据和执行数据查询等任务。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-driver" label="databend-driver">

1. 安装 databend-driver。

```shell
pip install databend-driver
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

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

3. 运行 `python main.py`：

```bash
python main.py
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy (Connector)">

你将使用 databend-sqlalchemy 库创建一个 connector 实例，并使用 cursor 对象执行 SQL 查询。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

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

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (Engine)">

你将使用 databend-sqlalchemy 库创建一个引擎实例，并使用 connect 方法创建可以执行查询的连接。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

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

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>
</Tabs>
```