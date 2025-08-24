---
title: 序列（Sequence）
sidebar_position: 4
---

序列（Sequence）用于生成唯一的、连续的数值，通常用于主键（Primary Key）和自增标识符。

## 什么是序列（Sequence）？

序列（Sequence）提供了一种线程安全的方式，用于在并发操作中生成唯一的数字。与自增列不同，序列（Sequence）是数据库对象，可以在多个表之间共享使用。

## 创建序列（Sequence）

### 基本序列（Sequence）
```sql
-- 创建一个简单的序列
CREATE SEQUENCE user_id_seq;

-- 使用序列
SELECT NEXTVAL(user_id_seq);  -- 返回: 1
SELECT NEXTVAL(user_id_seq);  -- 返回: 2
SELECT NEXTVAL(user_id_seq);  -- 返回: 3
```

### 带选项的序列（Sequence）
```sql
-- 创建带自定义设置的序列
CREATE SEQUENCE order_id_seq 
    START = 1000
    INCREMENT = 1
    MINVALUE = 1000
    MAXVALUE = 999999999
    CACHE = 50;
```

## 使用序列（Sequence）

### 在 INSERT 语句中使用
```sql
-- 创建使用序列生成 ID 的表
CREATE TABLE users (
    id BIGINT,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- 使用序列值插入数据
INSERT INTO users VALUES 
    (NEXTVAL(user_id_seq), 'John Doe', 'john@example.com'),
    (NEXTVAL(user_id_seq), 'Jane Smith', 'jane@example.com');
```

### 当前值与下一个值
```sql
-- 获取下一个值（序列会前进）
SELECT NEXTVAL(user_id_seq);

-- 获取当前值（序列不会前进）
SELECT CURRVAL(user_id_seq);
```

## 序列（Sequence）函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| `NEXTVAL(seq)` | 获取下一个值并推进序列 | `NEXTVAL(user_id_seq)` |
| `CURRVAL(seq)` | 获取当前值，不推进序列 | `CURRVAL(user_id_seq)` |

## 管理序列（Sequence）

### 查看序列（Sequence）
```sql
-- 显示所有序列
SHOW SEQUENCES;

-- 查看特定序列的描述
DESC SEQUENCE user_id_seq;
```

### 修改序列（Sequence）
```sql
-- 将序列重置为特定值
ALTER SEQUENCE user_id_seq RESTART = 5000;

-- 更改增量值
ALTER SEQUENCE user_id_seq INCREMENT = 10;
```

### 删除序列（Sequence）
```sql
-- 移除序列
DROP SEQUENCE user_id_seq;
```

## 最佳实践

### 性能优化
- **使用 CACHE** - 通过预分配值来提高性能
- **适当的 INCREMENT** - 匹配你的应用需求
- **监控间隙** - 如果服务器重启，缓存的值可能会产生间隙

### 常见模式
```sql
-- 自增主键模式
CREATE SEQUENCE pk_seq START = 1 INCREMENT = 1 CACHE = 100;

CREATE TABLE products (
    id BIGINT DEFAULT NEXTVAL(pk_seq),
    name VARCHAR(100),
    price DECIMAL(10,2)
);

-- 订单号模式（可读 ID）
CREATE SEQUENCE order_seq START = 10000 INCREMENT = 1;

INSERT INTO orders VALUES 
    (NEXTVAL(order_seq), customer_id, order_date);
```

## 与自增列的对比

| 特性 | 序列（Sequence） | 自增（Auto-Increment） |
|---------|-----------|----------------|
| **可重用性** | ✅ 多个表 | ❌ 单个列 |
| **控制** | ✅ 完全控制 | ❌ 选项有限 |
| **间隙** | ✅ 可预测 | ❌ 可能有间隙 |
| **性能** | ✅ 可缓存 | ✅ 已优化 |

## 常见用例

1. **主键（Primary Key）** - 跨表的唯一标识符
2. **订单号** - 连续的业务标识符
3. **版本号** - 文档或记录的版本控制
4. **批次 ID** - 处理批次的标识