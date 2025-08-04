---
title: Java (JDBC)
---

# 用于 Databend 的 Java JDBC 驱动

官方 JDBC 驱动，提供标准 JDBC 4.0 兼容性，可与 Java 应用无缝集成。

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

**连接字符串**：有关 DSN 格式和连接示例，请参见 [驱动概览](./index.md#connection-string-dsn)。

---

## 主要特性

- ✅ **兼容 JDBC 4.0**：支持标准 JDBC 接口
- ✅ **连接池**：内置连接管理
- ✅ **预处理语句**：高效参数化查询
- ✅ **批量操作**：支持批量插入与更新

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

// 连接 Databend
Connection conn = DriverManager.getConnection("<your-dsn>");

// DDL：创建表
Statement stmt = conn.createStatement();
stmt.execute("CREATE TABLE users (id INT, name STRING, email STRING)");

// 写入：插入数据
PreparedStatement pstmt = conn.prepareStatement("INSERT INTO users VALUES (?, ?, ?)");
pstmt.setInt(1, 1);
pstmt.setString(2, "Alice");
pstmt.setString(3, "alice@example.com");
pstmt.executeUpdate();

// 查询：读取数据
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

## 相关资源

- **Maven Central**：[databend-jdbc](https://repo1.maven.org/maven2/com/databend/databend-jdbc/)
- **GitHub 仓库**：[databend-jdbc](https://github.com/databendcloud/databend-jdbc)
- **JDBC 文档**：[Oracle JDBC 指南](https://docs.oracle.com/javase/tutorial/jdbc/)