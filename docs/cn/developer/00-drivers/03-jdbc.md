---
title: Java
---

您可以通过专为 Java 编程语言设计的原生接口 [Databend JDBC driver](https://github.com/databendcloud/databend-jdbc) 从各种客户端工具和应用程序连接到 Databend 并与之交互。

## 安装 Databend JDBC Driver

本主题概述了下载和安装 Databend JDBC driver 以在基于 Java 的项目中使用的步骤。该驱动程序需要 Java LTS (长期支持) 版本 1.8 或更高版本。如果您的客户端机器没有所需的最低 Java 版本，请安装 [Oracle Java](http://www.java.com/en/download/manual.jsp) 或 [OpenJDK](http://openjdk.java.net)。

要下载 Databend JDBC driver：

1. 访问 Maven Central Repository：https://repo1.maven.org/maven2/com/databend/databend-jdbc/
2. 点击最新版本的目录。
3. 下载 jar 文件，例如 _databend-jdbc-0.1.1.jar_。

要验证 Databend JDBC driver 的版本，例如 _databend-jdbc-0.1.1.jar_，请在终端中运行以下命令：

```bash
java -jar databend-jdbc-0.3.7.jar --version
```

Databend JDBC driver 以 JAR 文件的形式提供，可以直接集成到您的基于 Java 的项目中。或者，您可以在项目的 pom.xml 文件中声明 Maven 依赖项，如下所示：

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.3.7</version>
</dependency>
```

:::tip DID YOU KNOW?
您还可以通过 Databend JDBC driver 从 DBeaver 连接到 Databend。更多信息请参见 [使用 JDBC 连接到 Databend](/guides/sql-clients/jdbc)。
:::

## 数据类型映射

此表说明了 Databend 数据类型与其对应的 Java 等效类型之间的对应关系：

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

## Databend JDBC Driver 行为摘要

Databend 的 JDBC Driver 通常遵循 JDBC 规范。以下是一些常见基本行为、其相关关键功能以及背后原理的列表。

| 基本行为                           | 关键函数                                                                                                                                                        | 原理                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 建立连接                | `DriverManager.getConnection`, `Properties.setProperty`                                                                                                              | `getConnection` 使用提供的连接字符串与 Databend 建立连接。<br /><br />`Properties` 对象用于构造连接参数，如 `user` 和 `password`，这些参数也可以在连接字符串中指定。                                                                                                                                                                                                                                                                                                                                                                           |
| 执行查询                        | `Statement.createStatement()`, `Statement.execute()`                                                                                                                 | `Statement.execute()` 使用 `v1/query` 接口执行查询。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 批量插入                          | `Connection.prepareStatement()`, `PrepareStatement.setInt()`, `PrepareStatement.setString()`, `PrepareStatement.addBatch()`, `PrepareStatement.executeBatch()`, etc. | Databend 支持使用 `PrepareStatement` 对象进行批量插入和替换 (`INSERT INTO` 和 `REPLACE INTO`)。<br /><br />`PrepareStatement.setXXX()` 方法用于将值绑定到语句的参数。<br /><br />`PrepareStatement.addBatch()` 为创建的语句对象向批次中添加尽可能多的数据。<br /><br />`PrepareStatement.executeBatch()` 将数据上传到内置 Stage 并执行插入/替换操作，利用 [Stage Attachment](/developer/apis/http#stage-attachment)。 |
| 上传文件到内部 Stage     | `Connection.uploadStream`                                                                                                                                            | 数据将上传到 Stage。默认情况下，使用 `PRESIGN UPLOAD` 获取 URL，或者如果禁用了 PRESIGN，则使用 `v1/upload_to_stage` API。                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 从内部 Stage 下载文件 | `Connection.downloadStream`                                                                                                                                          | 数据将使用 `PRESIGN DOWNLOAD` 从 Stage 下载以获取 URL。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 配置连接字符串

一旦驱动程序安装并集成到您的项目中，您就可以使用以下 JDBC 连接字符串格式连接到 Databend：

```java
jdbc:databend://<username>:<password>@<host_port>/<database>?<connection_params>
```

`connection_params` 指的是一系列一个或多个格式为 `param=value` 的参数。每个参数应该用 & 符号分隔，连接字符串中不应有任何空格。这些参数可以在连接字符串中设置，也可以在传递给 DriverManager.getConnection() 方法的 Properties 对象中设置。例如：

```java
Properties props = new Properties();
props.put("parameter1", parameter1Value);
props.put("parameter2", parameter2Value);
Connection con = DriverManager.getConnection("jdbc:databend://user:pass@host/database", props);
```

有关可用连接参数及其描述，请参见 https://github.com/databendcloud/databend-jdbc/blob/main/docs/Connection.md#connection-parameters

## 示例

### 示例：创建数据库和表

```java
package com.example;

import java.sql.*;
import java.util.Properties;

public class Main {
    // 以连接到本地 Databend 并使用名为 'user1' 密码为 'abc123' 的 SQL 用户为例。
    // 请随意使用您自己的值，但保持相同的格式。
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

### 示例：Copy into 或 merge into 表

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
// 对于 merge into，只需替换 copyIntoSql 即可。
```

:::tip

1. 由于 SELECT、COPY INTO 和 MERGE INTO 等 SQL 命令会返回 ResultSet 对象，因此在访问数据之前必须调用 rs.next()。否则可能导致查询被取消。如果您不打算检索结果，可以使用 while 循环 (while (r.next())){}) 遍历 ResultSet 来避免此问题。
2. 对于其他 SQL 命令，如 CREATE TABLE 或 DROP TABLE，这些是非查询类型的 SQL，您可以直接调用 statement.execute()。
   :::

### 示例：批量插入

在您的 Java 应用程序代码中，您可以通过在 INSERT 语句中绑定参数并调用 addBatch() 和 executeBatch() 来在单个批次中插入多行。

例如，以下代码向包含一个 INT 列和一个 VARCHAR 列的表中插入两行。该示例将值绑定到 INSERT 语句中的参数，并调用 addBatch() 和 executeBatch() 来执行批量插入。

```java
Connection connection = DriverManager.getConnection(url, prop);

PreparedStatement pstmt = connection.prepareStatement("INSERT INTO t(c1, c2) VALUES(?, ?)");
pstmt.setInt(1, 101);
pstmt.setString(2, "test1");
pstmt.addBatch();

pstmt.setInt(1, 102);
pstmt.setString(2, "test2");
pstmt.addBatch();

int[] count = pstmt.executeBatch(); // 执行后，count[0]=1, count[1]=1
...
pstmt.close();
```

### 示例：批量更新
您可以通过在 REPLACE INTO 语句中绑定参数并调用 addBatch() 和 executeBatch() 来在单个批次中更新多行。

例如，以下代码更新在字段 `a` 中具有冲突值的行。该示例将值绑定到 REPLACE INTO 语句中的参数，并调用 addBatch() 和 executeBatch() 来根据键字段执行批量更新。
```java
Connection c = Utils.createConnection();
c.setAutoCommit(false);
PreparedStatement ps1 = c.prepareStatement("insert into test_prepare_statement values");
ps1.setInt(1, 1);
ps1.setInt(2, 2);
ps1.addBatch();
ps1.executeBatch();

PreparedStatement ps = c.prepareStatement("replace into test_prepare_statement on(a) values");
ps.setInt(1, 1);
ps.setString(2, "a");
ps.addBatch();
ps.setInt(1, 3);
ps.setString(2, "b");
ps.addBatch();
System.out.println("execute batch replace into");
int[] ans = ps.executeBatch();
...
```

:::tip
Databend 不支持在 UPDATE 语句中使用 `executeBatch()`。如果您想进行批量更新，请使用 REPLACE INTO。
:::

### 示例：上传文件到内部 Stage

```java
 /**
     * 将 inputStream 上传到 databend 内部 stage，数据将作为一个文件上传，不会分割。
     * 调用者应在上传完成后关闭输入流。
     *
     * @param stageName 接收上传文件的 stage
     * @param destPrefix stage 中文件名的前缀
     * @param inputStream 文件的输入流
     * @param destFileName stage 中的目标文件名
     * @param fileSize stage 中的文件大小
     * @param compressData 是否压缩数据
     * @throws SQLException 上传输入流失败
     */
    public void uploadStream(String stageName, String destPrefix, InputStream inputStream, String destFileName, long fileSize, boolean compressData) throws SQLException;
```

上传 CSV 文件到 Databend：

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
     * 从 databend 内部 stage 下载文件，数据将作为一个文件下载，不会分割。
     *
     * @param stageName 包含文件的 stage
     * @param sourceFileName stage 中的文件名
     * @param decompress 是否解压数据
     * @return 文件的输入流
     * @throws SQLException
     */
    public InputStream downloadStream(String stageName, String sourceFileName, boolean decompress) throws SQLException;
```

从 Databend 下载 CSV 文件：

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

开始之前，请确保您已成功创建计算集群并获得连接信息。有关如何操作，请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

#### 步骤 1. 使用 Maven 添加依赖

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.8</version>
</dependency>
```

#### 步骤 2. 使用 databend-jdbc 连接

创建一个名为 `sample.java` 的文件，包含以下代码：

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

```java
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
将代码中的 `{USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE}` 替换为您的连接信息。有关如何获取连接信息，请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

#### 步骤 3. 使用 Maven 运行示例

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```