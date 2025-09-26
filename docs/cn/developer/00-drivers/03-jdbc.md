---
title: Java (JDBC)
---

# Databend Java JDBC 驱动

官方 JDBC 驱动，提供标准 JDBC 4.0 兼容性，可与 Java 应用程序无缝集成。

## 安装

### Maven

```xml
<dependency>
    <groupId>com.databend</groupId>
    <artifactId>databend-jdbc</artifactId>
    <version>0.3.7</version>
</dependency>
```

### Gradle

```gradle
implementation 'com.databend:databend-jdbc:0.3.7'
```

**连接字符串**：关于 DSN 格式和连接示例，请参见 [驱动程序概述](./index.md#connection-string-dsn)。

---

## 主要特性

- ✅ **兼容 JDBC 4.0**：支持标准 JDBC 接口
- ✅ **连接池**：内置连接管理
- ✅ **预处理语句**：高效的参数化查询
- ✅ **批量操作**：支持批量插入和更新

## 数据类型映射

| Databend | Java | 备注 |
|----------|------|---------|
| **整数** | | |
| `TINYINT` | `Byte` | |
| `SMALLINT` | `Short` | |
| `INT` | `Integer` | |
| `BIGINT` | `Long` | |
| `TINYINT UNSIGNED` | `Short` | |
| `SMALLINT UNSIGNED` | `Integer` | |
| `INT UNSIGNED` | `Long` | |
| `BIGINT UNSIGNED` | `BigInteger` | |
| **浮点数** | | |
| `FLOAT` | `Float` | |
| `DOUBLE` | `Double` | |
| `DECIMAL` | `BigDecimal` | 保留精度 |
| **其他类型** | | |
| `BOOLEAN` | `Boolean` | |
| `STRING` | `String` | |
| `DATE` | `Date` | |
| `TIMESTAMP` | `Timestamp` | |
| `ARRAY(T)` | `String` | JSON 编码 |
| `TUPLE(...)` | `String` | JSON 编码 |
| `MAP(K,V)` | `String` | JSON 编码 |
| `VARIANT` | `String` | JSON 编码 |
| `BITMAP` | `String` | Base64 编码 |

---

## 基本用法

```java
import java.sql.*;

// 连接到 Databend
Connection conn = DriverManager.getConnection("<your-dsn>");

// DDL：创建表
Statement stmt = conn.createStatement();
stmt.execute("CREATE TABLE users (id INT, name STRING, email STRING)");

// 写入：插入数据
PreparedStatement pstmt = conn.prepareStatement("INSERT INTO users VALUES (?, ?, ?)");
pstmt.setInt(1, 1);
pstmt.setString(2, "Alice");
pstmt.setString(3, "alice@example.com");
int result = pstmt.executeUpdate();

// 写入：使用 executeBatch 插入数据
pstmt = conn.prepareStatement("INSERT INTO users VALUES (?, ?, ?)");
pstmt.setInt(1, 2);
pstmt.setString(2, "Bob");
pstmt.setString(3, "Bob@example.com");
pstmt.addBatch();
pstmt.setInt(1, 3);
pstmt.setString(2, "John");
pstmt.setString(3, "John@example.com");
pstmt.addBatch();
int[] results = pstmt.executeBatch();

// 查询：选择数据
ResultSet rs = stmt.executeQuery("SELECT id, name, email FROM users WHERE id = 1");
while (rs.next()) {
    System.out.println("User: " + rs.getInt("id") + ", " + 
                      rs.getString("name") + ", " + 
                      rs.getString("email"));
}

// 关闭连接
rs.close();
stmt.close();
pstmt.close();
conn.close();
```

## 配置参考

关于 databend-jdbc 驱动程序的完整配置选项，包括：
- 连接字符串参数
- SSL/TLS 配置
- 身份验证方法
- 性能调优参数

请参阅 [官方 databend-jdbc 连接指南](https://github.com/databendlabs/databend-jdbc/blob/main/docs/Connection.md)。

## 资源

- **Maven Central**：[databend-jdbc](https://repo1.maven.org/maven2/com/databend/databend-jdbc/)
- **GitHub 仓库**：[databend-jdbc](https://github.com/databendlabs/databend-jdbc)
- **JDBC 文档**：[Oracle JDBC 指南](https://docs.oracle.com/javase/tutorial/jdbc/)