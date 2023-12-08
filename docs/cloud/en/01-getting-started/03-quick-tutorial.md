---
title: "Hands-On Tutorial"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, you will create a database and a data table in Databend Cloud, and import a sample data. Before getting started, please ensure that you have successfully registered and logged in to your Databend Cloud account. For detailed instructions, please refer to [Activate Databend Cloud](01-new-account.md).

## Step 1: Create a Database and a Table

Click on **Worksheets** in the sidebar, and then click on **New Worksheet**. You will see a page like this:

![Alt text](@site/static/img/documents/getting-started/t1-1.png)

In the worksheet, we can write and execute SQL statements. All subsequent SQL operations in this tutorial will be executed through the workspace.

:::tip
The `default` next to the **Run Script** button refers to the default warehouse. You can also create more warehouses of different specifications on the **Warehouses** page according to your needs to adapt to different workloads.
:::

Copy and paste the following SQL statement to the editor, then click **Run Script** to create a database:

```sql
CREATE DATABASE book_db;
```
Copy and paste the following SQL statement to the editor, then click **Run Script** to create a table:

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

After clicking **Run Script**, you can see a prompt indicating that the SQL statement was executed successfully. Afterwards, you can refresh the page to view the newly created database and table in the left-hand navigation pane.

## Step 2: Load Data

You can choose any of the following methods to import data. Before starting, please click the link to download the sample file [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv).

- [Load with Data Loading Wizard](#load-with-data-loading-wizard)
- [Load with BendSQL](#load-with-bendsql)
- [Load with COPY INTO](#load-with-copy-into)

### Load with Data Loading Wizard 
<StepsWrap>
<StepContent number="1" title="On the Home page, click Load Data">

![Alt text](@site/static/img/documents/getting-started/t1-2.png)
</StepContent>
<StepContent number="2" title="Click An existing table">

![Alt text](@site/static/img/documents/getting-started/t1-3.png)
</StepContent>
<StepContent number="3" title="Select the local sample file, then click Next:">

![Alt text](@site/static/img/documents/getting-started/t1-4.png)
</StepContent>

<StepContent number="4" title="Confirm">

  Select `book_db` as the target database and `books` as the target table, then click **Confirm**.
</StepContent>
</StepsWrap>


### Load with BendSQL

Databend Cloud offers a CLI tool called BendSQL. You can also use BendSQL in your data pipeline to automate data import. To install BendSQL, please refer to [Using BendSQL](05-clients/09-bendsql.md).

1. On the Home page, click **Connect**:

![Alt text](@site/static/img/documents/getting-started/t1-2.png)

2. You can obtain the connection information as shown in  the following snapshot. If you do not see the password, click **Reset DB Password** to generate a new one:

![Alt text](@site/static/img/documents/getting-started/t1-6.png)

3. Open the command line console and execute the following command to log in to BendSQL:

```shell
bendsql connect -u cloudapp -p <password> -P443 --ssl -H <host-address> -d book_db
```

4. Execute the following command to upload the sample file:

```shell
bendsql load csv -f ~/Downloads/books.csv -t book_db.books --skip-header 0
```

If you can see printed messages like this, it indicates that the data loading was successful:

```shell
-> Uploading ...
-> Inserting into table: `book_db`.`books` ...
-> Successfully loaded into table: `book_db`.`books` in 1.067s
Rows: 2, Bytes: 157
```

### Load with COPY INTO

[COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) supports importing data from various data sources such as OSS, S3, Azure Blob, HTTPS URLs, etc.

Copy and paste the following SQL statement to the editor in your worksheet, then click **Run Script**:

```sql
COPY INTO book_db.books FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
    FILE_FORMAT = (type = CSV field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

## Step 3. Query Imported Data

Copy and paste the following SQL statement to the editor in your worksheet to get the number of books by different years:

```sql
SELECT count(*), date FROM book_db.books GROUP BY date;
```

You can also execute the same SQL statement with the BendSQL CLI tool:

```shell
╰─$ bendsql query
Connected with driver databend (DatabendQuery v0.9.44-nightly-72bde50(rust-1.68.0-nightly-2023-02-19T16:20:24.92751464Z))
Type "help" for help.

dd:cloudapp@tn3ftqihs--bl/book=> SELECT count(*), date FROM book_db.books GROUP BY date;
+----------+------+
| count(*) | date |
+----------+------+
|        1 | 1992 |
|        1 | 2004 |
+----------+------+
(2 rows)
```
