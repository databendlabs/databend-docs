```java
try (Connection conn = DriverManager.getConnection(DB_URL, properties)) {
    uploadStream("my_stage", "my_prefix", new FileInputStream("path/to/your/file.csv"), "file.csv", new File("path/to/your/file.csv").length(), false);
}
```

### Example: Downloading Files from an Internal Stage

```java
/**
 * Download file from the databend internal stage to the output stream.
 * Caller should close the output stream after the download is done.
 *
 * @param stageName the stage which contains the file to be downloaded
 * @param fileName the file name in the stage
 * @param outputStream the output stream to receive the file
 * @throws SQLException failed to download input stream
 */
public void downloadStream(String stageName, String fileName, OutputStream outputStream) throws SQLException;
```

Downloading CSV File from Databend:

```java
try (Connection conn = DriverManager.getConnection(DB_URL, properties);
     FileOutputStream fos = new FileOutputStream("path/to/save/file.csv")) {
    downloadStream("my_stage", "file.csv", fos);
}
```

## Troubleshooting

If you encounter any issues while using the Databend JDBC driver, consider the following troubleshooting steps:

1. **Check Java Version**: Ensure that your Java version is compatible with the Databend JDBC driver. The driver requires Java LTS versions 1.8 or higher.

2. **Verify Driver Installation**: Confirm that the driver is correctly installed and accessible from your project. If you are using Maven, ensure that the dependency is correctly declared in your `pom.xml`.

3. **Inspect Connection String**: Review the JDBC connection string for any errors or missing parameters. Ensure that all necessary parameters are correctly formatted and included.

4. **Debugging**: Enable debugging by setting the `debug` parameter in the connection string or Properties object to `true`. This can help you identify any issues with the driver's behavior.

5. **Review Logs**: Check the logs for any error messages or warnings that might indicate the cause of the problem.

6. **Consult Documentation**: Refer to the official documentation for the Databend JDBC driver for guidance on common issues and their solutions.

7. **Community Support**: If you are unable to resolve the issue, consider reaching out to the Databend community for support. You can find community resources and contact information on the [Databend website](https://www.databend.com).

By following these steps, you should be able to diagnose and resolve most issues related to the Databend JDBC driver. If you continue to experience problems, don't hesitate to seek further assistance from the community or support channels.

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

### 示例：从内部阶段下载文件

```java
 /**
     * 从Databend内部阶段下载文件，数据将作为单个文件下载，无需分割。
     *
     * @param stageName 包含文件的阶段名称
     * @param sourceFileName 阶段中的文件名
     * @param decompress 是否解压缩数据
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

### 示例：与Databend云集成

开始之前，请确保您已成功创建仓库并获取连接信息。关于如何操作，请参阅[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

#### 步骤1. 使用Maven添加依赖

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.2.1</version>
</dependency>
```

#### 步骤2. 使用databend-jdbc连接

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
        
        // INSERT INTO 使用executeBatch()
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

        System.out.println("执行对象上的选择");
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
在代码中替换{USER}, {PASSWORD}, {WAREHOUSE_HOST}, 和 {DATABASE}为您的连接信息。关于如何获取连接信息，请参阅[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

#### 步骤3. 使用Maven运行示例

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```