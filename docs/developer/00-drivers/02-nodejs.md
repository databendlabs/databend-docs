---
title: Node.js
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend enables you to develop Node.js programs that interact with Databend using Databend Driver Node.js Binding. This driver provides an interface for connecting to Databend and performing operations such as executing SQL queries and retrieving results. With the Databend driver, you can take advantage of the powerful distributed computing capabilities of Databend and build scalable data processing applications. Visit https://www.npmjs.com/package/databend-driver for more information about the driver.

To install the Databend driver for Node.js:

```shell
npm install --save databend-driver
```

:::note
Before installing the driver, make sure to fulfill the following prerequisites:

- Node.js must already be installed on the environment where you want to install the driver.
- Ensure that you can run the `node` and `npm` commands.
- Depending on your environment, you may require sudo privileges to install the driver.
:::

## Databend Node.js Driver Behavior Summary

The Node.JS Driver offer similar functionalities as a binding of the Rust Driver, with identically named functions having the same logic and capabilities.

The table below summarizes the main behaviors and functions of the Node.js Driver and their purposes:

| Function Name    | Description                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `info`           | Returns the client's connection information.                                                                                                     |
| `version`        | Returns the result of executing the `SELECT VERSION()` statement.                                                                                |
| `exec`           | Executes an SQL statement and returns the number of rows affected.                                                                               |
| `query_iter`     | Executes an SQL query and returns an iterator for processing results row by row.                                                                 |
| `query_iter_ext` | Executes an SQL query and returns an iterator that includes statistical information about the results.                                           |
| `query_row`      | Executes an SQL query and returns a single row result.                                                                                           |
| `stream_load`    | Uploads data to a built-in Stage (`upload_to_stage`) and executes insert/replace with [stage attachment](/developer/apis/http#stage-attachment). |

## Tutorial-1: Integrating with Databend using Node.js

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](/guides/deploy/deploying-local).

### Step 1. Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### Step 2. Write a Node.js Program

<StepsWrap>

<StepContent number="1" title="Copy and paste the following code to a file named databend.js:">

```js title='databend.js'
const { Client } = require("databend-driver");

// Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
// Feel free to use your own values while maintaining the same format.
const dsn = process.env.DATABEND_DSN
  ? process.env.DATABEND_DSN
  : "databend://user1:abc123@localhost:8000/default?sslmode=disable";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("Connected to Databend Server!");
}

async function select_books() {
  var sql = "CREATE DATABASE IF NOT EXISTS book_db";
  await this.conn.exec(sql);
  console.log("Database created");

  var sql = "USE book_db";
  await this.conn.exec(sql);
  console.log("Database used");

  var sql =
    "CREATE TABLE IF NOT EXISTS books(title VARCHAR, author VARCHAR, date VARCHAR)";
  await this.conn.exec(sql);
  console.log("Table created");

  var sql =
    "INSERT INTO books VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')";
  await this.conn.exec(sql);
  console.log("1 record inserted");

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

<StepContent number="2" title="Run node databend.js">

```text
Connected to Databend Server!
Database created
Database used
Table created
1 record inserted
[ [ 'Readings in Database Systems', 'Michael Stonebraker', '2004' ] ]
```

</StepContent>

</StepsWrap>

## Tutorial-2: Integrating with Databend Cloud using Node.js

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 1. Create a Node.js Package

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

### Step 2. Add Dependencies

Install the Databend driver for Node.js:

```bash
$ npm install --save databend-driver
```

Add a new NPM script to `package.json` :

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

### Step 3. Connect with databend-driver

Create a file named `index.js` with the following code:

```javascript
const { Client } = require("databend-driver");

const dsn = process.env.DATABEND_DSN
  ? process.env.DATABEND_DSN
  : "databend://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("Connected to Databend Server!");
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
Replace {USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE} in the code with your connection information. For how to
obtain the connection information,
see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).
:::

### Step 4. Run sample with NPM

```shell
$ npm run run-example
```
