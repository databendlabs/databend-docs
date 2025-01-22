---
title: 与私有化部署 Databend 集成
---

本教程演示了如何使用 Python 连接到本地部署的 Databend 实例。我们将介绍三种方法——`databend-driver`、`databend-sqlalchemy` 与连接器，以及 `databend-sqlalchemy` 与引擎——来执行基本操作，如创建数据库、添加表、插入数据、查询和清理资源。

## 开始之前

在开始之前，请确保您已成功安装本地 Databend。有关详细说明，请参阅 [本地和 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

## 第一步：准备 SQL 用户账户

要将您的程序连接到 Databend 并执行 SQL 操作，您必须在代码中提供一个具有适当权限的 SQL 用户账户。如果需要，请在 Databend 中创建一个，并确保该 SQL 用户仅具有必要的权限以确保安全。

本教程使用名为 'user1' 且密码为 'abc123' 的 SQL 用户作为示例。由于程序将向 Databend 写入数据，因此用户需要 ALL 权限。有关如何管理 SQL 用户及其权限的信息，请参阅 [用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## 第二步：编写 Python 程序

在此步骤中，您将创建一个与 Databend 通信的简单 Python 程序。该程序将涉及创建表、插入数据和执行数据查询等任务。

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

# 连接到本地 Databend，使用名为 'user1' 且密码为 'abc123' 的 SQL 用户作为示例。
client = BlockingDatabendClient('databend://user1:abc123@127.0.0.1:8000/?sslmode=disable')

# 创建一个游标以与 Databend 交互
cursor = client.cursor()

# 创建数据库并使用它
cursor.execute("CREATE DATABASE IF NOT EXISTS bookstore")
cursor.execute("USE bookstore")

# 创建表
cursor.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")

# 向表中插入数据
cursor.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

# 从表中查询数据
cursor.execute("SELECT * FROM booklist")
rows = cursor.fetchall()

# 打印结果
for row in rows:
    print(f"{row[0]} {row[1]} {row[2]}")

# 删除表和数据库
cursor.execute('DROP TABLE booklist')
cursor.execute('DROP DATABASE bookstore')

# 关闭游标
cursor.close()
```

3. 运行 `python main.py`：

```bash
python main.py
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy (连接器)">

您将使用 databend-sqlalchemy 库创建一个连接器实例，并使用游标对象执行 SQL 查询。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

```python title='main.py'
from databend_sqlalchemy import connector

# 连接到本地 Databend，使用名为 'user1' 且密码为 'abc123' 的 SQL 用户作为示例。
# 请随意使用您自己的值，同时保持相同的格式。
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

# 关闭连接。
conn.close()
```

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (引擎)">

您将使用 databend-sqlalchemy 库创建一个引擎实例，并使用 connect 方法创建可以执行查询的连接来执行 SQL 查询。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

```python title='main.py'
from sqlalchemy import create_engine, text

# 连接到本地 Databend，使用名为 'user1' 且密码为 'abc123' 的 SQL 用户作为示例。
# 请随意使用您自己的值，同时保持相同的格式。
# 设置 secure=False 意味着客户端将使用 HTTP 而不是 HTTPS 连接到 Databend。
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

# 关闭连接。
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
