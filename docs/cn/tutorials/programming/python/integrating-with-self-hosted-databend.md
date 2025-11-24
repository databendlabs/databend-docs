---
title: 集成私有化 Databend
---

本教程演示如何使用 Python 连接私有化部署的 Databend，涵盖三种连接方法：`databend-driver`、使用连接器的 `databend-sqlalchemy` 以及使用引擎的 `databend-sqlalchemy`。

## 开始之前

在开始之前，请确保已成功安装本地 Databend。有关详细说明，请参阅 [本地和 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

## 步骤 1：准备 SQL 用户帐户

要将程序连接到 Databend 并执行 SQL 操作，必须在代码中提供具有适当权限的 SQL 用户帐户。如果需要，在 Databend 中创建一个，并确保 SQL 用户仅具有必要的权限以确保安全。

本教程以 SQL 用户 'user1'，密码为 'abc123' 为例。由于程序会将数据写入 Databend，因此该用户需要 ALL 权限。有关如何管理 SQL 用户及其权限，请参阅 [用户 & 角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## 步骤 2：编写 Python 程序

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

# 连接到本地 Databend，以 SQL 用户 'user1' 和密码 'abc123' 为例。
client = BlockingDatabendClient('databend://user1:abc123@127.0.0.1:8000/?sslmode=disable')

# 创建一个 cursor 以与 Databend 交互
cursor = client.cursor()

# 创建数据库并使用它
cursor.execute("CREATE DATABASE IF NOT EXISTS bookstore")
cursor.execute("USE bookstore")

# 创建表
cursor.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")

# 将数据插入到表中
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

# 关闭 cursor
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

# 连接到本地 Databend，以 SQL 用户 'user1' 和密码 'abc123' 为例。
# 请随意使用你自己的值，同时保持相同的格式。
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

# 关闭 Connect。
conn.close()
```

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (Engine)">

你将使用 databend-sqlalchemy 库创建一个引擎实例，并使用 connect 方法执行 SQL 查询以创建可以执行查询的连接。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件 `main.py` 中：

```python title='main.py'
from sqlalchemy import create_engine, text

# 连接到本地 Databend，以 SQL 用户 'user1' 和密码 'abc123' 为例。
# 请随意使用你自己的值，同时保持相同的格式。
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

# 关闭 Connect。
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