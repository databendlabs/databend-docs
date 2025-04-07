---
title: Java
---

您可以通过专为 Java 编程语言设计的原生接口 [Databend JDBC 驱动](https://github.com/databendcloud/databend-jdbc) 从各种客户端工具和应用程序连接 Databend 并与之交互。

## 安装 Databend JDBC 驱动

本主题概述了下载和安装 Databend JDBC 驱动以在基于 Java 的项目中使用的步骤。该驱动程序需要 Java LTS（长期支持）1.8 或更高版本。如果您的客户端计算机没有最低要求的 Java 版本，请安装 [Oracle Java](http://www.java.com/en/download/manual.jsp) 或 [OpenJDK](http://openjdk.java.net)。

要下载 Databend JDBC 驱动程序：

1. 转到 Maven Central Repository，网址为 https://repo1.maven.org/maven2/com/databend/databend-jdbc/
2. 单击最新版本的目录。
3. 下载 jar 文件，例如 _databend-jdbc-0.1.1.jar_。

要验证 Databend JDBC 驱动程序的版本，例如 _databend-jdbc-0.1.1.jar_，请在终端中运行以下命令：

```bash
java -jar databend-jdbc-0.2.1.jar --version
```

Databend JDBC 驱动程序以 JAR 文件的形式提供，可以直接集成到基于 Java 的项目中。或者，您可以在项目的 pom.xml 文件中声明 Maven 依赖项，如下所示：

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.1</version>
</dependency>
```

:::tip DID YOU KNOW?
您还可以通过 Databend JDBC 驱动程序从 DBeaver 连接到 Databend。有关更多信息，请参见 [使用 JDBC 连接到 Databend](/guides/sql-clients/jdbc)。
:::

## 数据类型映射

下表说明了 Databend 数据类型及其对应的 Java 等效项之间的对应关系：

| Databend  | Java       |
| --------- | ---------- |
| TINYINT   | Byte       |
| SMALLINT  | Short      |
| INT       | Integer    |
| BIGINT    | Long       |
| UInt8     | Short      |
| UInt16    | Integer    |
| UInt32    | Long       |
| UInt64    | BigInteger |
| Float32   | Float      |
| Float64   | Double     |
| String    | String     |
| Date      | String     |
| TIMESTAMP | String     |
| Bitmap    | byte[]     |
| Array     | String     |
| Decimal   | BigDecimal |
| Tuple     | String     |
| Map       | String     |
| VARIANT   | String     |

## Databend JDBC 驱动行为摘要

Databend 的 JDBC 驱动程序通常遵循 JDBC 规范。以下是一些常见基本行为、其关联的关键函数以及它们背后的原则的列表。

| 基本行为                           | 主要功能                                                                                                                                                        | 原理                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 建立连接                | `DriverManager.getConnection`, `Properties.setProperty`                                                                                                              | `getConnection` 使用提供的连接字符串与 Databend 建立连接。<br /><br />`Properties` 对象用于构造连接参数，例如 `user` 和 `password`，这些参数也可以在连接字符串中指定。                                                                                                                                                                                                                                                                                           |
| 执行查询                        | `Statement.createStatement()`, `Statement.execute()`                                                                                                                 | `Statement.execute()` 使用 `v1/query` 接口执行查询。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 批量插入                          | `Connection.prepareStatement()`, `PrepareStatement.setInt()`, `PrepareStatement.setString()`, `PrepareStatement.addBatch()`, `PrepareStatement.executeBatch()` 等。 | Databend 支持使用 `PrepareStatement` 对象进行批量插入和替换（`INSERT INTO` 和 `REPLACE INTO`）。<br /><br />`PrepareStatement.setXXX()` 方法用于将值绑定到语句的参数。<br /><br />`PrepareStatement.addBatch()` 将尽可能多的数据添加到已创建的语句对象的批处理中。<br /><br />`PrepareStatement.executeBatch()` 将数据上传到内置的 Stage 并执行插入/替换操作，利用 [Stage Attachment](/developer/apis/http#stage-attachment)。 |
| 将文件上传到内部 Stage     | `Connection.uploadStream`                                                                                                                                            | 数据将上传到 Stage。 默认情况下，使用 `PRESIGN UPLOAD` 获取 URL，如果禁用 PRESIGN，则使用 `v1/upload_to_stage` API。                                                                                                                                                                                                                                                                                                                                                                                                   |
| 从内部 Stage 下载文件 | `Connection.downloadStream`                                                                                                                                          | 将使用 `PRESIGN DOWNLOAD` 从 Stage 下载数据以获取 URL。                                                                                                                                                                                                                                                                                   |

## 配置连接字符串

一旦驱动程序安装并集成到您的项目中，您可以使用以下 JDBC 连接字符串格式连接到 Databend：

```java
jdbc:databend://<username>:<password>@<host_port>/<database>?<connection_params>
```

`connection_params` 指的是一个或多个格式为 `param=value` 的参数系列。 每个参数应以 & 符号分隔，并且连接字符串中的任何位置都不应有空格。 这些参数可以在连接字符串中设置，也可以在传递给 DriverManager.getConnection() 方法的 Properties 对象中设置。 例如：

```java
Properties props = new Properties();
props.put("parameter1", parameter1Value);
props.put("parameter2", parameter2Value);
Connection con = DriverManager.getConnection("jdbc:databend://user:pass@host/database", props);
```

有关可用连接参数及其说明，请参阅 https://github.com/databendcloud/databend-jdbc/blob/main/docs/Connection.md#connection-parameters

## 示例

### 示例：创建数据库和表

```java
package com.example;

import java.sql.*;
import java.util.Properties;

public class Main {
    // 连接到本地 Databend，SQL 用户名为“user1”，密码为“abc123”作为示例。
    // 请随意使用您自己的值，同时保持相同的格式。
    static final String DB_URL = "jdbc:databend://127.0.0.1:8000";

    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("user", "user1");
        properties.setProperty("password", "abc123");
        properties.setProperty("SSL", "false");

        Connection conn = DriverManager.getConnection(DB_URL, properties);

        Statement stmt = conn.createStatement();
        String create_sql = "CREATE DATABASE IF NOT EXISTS book_db";
        stmt.execute(create_sql);

        String use_sql = "USE book_db";
        stmt.execute(use_sql);

        String ct_sql = "CREATE TABLE IF NOT EXISTS books(title VARCHAR, author VARCHAR, date VARCHAR)";
        stmt.execute(ct_sql);
        stmt.close();
        conn.close();
        System.exit(0);
    }
}
```

### 示例：复制到或合并到表中


```java
    public void copyInto(String tableName, List<String> files) throws Exception {
        String filesStr = "'" + String.join("','", files) + "'";
        String copyIntoSql = String.format("copy into %s from @~ files=(%s) file_format=(type=NDJSON) purge=true;", tableName, filesStr);
        Connection connection = createConnection();
        try (Statement statement = connection.createStatement()) {
            Instant copyIntoStart = Instant.now();
            statement.execute(copyIntoSql);
            ResultSet r = statement.getResultSet();
            while (r.next()) {
            }
            Instant copyIntoEnd = Instant.now();
            System.out.println("Copied files into: " + files.size() + " , time elapsed: " + (copyIntoEnd.toEpochMilli() - copyIntoStart.toEpochMilli()) + "ms");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            connection.close();
        }
    }
// For merge into just replace the copyIntoSql.
```

:::tip

1. 因为像 SELECT, COPY INTO, 和 MERGE INTO 这样的 SQL 命令会返回一个 ResultSet 对象，所以在访问数据之前必须调用 rs.next()。否则可能导致查询被取消。如果你不打算检索结果，你可以使用 while 循环 (while (r.next()){}) 遍历 ResultSet 以避免这个问题。
2. 对于其他 SQL 命令，如 CREATE TABLE 或 DROP TABLE，它们是非查询类型的 SQL，你可以直接调用 statement.execute()。
   :::

### 示例：批量插入

在你的 Java 应用程序代码中，你可以通过在 INSERT 语句中绑定参数并调用 addBatch() 和 executeBatch()，在单个批处理中插入多行。

例如，以下代码将两行插入到一个包含 INT 列和 VARCHAR 列的表中。该示例将值绑定到 INSERT 语句中的参数，并调用 addBatch() 和 executeBatch() 来执行批量插入。

```java
Connection connection = DriverManager.getConnection(url, prop);

PreparedStatement pstmt = connection.prepareStatement("INSERT INTO t(c1, c2) VALUES(?, ?)");
pstmt.setInt(1, 101);
pstmt.setString(2, "test1");
pstmt.addBatch();

pstmt.setInt(1, 102);
pstmt.setString(2, "test2");
pstmt.addBatch();

int[] count = pstmt.executeBatch(); // After execution, count[0]=1, count[1]=1
...
pstmt.close();
```

### 示例：上传文件到内部 Stage

```java
 /**
     * Upload inputStream to the databend internal stage, the data would be uploaded as one file with no split.
     * Caller should close the input stream after the upload is done.
     *
     * @param stageName the stage which receive uploaded file
     * @param destPrefix the prefix of the file name in the stage
     * @param inputStream the input stream of the file
     * @param destFileName the destination file name in the stage
     * @param fileSize the file size in the stage
     * @param compressData whether to compress the data
     * @throws SQLException failed to upload input stream
     */
    public void uploadStream(String stageName, String destPrefix, InputStream inputStream, String destFileName, long fileSize, boolean compressData) throws SQLException;
```

上传 CSV 文件到 Databend:

```java
        File f = new File("test.csv");
        try (InputStream fileInputStream = Files.newInputStream(f.toPath())) {
            Logger.getLogger(OkHttpClient.class.getName()).setLevel(Level.ALL);
            Connection connection = createConnection();
            String stageName = "test_stage";
            DatabendConnection databendConnection = connection.unwrap(DatabendConnection.class);
            PresignContext.createStageIfNotExists(databendConnection, stageName);
            databendConnection.uploadStream(stageName, "jdbc/test/", fileInputStream, "test.csv", f.length(), false);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            f.delete();
        }
```

### 示例：从内部 Stage 下载文件

```java
 /**
     * Download a file from the databend internal stage, the data would be downloaded as one file with no split.
     *
     * @param stageName the stage which contains the file
     * @param sourceFileName the file name in the stage
     * @param decompress whether to decompress the data
     * @return the input stream of the file
     * @throws SQLException
     */
    public InputStream downloadStream(String stageName, String sourceFileName, boolean decompress) throws SQLException;
```

从 Databend 下载 CSV 文件:

```Java
        File f = new File("test.csv");
        try (InputStream fileInputStream = Files.newInputStream(f.toPath())) {
            Logger.getLogger(OkHttpClient.class.getName()).setLevel(Level.ALL);
            Connection connection = createConnection(true);
            String stageName = "test_stage";
            DatabendConnection databendConnection = connection.unwrap(DatabendConnection.class);
            PresignContext.createStageIfNotExists(databendConnection, stageName);
            databendConnection.uploadStream(stageName, "jdbc/test/", fileInputStream, "test.csv", f.length(), false);
            InputStream downloaded = databendConnection.downloadStream(stageName, "jdbc/test/test.csv", false);
            byte[] arr = streamToByteArray(downloaded);
            System.out.println(arr);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            f.delete();
        }
```

### 示例：与 Databend Cloud 集成

在开始之前，请确保您已成功创建计算集群并获取连接信息。有关如何操作，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

#### 步骤 1. 使用 Maven 添加依赖项

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.8</version>
</dependency>
```

#### 步骤 2. 使用 databend-jdbc 连接

创建一个名为 `sample.java` 的文件，其中包含以下代码：

```java
package databend_cloud;

import java.sql.*;
import java.util.Properties;

public class sample {
    public static void main(String[] args) throws Exception {

        String url = "jdbc:databend://{WAREHOUSE_HOST}:443/{DATABASE}";
        Properties properties = new Properties();
        properties.setProperty("user", "{USER}");
        properties.setProperty("password", "{PASSWORD}");
        properties.setProperty("SSL", "true");
        Connection connection = DriverManager.getConnection(url, properties);

        // Execute
        connection.createStatement().execute("CREATE TABLE IF NOT EXISTS sample_test(id TINYINT, obj VARIANT, d TIMESTAMP, s String, arr ARRAY(INT64)) Engine = Fuse");

        // SELECT
        Statement statement = connection.createStatement();
        statement.execute("SELECT number from numbers(200000) order by number");
        ResultSet r = statement.getResultSet();
        r.next();
        for (int i = 1; i < 1000; i++) {
            r.next();
            System.out.println(r.getInt(1));
        }

        // INSERT INTO Using executeBatch()
        connection.setAutoCommit(false);
        PreparedStatement ps = connection.prepareStatement("insert into sample_test values");
        ps.setInt(1, 1);
        ps.setString(2, "{\"a\": 1,\"b\": 2}");
        ps.setTimestamp(3, Timestamp.valueOf("1983-07-12 21:30:55.888"));
        ps.setString(4, "hello world, 你好");
        ps.setString(5, "[1,2,3,4,5]");
        ps.addBatch();
        int[] ans = ps.executeBatch();
        Statement s = connection.createStatement();

        System.out.println("execute select on table");
        statement.execute("SELECT * from sample_test");
        ResultSet r2 = statement.getResultSet();

        while (r2.next()) {
            System.out.println(r2.getInt(1));
            System.out.println(r2.getString(2));
            System.out.println(r2.getTimestamp(3).toString());
            System.out.println(r2.getString(4));
            System.out.println(r2.getString(5));
        }
        connection.close();
    }
}
```

:::tip
将代码中的 `{USER}, {PASSWORD}, {WAREHOUSE_HOST}, 和 {DATABASE}` 替换为您的连接信息。有关如何获取连接信息，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

#### 步骤 3. 使用 Maven 运行示例

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```