---
title: Java
---

本主题介绍如何使用 [JDBC driver for Databend](https://github.com/databendcloud/databend-jdbc) 建立从 Java 应用程序到 Databend Cloud 的连接。

## 准备工作

在开始之前，请确保您已经成功创建计算集群并获得连接信息。欲了解如何做到这一点，请参见 [连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。

## 第一步：添加 Maven 依赖

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.0.4</version>
</dependency>
```

## 第二步：用 databend-jdbc 建立连接

创建名为 `sample.java` 的文件，并写入像下面这样的代码：

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

        String url = "jdbc:databend://{WAREHOUSE_HOST}:443/{DATABASE}?ssl=true";
        Properties properties = new Properties();
        properties.setProperty("user", "{USER}");
        properties.setProperty("password", "{PASSWORD}");
        properties.setProperty("SSL", "true");
        Connection connection = DriverManager.getConnection(url, properties);

        Statement statement = connection.createStatement();
        statement.execute("SELECT number from numbers(200000) order by number");
        ResultSet r = statement.getResultSet();
        r.next();
        for (int i = 1; i < 1000; i++) {
            r.next();
            System.out.println(r.getInt(1));
        }
        connection.close();
    }
}
```

:::tip
请使用您的连接信息替换代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 。欲要了解如何获取连接信息，请参见 [连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。
:::

## 第三步：通过 Maven 运行 sample

```shell
$ mvn compile
$ mvn exec:java -D exec.mainClass="databend_cloud.sample"
```
