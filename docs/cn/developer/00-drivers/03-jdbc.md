---
title: Java
---

您可以通过为Java编程语言设计的原生接口，即[Databend JDBC驱动](https://github.com/databendcloud/databend-jdbc)，从各种客户端工具和应用程序连接并与Databend进行交互。

## 安装Databend JDBC驱动

本主题概述了下载和安装Databend JDBC驱动以用于基于Java的项目的步骤。该驱动要求Java LTS（长期支持）版本1.8或更高。如果您的客户端机器没有最低要求的Java版本，请安装[Oracle Java](http://www.java.com/en/download/manual.jsp)或[OpenJDK](http://openjdk.java.net)。

要下载Databend JDBC驱动：

1. 访问Maven中央仓库：https://repo1.maven.org/maven2/com/databend/databend-jdbc/
2. 点击最新版本的目录。
3. 下载jar文件，例如_databend-jdbc-0.1.1.jar_。

要验证Databend JDBC驱动的版本，例如_databend-jdbc-0.1.1.jar_，请在终端中运行以下命令：

```bash
java -jar databend-jdbc-0.2.1.jar --version
```

Databend JDBC驱动以JAR文件形式提供，可以直接集成到您的基于Java的项目中。或者，您可以在项目的pom.xml文件中声明Maven依赖，如下所示：

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.1</version>
</dependency>
```

:::tip 你知道吗？
您还可以通过Databend JDBC驱动从DBeaver连接到Databend。更多信息，请参见[使用JDBC连接Databend](/guides/sql-clients/jdbc)。
:::

## 数据类型映射

下表展示了Databend数据类型与其对应的Java等效类型之间的对应关系：

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

## Databend JDBC驱动行为摘要

Databend的JDBC驱动通常遵循JDBC规范。以下是一些常见基本行为、其关联的关键功能及其背后的原则列表。

| 基本行为                           | 关键函数                                                                                                                                                        | 原理                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 建立连接                | `DriverManager.getConnection`, `Properties.setProperty`                                                                                                              | `getConnection` 使用提供的连接字符串与 Databend 建立连接。<br /><br />`Properties` 对象用于构建连接参数，例如 `user` 和 `password`，这些参数也可以在连接字符串中指定。                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 执行查询                        | `Statement.createStatement()`, `Statement.execute()`                                                                                                                 | `Statement.execute()` 使用 `v1/query` 接口执行查询。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 批量插入                          | `Connection.prepareStatement()`, `PrepareStatement.setInt()`, `PrepareStatement.setString()`, `PrepareStatement.addBatch()`, `PrepareStatement.executeBatch()`, 等. | Databend 支持使用 `PrepareStatement` 对象进行批量插入和替换（`INSERT INTO` 和 `REPLACE INTO`）。<br /><br />`PrepareStatement.setXXX()` 方法用于将值绑定到语句的参数。<br /><br />`PrepareStatement.addBatch()` 将尽可能多的数据添加到创建的语句对象的批次中。<br /><br />`PrepareStatement.executeBatch()` 将数据上传到内置的 Stage 并执行插入/替换操作，利用 [Stage Attachment](/developer/apis/http#stage-attachment)。 |
| 上传文件到内部 Stage     | `Connection.uploadStream`                                                                                                                                            | 数据将被上传到 Stage。默认情况下，使用 `PRESIGN UPLOAD` 获取 URL，如果禁用了 PRESIGN，则使用 `v1/upload_to_stage` API。                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 从内部 Stage 下载文件 | `Connection.downloadStream`                                                                                                                                          | 数据将从 Stage 下载，使用 `PRESIGN DOWNLOAD` 获取 URL。                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## 配置连接字符串

一旦驱动程序安装并集成到您的项目中，您可以使用以下 JDBC 连接字符串格式连接到 Databend：

```java
jdbc:databend://<username>:<password>@<host_port>/<database>?<connection_params>
```

`connection_params` 指的是一系列一个或多个参数，格式为 `param=value`。每个参数应使用 & 字符分隔，连接字符串中不应有任何空格。这些参数可以在连接字符串中设置，也可以在传递给 `DriverManager.getConnection()` 方法的 `Properties` 对象中设置。例如：

```java
Properties props = new Properties();
props.put("parameter1", parameter1Value);
props.put("parameter2", parameter2Value);
Connection con = DriverManager.getConnection("jdbc:databend://user:pass@host/database", props);
```

有关可用的连接参数及其描述，请参见 https://github.com/databendcloud/databend-jdbc/blob/main/docs/Connection.md#connection-parameters

## 示例

### 示例：创建数据库和表

```java
package com.example;

import java.sql.*;
import java.util.Properties;

public class Main {
    // 以连接到本地 Databend 为例，使用 SQL 用户名为 'user1' 和密码 'abc123'。
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

### 示例：复制或合并到表中

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
// 对于 merge into，只需替换 copyIntoSql。
```

:::tip

1. 由于 SELECT、COPY INTO 和 MERGE INTO 等 SQL 命令返回一个 ResultSet 对象，因此在访问数据之前需要调用 rs.next()。如果不这样做，可能会导致查询被取消。如果你不打算检索结果，可以使用 while 循环（while (r.next()){}）来遍历 ResultSet，以避免此问题。
2. 对于其他非查询类型的 SQL 命令，如 CREATE TABLE 或 DROP TABLE，你可以直接调用 statement.execute()。
   :::

### 示例：批量插入

在你的 Java 应用程序代码中，你可以通过在 INSERT 语句中绑定参数并调用 addBatch() 和 executeBatch() 来一次性插入多行数据。

例如，以下代码将两行数据插入到一个包含 INT 列和 VARCHAR 列的表中。该示例将值绑定到 INSERT 语句中的参数，并调用 addBatch() 和 executeBatch() 来执行批量插入。

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

### 示例：上传文件到内部 Stage

```java
 /**
     * 将 inputStream 上传到 databend 内部 stage，数据将作为一个文件上传，不会拆分。
     * 调用者应在上传完成后关闭输入流。
     *
     * @param stageName 接收上传文件的 stage
     * @param destPrefix 文件名在 stage 中的前缀
     * @param inputStream 文件的输入流
     * @param destFileName 文件在 stage 中的目标文件名
     * @param fileSize 文件大小
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
     * 从 databend 内部 stage 下载文件，数据将作为一个文件下载，不会拆分。
     *
     * @param stageName 包含文件的 stage
     * @param sourceFileName 文件在 stage 中的名称
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

在开始之前，请确保你已成功创建计算集群并获取连接信息。有关如何操作，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

#### 第一步：使用 Maven 添加依赖

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.8</version>
</dependency>
```

#### 第二步：使用 databend-jdbc 连接

创建一个名为 `sample.java` 的文件，内容如下：

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

        // 执行
        connection.createStatement().execute("CREATE TABLE IF NOT EXISTS sample_test(id TINYINT, obj VARIANT, d TIMESTAMP, s String, arr ARRAY(INT64)) Engine = Fuse");

        // 查询
        Statement statement = connection.createStatement();
        statement.execute("SELECT number from numbers(200000) order by number");
        ResultSet r = statement.getResultSet();
        r.next();
        for (int i = 1; i < 1000; i++) {
            r.next();
            System.out.println(r.getInt(1));
        }

        // 使用 executeBatch() 插入数据
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
将代码中的 `{USER}, {PASSWORD}, {WAREHOUSE_HOST}, 和 {DATABASE}` 替换为你的连接信息。有关如何获取连接信息，请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

#### 第三步：使用 Maven 运行示例

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```