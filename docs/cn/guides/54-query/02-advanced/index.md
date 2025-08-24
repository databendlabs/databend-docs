---
title: 高级功能
---

通过自定义函数、外部集成、存储过程和序列（Sequence）扩展 Databend 的能力。

## [用户定义函数（UDF）](./udf.md)
使用 SQL、Python 或 JavaScript 创建可复用的自定义函数。
```sql
-- SQL 函数
CREATE FUNCTION calculate_bonus(salary FLOAT, rating FLOAT)
RETURNS FLOAT AS $$ salary * rating * 0.1 $$;

-- 使用函数
SELECT name, calculate_bonus(salary, performance_rating) as bonus
FROM employees;
```

## [外部函数](./external-function.md)
与外部服务和 API 集成。
```sql
-- 调用外部机器学习模型
SELECT customer_id, predict_churn(age, tenure, usage) as churn_risk
FROM customers;
```

## [存储过程](./stored-procedure.md)
支持控制流的多步操作。
```sql
-- 复杂的业务逻辑
CALL monthly_report_generation('2023-12');
```

## [序列（Sequence）](./sequences.md)
生成唯一标识符和序列值。
```sql
-- 创建自增 ID
CREATE SEQUENCE user_id_seq;
INSERT INTO users VALUES (NEXTVAL(user_id_seq), 'John Doe');
```


## 最佳实践

### 函数设计
- **保持函数纯粹** - 相同输入始终产生相同输出。
- **处理 NULL 值** - 考虑 NULL 输入的处理方式。
- **使用合适类型** - 使输入/输出类型与使用场景匹配。
- **完善文档** - 清晰描述参数和返回值。

### 性能考量
- **UDF 开销** - SQL 函数最快，Python/JS 较慢。
- **批量操作** - 尽可能批量处理数据。
- **资源限制** - 监控复杂函数的内存使用。

### 安全性
- **验证输入** - 在 UDF 代码中检查参数。
- **最小权限** - 外部连接应仅拥有必要权限。
- **审计使用** - 监控 UDF 和外部函数的调用。