````
---
title: Java
---

您可以通过为Java编程语言设计的原生接口，使用各种客户端工具和应用程序连接并与Databend进行交互，即[Databend JDBC驱动程序](https://github.com/databendcloud/databend-jdbc)。

## 安装Databend JDBC驱动程序 {#installing-databend-jdbc-driver}

本主题概述了下载和安装Databend JDBC驱动程序以用于基于Java的项目的步骤。驱动程序需要Java LTS（长期支持）版本1.8或更高版本。如果您的客户端机器没有最低要求的Java版本，请安装[Oracle Java](http://www.java.com/en/download/manual.jsp)或[OpenJDK](http://openjdk.java.net)。

下载Databend JDBC驱动程序：

1. 访问Maven Central Repository网址 https://repo1.maven.org/maven2/com/databend/databend-jdbc/
2. 点击最新版本的目录。
3. 下载jar文件，例如*databend-jdbc-0.1.1.jar*。

要验证Databend JDBC驱动程序的版本，例如*databend-jdbc-0.1.1.jar*，在终端运行以下命令：

```bash
java -jar databend-jdbc-0.1.1.jar --version
```

Databend JDBC驱动程序以JAR文件形式提供，可以直接集成到您的基于Java的项目中。或者，您可以在项目的pom.xml文件中声明一个Maven依赖项，如下所示：

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.1.1</version>
</dependency>
```

:::tip 你知道吗？
您也可以通过Databend JDBC驱动程序从DBeaver连接到Databend。更多信息，请参见[通过JDBC连接到Databend](/guides/sql-clients/jdbc)。
:::

## 配置连接字符串 {#configuring-connection-string}

一旦驱动程序安装并集成到您的项目中，您可以使用以下JDBC连接字符串格式连接到Databend：

```java
jdbc:databend://<username>:<password>@<host_port>/<database>?<connection_params>
```

`connection_params`指的是一系列一个或多个参数，格式为`param=value`。每个参数应该用和号(&)分隔，连接字符串中不应该有空格。这些参数可以在连接字符串中设置，也可以在传递给DriverManager.getConnection()方法的Properties对象中设置。例如：

```java 
Properties props = new Properties();
props.put("parameter1", parameter1Value);
props.put("parameter2", parameter2Value);
Connection con = DriverManager.getConnection("jdbc:databend://user:pass@host/database", props);
```
有关可用连接参数及其描述，请参见 https://github.com/databendcloud/databend-jdbc/blob/main/docs/Connection.md#connection-parameters

## 示例 {#examples}

### 示例：创建数据库和表 {#example-creating-a-database-and-table}

```java
package com.example;

import java.sql.*;
import java.util.Properties;

public class demo {
    // 以连接到本地Databend的SQL用户'user1'和密码'abc123'为例。
    // 在保持相同格式的情况下，随意使用您自己的值。
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
```

### 示例：批量插入 {#example-batch-inserting}

在您的Java应用程序代码中，您可以通过在INSERT语句中绑定参数并调用addBatch()和executeBatch()来一次性插入多行。

例如，以下代码将两行插入到包含INT列和VARCHAR列的表中。示例将值绑定到INSERT语句中的参数，并调用addBatch()和executeBatch()来执行批量插入。

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

### 示例：上传文件到内部阶段 {#example-uploading-files-to-an-internal-stage}

```java
 /**
     * 将inputStream上传到databend内部阶段，数据将作为一个文件上传，不会分割。
     * 调用者应在上传完成后关闭输入流。
     *
     * @param stageName 接收上传文件的阶段
     * @param destPrefix 阶段中文件名的前缀
     * @param inputStream 文件的输入流
     * @param destFileName 阶段中的目标文件名
     * @param fileSize 阶段中的文件大小
     * @param compressData 是否压缩数据
     * @throws SQLException 上传输入流失败
     */
    public void uploadStream(String stageName, String destPrefix, InputStream inputStream, String destFileName, long fileSize, boolean compressData) throws SQLException;
```

上传CSV文件到Databend：

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

### 示例：从内部阶段下载文件 {#example-downloading-files-from-an-internal-stage}

```java
 /**
     * 从databend内部阶段下载文件，数据将作为一个文件下载，不会分割。
     *
     * @param stageName 包含文件的阶段
     * @param sourceFileName 阶段中的文件名
     * @param decompress 是否解压数据
     * @return 文件的输入流
     * @throws SQLException
     */
    public InputStream downloadStream(String stageName, String sourceFileName, boolean decompress) throws SQLException;
```

从Databend下载CSV文件：
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

### 示例：与Databend Cloud集成 {#example-integrating-with-databend-cloud}

开始之前，请确保您已成功创建了仓库并获得了连接信息。有关如何做到这一点，请参见[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

#### 步骤1. 使用Maven添加依赖项 {#step-1-add-dependencies-with-maven}

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.0.4</version>
</dependency>
```

#### 步骤2. 使用databend-jdbc连接 {#step-2-connect-with-databend-jdbc}

创建一个名为`sample.java`的文件，包含以下代码：

```java
package databend_cloud;

import java.sql.SQLException;
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
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

        // SELECT
        Statement statement = connection.createStatement();
        statement.execute("SELECT number from numbers(200000) order by number");
        ResultSet r = statement.getResultSet();
        r.next();
        for (int i = 1; i < 1000; i++) {
            r.next();
            System.out.println(r.getInt(1));
        }
        
        // 使用executeBatch()进行INSERT INTO
        connection.setAutoCommit(false);
        PreparedStatement ps = connection.prepareStatement("insert into sample_test values");
        ps.setInt(1, 1);
        ps.setString(2, "{\"a\": 1,\"b\": 2}");
        ps.setTimestamp(3, Timestamp.valueOf("1983-07-12 21:30:55.888"));
        ps.setString(4, "hello world, 你好");
        ps.setString(5, "[1,2,3,4,5]");
        ps.addBatch();
        int[] ans = ps.executeBatch();
        Statement statement = c.createStatement();

        System.out.println("在对象上执行select");
        statement.execute("SELECT * from objects_test1");
        ResultSet r = statement.getResultSet();

        while (r.next()) {
            System.out.println(r.getInt(1));
            System.out.println(r.getString(2));
            System.out.println(r.getTimestamp(3).toString());
            System.out.println(r.getString(4));
            System.out.println(r.getString(5));
        }
        connection.close();
    }
}
```

:::tip
将代码中的{USER}、{PASSWORD}、{WAREHOUSE_HOST}和{DATABASE}替换为您的连接信息。有关如何获取连接信息，请参见[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

#### 步骤3. 使用Maven运行sample {#step-3-run-sample-with-maven}

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```
````