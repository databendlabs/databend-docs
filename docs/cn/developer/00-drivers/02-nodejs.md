```markdown
---
title: Node.js
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend允许您开发与Databend交互的Node.js程序，使用Databend Driver Node.js绑定。这个驱动提供了一个连接到Databend并执行操作的接口，例如执行SQL查询和检索结果。通过Databend驱动，您可以利用Databend强大的分布式计算能力，构建可扩展的数据处理应用程序。访问 https://www.npmjs.com/package/databend-driver 了解更多关于驱动的信息。

安装Node.js的Databend驱动：

```shell
npm install --save databend-driver
```

:::note
在安装驱动之前，请确保满足以下先决条件：

- Node.js必须已经安装在您想要安装驱动的环境上。
- 确保您可以运行`node`和`npm`命令。
- 根据您的环境，您可能需要sudo权限来安装驱动。
:::

## Databend Node.js驱动行为总结

Node.js驱动提供了类似于Rust驱动绑定的功能，具有相同名称的函数具有相同的逻辑和能力。

下表总结了Node.js驱动的主要行为和功能及其用途：

| 函数名称         | 描述                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `info`          | 返回客户端的连接信息。                                                                                                        |
| `version`       | 返回执行`SELECT VERSION()`语句的结果。                                                                                       |
| `exec`          | 执行一个SQL语句并返回受影响的行数。                                                                                          |
| `query_iter`    | 执行一个SQL查询并返回一个迭代器，用于逐行处理结果。                                                                           |
| `query_iter_ext`| 执行一个SQL查询并返回一个包含结果统计信息的迭代器。                                                                           |
| `query_row`     | 执行一个SQL查询并返回单行结果。                                                                                              |
| `stream_load`   | 将数据上传到内置Stage（`upload_to_stage`）并执行插入/替换[stage attachment](/developer/apis/http#stage-attachment)。          |

## 教程-1：使用Node.js与Databend集成

在开始之前，请确保您已经成功安装了本地Databend。有关详细说明，请参阅[本地和Docker部署](/guides/deploy/deploying-local)。

### 步骤1. 准备一个SQL用户账户

为了连接您的程序到Databend并执行SQL操作，您必须在代码中提供一个具有适当权限的SQL用户账户。如果需要，请在Databend中创建一个，并确保SQL用户仅具有出于安全考虑所需的权限。

本教程使用一个名为'user1'，密码为'abc123'的SQL用户作为示例。由于程序将向Databend写入数据，用户需要ALL权限。有关如何管理SQL用户及其权限，请参阅[用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤2. 编写一个Node.js程序

<StepsWrap>

<StepContent number="1" title="将以下代码复制并粘贴到一个名为databend.js的文件中：">

```js title='databend.js'
const { Client } = require("databend-driver");

// 连接到一个本地Databend，使用一个名为'user1'和密码'abc123'的SQL用户作为示例。
// 在保持相同格式的同时，随意使用您自己的值。
const dsn = process.env.DATABEND_DSN
  ? process.env.DATABEND_DSN
  : "databend://user1:abc123@localhost:8000/default?sslmode=disable";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("已连接到Databend服务器！");
}

async function select_books() {
  var sql = "CREATE DATABASE IF NOT EXISTS book_db";
  await this.conn.exec(sql);
  console.log("数据库已创建");

  var sql = "USE book_db";
  await this.conn.exec(sql);
  console.log("正在使用数据库");

  var sql =
    "CREATE TABLE IF NOT EXISTS books(title VARCHAR, author VARCHAR, date VARCHAR)";
  await this.conn.exec(sql);
  console.log("表已创建");

  var sql =
    "INSERT INTO books VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')";
  await this.conn.exec(sql);
  console.log("已插入1条记录");

  var sql = "SELECT * FROM books";
  const rows = await this.conn.queryIter(sql);
  const ret = [];
  let row = await rows.next();
  while (row) {
    ret.push(row.values());
    row = await rows.next();
  }
  console.log(ret);
}

create_conn().then((conn) => {
  select_books();
});
```

</StepContent>

<StepContent number="2" title="运行 node databend.js">

```text
已连接到Databend服务器！
数据库已创建
正在使用数据库
表已创建
已插入1条记录
[ [ 'Readings in Database Systems', 'Michael Stonebraker', '2004' ] ]
```

</StepContent>

</StepsWrap>

## 教程-2：使用Node.js与Databend云集成

在开始之前，请确保您已经成功创建了一个数据仓库并获得了连接信息。有关如何做到这一点，请参阅[连接到数据仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤1. 创建一个Node.js包

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

### 步骤2. 添加依赖项

安装Node.js的Databend驱动：

```bash
$ npm install --save databend-driver
```

在`package.json`中添加一个新的NPM脚本：

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

### 步骤3. 使用databend-driver连接

创建一个名为`index.js`的文件，包含以下代码：

```javascript
const { Client } = require("databend-driver");

const dsn = process.env.DATABEND_DSN
  ? process.env.DATABEND_DSN
  : "databend://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("已连接到Databend服务器！");
}

async function select_data() {
  let sql_table_create = `CREATE TABLE IF NOT EXISTS data (
		i64 Int64,
		u64 UInt64,
		f64 Float64,
		s   String,
		s2  String,
		d   Date,
		t   DateTime)`;

  await this.conn.exec(sql_table_create);

  let sql_insert =
    "INSERT INTO data VALUES ('1234', '2345', '3.1415', 'test', 'test2', '2021-01-01', '2021-01-01 00:00:00');";
  await this.conn.exec(sql_insert);

  let sql_select = "SELECT * FROM data";
  const rows = await this.conn.queryIter(sql_select);
  const ret = [];
  let row = await rows.next();
  while (row) {
    ret.push(row.values());
    row = await rows.next();
  }
  console.log(ret);
}

create_conn().then((conn) => {
  select_data();
});
```

:::tip
在代码中将{USER}、{PASSWORD}、{WAREHOUSE_HOST}和{DATABASE}替换为您的连接信息。有关如何获取连接信息，请参阅[连接到数据仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 步骤4. 使用NPM运行示例

```shell
$ npm run run-example
```
```