---
title: Python
---

Databend为您提供以下Python包，使您能够开发与Databend交互的Python应用程序：

- [databend-py](https://github.com/databendcloud/databend-py)：提供直接接口连接Databend数据库。您可以执行标准的Databend操作，如用户登录、数据库和表的创建、数据插入/加载和查询。

- [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy)：提供SQL工具包和[对象关系映射](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)来与Databend数据库交互。[SQLAlchemy](https://www.sqlalchemy.org/)是Python中流行的SQL工具包和ORM，databend-SQLAlchemy是SQLAlchemy的方言，允许您使用SQLAlchemy与Databend交互。

这两个包都需要Python 3.5或更高版本。要检查您的Python版本，请在命令提示符中运行`python --version`。要安装最新的`databend-py`或`databend-sqlalchemy`包：

```bash
# 安装 databend-py
pip install databend-py

# 安装 databend-sqlalchemy
pip install databend-sqlalchemy
```

在以下教程中，您将学习如何使用上述包来开发Python应用程序。教程将指导您在Databend中创建SQL用户，然后编写Python代码来创建表、插入数据和执行数据查询。

## 教程-1：使用Python与Databend集成

在开始之前，请确保您已成功安装了本地Databend。有关详细说明，请参见[本地和Docker部署](/guides/deploy/deploying-local)。

### 步骤1. 准备SQL用户账户

要将您的程序连接到Databend并执行SQL操作，您必须在代码中提供具有适当权限的SQL用户账户。如果需要，请在Databend中创建一个，并确保SQL用户仅具有出于安全考虑所需的权限。

本教程使用名为'user1'，密码为'abc123'的SQL用户作为示例。由于程序将向Databend写入数据，用户需要所有权限。有关如何管理SQL用户及其权限的信息，请参见[用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤2. 配置连接字符串（针对databend-py）

`databend-py`支持可以作为URL参数或传递给Client的属性来配置的各种参数。下面提供的两个示例展示了为常见DSN设置这些参数的等效方法：

示例1：使用URL参数

```python
# 格式：<schema>://<username>:<password>@<host_port>/<database>?<connection_params>
client = Client.from_url('http://root@localhost:8000/db?secure=False&copy_purge=True&debug=True')
```

示例2：使用Client参数

```python
client = Client(
    host='tenant--warehouse.ch.datafusecloud.com',
    database="default",
    user="user",
    port="443",
    password="password", settings={"copy_purge": True, "force": True})
```

要创建有效的DSN，请根据您的需求选择适当的连接参数，详细信息请参见[这里](https://github.com/databendcloud/databend-py/blob/main/docs/connection.md)。

### 步骤3. 编写Python程序

在这一步中，您将创建一个与Databend通信的简单Python程序。程序将涉及创建表、插入数据和执行数据查询等任务。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-py" label="databend-py">

您将使用databend-py库创建客户端实例并直接执行SQL查询。

1. 安装databend-py。

```shell
pip install databend-py
```

2. 将以下代码复制并粘贴到文件`main.py`中：

```python title='main.py'
from databend_py import Client

# 设置 secure=False 表示客户端将通过HTTP而不是HTTPS连接到Databend。
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

# 关闭连接。
client.disconnect()
```

3. 运行`python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```
</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy (连接器)">

您将使用databend-sqlalchemy库创建连接器实例，并使用cursor对象执行SQL查询。

1. 安装databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件`main.py`中：

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

# 关闭连接。
conn.close()
```

3. 运行`python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```
</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (引擎)">

您将使用databend-sqlalchemy库创建引擎实例，并使用connect方法创建连接来执行SQL查询。

1. 安装databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制并粘贴到文件`main.py`中：

```python title='main.py'
from sqlalchemy import create_engine, text

# 设置 secure=False 表示客户端将通过HTTP而不是HTTPS连接到Databend。
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

## 教程-2：使用 Python (databend-py) 与 Databend Cloud 集成

开始之前，请确保您已成功创建计算集群并获取了连接信息。关于如何操作，请参见[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 使用 pip 安装依赖

```shell
pip install databend-py
```

### 步骤 2. 使用 databend-py 连接

```python
from databend_py import Client

client = Client.from_url(f"https://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}?secure=true")
client.execute('DROP TABLE IF EXISTS data')
client.execute('CREATE TABLE if not exists data (x Int32,y VARCHAR)')
client.execute('DESC  data')
client.execute("INSERT INTO data (Col1,Col2) VALUES ", [1, 'yy', 2, 'xx'])
_, res = client.execute('select * from data')
print(res)
```

## 教程-3：使用 Python (databend-sqlalchemy) 与 Databend Cloud 集成

开始之前，请确保您已成功创建计算集群并获取了连接信息。关于如何操作，请参见[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 使用 pip 安装依赖

```shell
pip install databend-sqlalchemy
```

### 步骤 2. 使用 Databend SQLAlchemy 连接

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
请将代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 替换为您的连接信息。关于如何获取连接信息，请参见[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::