---
title: UUID 函数
---

本页面提供 Databend 中 UUID 相关函数的参考信息。这些函数用于生成和处理通用唯一标识符（UUID）。

## UUID 生成函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [GEN_RANDOM_UUID](gen-random-uuid.md) | 生成随机 UUID（v1.2.658 起使用版本 7，此前使用版本 4） | `GEN_RANDOM_UUID()` → `'01890a5d-ac96-7cc6-8128-01d71ab8b93e'` |
| [UUID](uuid.md) | GEN_RANDOM_UUID 的别名 | `UUID()` → `'01890a5d-ac96-7cc6-8128-01d71ab8b93e'` |

## 使用示例

### 生成主键

```sql
-- 创建带 UUID 主键的表
CREATE TABLE users (
  id UUID DEFAULT GEN_RANDOM_UUID(),
  username VARCHAR,
  email VARCHAR,
  PRIMARY KEY(id)
);

-- 插入数据时不指定 UUID
INSERT INTO users (username, email) 
VALUES ('johndoe', 'john@example.com');

-- 查看自动生成的 UUID
SELECT * FROM users;
```

### 为分布式系统创建唯一标识符

```sql
-- 为分布式事件跟踪生成多个 UUID
SELECT 
  GEN_RANDOM_UUID() AS event_id,
  'user_login' AS event_type,
  NOW() AS event_time
FROM numbers(5);
```

### UUID 版本信息

Databend 的 UUID 实现方案变更如下：

- **v1.2.658 起**：使用 UUID 版本 7（含时间戳信息，支持时序排序）
- **v1.2.658 此前**：使用 UUID 版本 4（完全随机生成）