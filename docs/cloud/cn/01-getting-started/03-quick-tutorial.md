---
title: "快速上手"
---
import StartedQuickly from '@site/src/components/VideoFrame/started-quickly';

在本教程中，您将在 Databend Cloud 创建一个数据库和一个数据表格，并导入一份样本数据。在开始之前，请确保您已成功注册和登录 Databend Cloud 账号，详细步骤请参考[开通 Databend Cloud](00-activate.md)。

## 观看视频

<StartedQuickly />

## 第一步：创建数据库和表格

点击侧边栏的“工作区”，然后点击“创建工作区”，可以看到如下操作界面：

![Alt text](@site/static/img/documents_cn/getting-started/t1-1.png)

在工作区中我们可以编写并执行 SQL 语句，本教程后续的 SQL 操作，均通过工作区来执行。

:::tip
"运行"按钮旁边的 `default` 是平台默认的计算集群，您也可以根据自己的需要，在计算集群页面创建不同规格的计算集群来适应不同的工作负载。
:::

编写 SQL 创建数据库，并点击"运行"：

```sql
CREATE DATABASE book_db;
```
编写 SQL 创建数据表，并点击"运行"：

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```

点击"运行"后可以看到平台提示 SQL 执行成功，随后刷新页面后即可看到左侧的数据向导栏中会显示出新的数据库和数据表。

## 第二步：导入数据

您可以选择以下任意一种方式来导入数据。开始前，请先点击链接下载样例文件 [books.csv](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)。

- [通过云平台上传导入文件](#通过云平台上传导入文件)
- [通过 BendSQL 导入文件](#通过-bendsql-导入文件)
- [使用 COPY INTO 命令导入文件](#使用-copy-into-命令导入文件)

### 通过云平台上传导入文件

1. 打开首页，点击“导入数据“：

![Alt text](@site/static/img/documents_cn/getting-started/t1-2.png)

2. 选择"已存在的表"：

![Alt text](@site/static/img/documents_cn/getting-started/t1-3.png)

3. 选中本地文件后，点击“下一步”：

![Alt text](@site/static/img/documents_cn/getting-started/t1-4.png)

4. 选择目标数据库为 `book_db`，目标表为 `books`，然后点击"确认"。

### 通过 BendSQL 导入文件

为了便于自动化操作，Databend Cloud 提供了 CLI 工具 BendSQL。您也可以将 BendSQL 用于您的数据流水线中，使数据导入自动化。安装 BendSQL 参考[使用 BendSQL](05-clients/09-bendsql.md)。

1. 打开首页，点击“连接”按钮获取连接信息：

![Alt text](@site/static/img/documents_cn/getting-started/t1-5.png)

2. 可得到如下连接信息，如果未看到密码，可以点击"重置数据库密码"生成新密码：

![Alt text](@site/static/img/documents_cn/getting-started/t1-6.png)

3. 打开命令行控制台，执行下述命令登录 BendSQL:

```shell
bendsql connect -u cloudapp -p <密码> -P443 --ssl -H <主机地址> -d book_db
```

4. 执行下述命令上传文件：

```shell
bendsql load csv -f ~/Downloads/books.csv -t book_db.books --skip-header 0
```

打印类似下述输出表示上传成功：

```shell
-> Uploading ...
-> Inserting into table: `book_db`.`books` ...
-> Successfully loaded into table: `book_db`.`books` in 1.067s
Rows: 2, Bytes: 157
```

### 使用 COPY INTO 命令导入文件

COPY INTO 支持从 OSS、S3、Azure Blob、HTTPS 地址等不同数据源执行数据导入。

在工作区中粘贴下述 SQL 语句，并点击"运行"：

```sql
COPY INTO book_db.books FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv'
    FILE_FORMAT = (type = CSV field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

## 第三步：查询导入的数据

在工作区中输入下述 SQL 分析不同年份书籍的数量：

```sql
SELECT count(*), date FROM book_db.books GROUP BY date;
```

也可以通过 CLI 工具 BendSQL 执行同一 SQL：

```shell
╰─$ bendsql query                                                                                                                                                                                                                                                       130 ↵
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

## 了解更多

现在您对 Databend Cloud 的基本使用已有所了解。接下来，怎样利用 Databend Cloud 来解决真实数据分析需求？Databend Cloud 已提供了丰富的解决方案来应对不同的场景需求，请参考下述文档：

- [使用 Python 脚本连接 Databend Cloud](../06-develop/01-python.md)
