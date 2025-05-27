---
title: Java
---

You can connect to and interact with Databend from various client tools and applications through a native interface designed for Java programming language, the [Databend JDBC driver](https://github.com/databendcloud/databend-jdbc).

## Installing Databend JDBC Driver

This topic outlines the steps to download and install the Databend JDBC driver for use in Java-based projects. The driver requires Java LTS (Long-Term Support) versions 1.8 or higher. If your client machine does not have the minimum required version of Java, install [Oracle Java](http://www.java.com/en/download/manual.jsp) or [OpenJDK](http://openjdk.java.net).

To download the Databend JDBC driver:

1. Go to the Maven Central Repository at https://repo1.maven.org/maven2/com/databend/databend-jdbc/
2. Click on the directory of the latest version.
3. Download the jar file, for example, _databend-jdbc-0.1.1.jar_.

To verify the version of Databend JDBC driver, for example, _databend-jdbc-0.1.1.jar_, run the following command in the terminal:

```bash
java -jar databend-jdbc-0.3.7.jar --version
```

The Databend JDBC driver is provided as a JAR file and can be integrated directly into your Java-based projects. Alternatively, you can declare a Maven dependency in your project's pom.xml file, like so:

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.3.7</version>
</dependency>
```

:::tip DID YOU KNOW?
You can also connect to Databend from DBeaver through the Databend JDBC driver. For more information, see [Connecting to Databend with JDBC](/guides/sql-clients/jdbc).
:::

## Data Type Mappings

This table illustrates the correspondence between Databend data types and their corresponding Java equivalents:

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

## Databend JDBC Driver Behavior Summary

Databend's JDBC Driver generally follows the JDBC specifications. Below is a list of some common basic behaviors, their associated key functions, and the principles behind them.

| Basic Behavior                           | Key Functions                                                                                                                                                        | Principle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Establishing a Connection                | `DriverManager.getConnection`, `Properties.setProperty`                                                                                                              | `getConnection` establishes a connection with Databend using the provided connection string.<br /><br />The `Properties` object is used to construct connection parameters, such as `user` and `password`, which can also be specified within the connection string.                                                                                                                                                                                                                                                                                           |
| Executing Queries                        | `Statement.createStatement()`, `Statement.execute()`                                                                                                                 | `Statement.execute()` performs queries using the `v1/query` interface.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Batch Inserting                          | `Connection.prepareStatement()`, `PrepareStatement.setInt()`, `PrepareStatement.setString()`, `PrepareStatement.addBatch()`, `PrepareStatement.executeBatch()`, etc. | Databend supports batch insertions and replacements (`INSERT INTO` and `REPLACE INTO`) using `PrepareStatement` objects.<br /><br />The `PrepareStatement.setXXX()` methods are used for binding values to the parameters of the statement.<br /><br />`PrepareStatement.addBatch()` adds as much data as possible to the batch for the created statement object.<br /><br />`PrepareStatement.executeBatch()` uploads data to the built-in Stage and executes insert/replace operations, utilizing [Stage Attachment](/developer/apis/http#stage-attachment). |
| Uploading Files to an Internal Stage     | `Connection.uploadStream`                                                                                                                                            | Data will be uploaded to a Stage. By default, the `PRESIGN UPLOAD` is used to obtain a URL, or if PRESIGN is disabled, the `v1/upload_to_stage` API is used.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Downloading Files from an Internal Stage | `Connection.downloadStream`                                                                                                                                          | Data will be downloaded from a Stage using the `PRESIGN DOWNLOAD` to obtain a URL.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Configuring Connection String

Once the driver is installed and integrated into your project , you can use it to connect to Databend using the following JDBC connection string format:

```java
jdbc:databend://<username>:<password>@<host_port>/<database>?<connection_params>
```

The `connection_params` refers to a series of one or more parameters in the format of `param=value`. Each parameter should be separated by the ampersand character (&), and there should be no spaces anywhere in the connection string. These parameters can be set either in the connection string or in a Properties object passed to the DriverManager.getConnection() method. For example:

```java
Properties props = new Properties();
props.put("parameter1", parameter1Value);
props.put("parameter2", parameter2Value);
Connection con = DriverManager.getConnection("jdbc:databend://user:pass@host/database", props);
```

For the available connection parameters and their descriptions, see https://github.com/databendcloud/databend-jdbc/blob/main/docs/Connection.md#connection-parameters

## Examples

### Example: Creating a Database and Table

```java
package com.example;

import java.sql.*;
import java.util.Properties;

public class Main {
    // Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
    // Feel free to use your own values while maintaining the same format.
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

### Example: Copy into or merge into table

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

1. Because the SQL commands such as SELECT, COPY INTO, and MERGE INTO return a ResultSet object, it is necessary to call rs.next() before accessing the data. Failure to do so may result in the query being canceled. If you don't intend to retrieve the results, you can iterate over the ResultSet using a while loop (while (r.next()){}) to avoid this issue.
2. For other SQL commands such as CREATE TABLE or DROP TABLE, which are non-query type SQL, you can call statement.execute() directly.
   :::

### Example: Batch Inserting

In your Java application code, you can insert multiple rows in a single batch by binding parameters in an INSERT statement and calling addBatch() and executeBatch().

As an example, the following code inserts two rows into a table that contains an INT column and a VARCHAR column. The example binds values to the parameters in the INSERT statement and calls addBatch() and executeBatch() to perform a batch insert.

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

### Example: Batch Update
You can update multiple rows in a single batch binding parameters in an REPLACE INTO statement and calling addBatch() and executeBatch().

As an example, the following code update the rows which have conflict values in field `a`. The example binds values to the parameters in the REPLACE INTO statement and calls addBatch() and executeBatch() to perform a batch update according to the key field.
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
Databend does not support `executeBatch()` in UPDATE statement. If you want to do batch update, please use REPLACE INTO.
:::

### Example: Uploading Files to an Internal Stage

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

Uploading CSV File to Databend:

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

### Example: Downloading Files from an Internal Stage

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

Downloading CSV File from Databend:

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

### Example: Integrating with Databend Cloud

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

#### Step 1. Add Dependencies with Maven

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.8</version>
</dependency>
```

#### Step 2. Connect with databend-jdbc

Create a file named `sample.java` with the following code:

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
Replace `{USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE}` in the code with your connection information. For how to obtain the connection information, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).
:::

#### Step 3. Run sample with Maven

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```
