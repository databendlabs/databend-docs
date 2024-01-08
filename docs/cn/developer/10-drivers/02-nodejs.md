---
title: Node.js
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 允许您使用 Databend Driver Node.js 绑定开发与 Databend 交互的 Node.js 程序。这个驱动程序提供了一个接口，用于连接到 Databend 并执行操作，例如执行 SQL 查询和检索结果。通过 Databend 驱动程序，您可以利用 Databend 的强大分布式计算能力，构建可扩展的数据处理应用程序。访问 https://www.npmjs.com/package/databend-driver 了解更多关于驱动程序的信息。

安装 Node.js 的 Databend 驱动程序：

```shell
npm install --save databend-driver
```

:::note
在安装驱动程序之前，请确保满足以下先决条件：

- Node.js 必须已经安装在您想要安装驱动程序的环境上。
- 确保您可以运行`node`和`npm`命令。
- 根据您的环境，您可能需要 sudo 权限来安装驱动程序。
:::

## 教程-1：使用 Node.js 与 Databend 集成

在开始之前，请确保您已经成功安装了本地 Databend。有关详细说明，请参阅[本地和 Docker 部署](/guides/deploy/deploying-local)。

### 步骤 1. 准备一个 SQL 用户账户

要将您的程序连接到 Databend 并执行 SQL 操作，您必须在代码中提供具有适当权限的 SQL 用户账户。如果需要，请在 Databend 中创建一个，并确保 SQL 用户仅具有出于安全考虑所需的权限。

本教程使用名为'user1'，密码为'abc123'的 SQL 用户作为示例。由于程序将向 Databend 写入数据，用户需要所有权限。有关如何管理 SQL 用户及其权限的信息，请参阅[用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤 2. 编写一个 Node.js 程序

<StepsWrap>

<StepContent number="1" title="将以下代码复制并粘贴到名为databend.js的文件中：">

```js title='databend.js'
const { Client } = require("databend-driver");

// 下面的代码以用户名 "user1" 的 SQL 用户和密码 "abc123" 为例连接到本地 Databend 实例。
// 在保持相同格式的条件下，您可以随意使用自己的值。
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

## 教程-2：使用 Node.js 与 Databend Cloud 集成

在开始之前，请确保您已经成功创建了一个计算集群并获得了连接信息。有关如何做到这一点，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 创建一个 Node.js 包

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

### 步骤 2. 添加依赖项

安装 Node.js 的 Databend 驱动程序：

```bash
$ npm install --save databend-driver
```

在`package.json`中添加一个新的 NPM 脚本：

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

### 步骤 3. 使用 databend-driver 连接

创建一个名为`index.js`的文件，并写入以下代码：

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
将代码中的{USER}、{PASSWORD}、{WAREHOUSE_HOST}和{DATABASE}替换为您的连接信息。有关如何获取连接信息，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 步骤 4. 使用 NPM 运行示例

```shell
$ npm run run-example
```