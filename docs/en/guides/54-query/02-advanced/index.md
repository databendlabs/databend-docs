---
title: Advanced Features
---

Extend Databend's capabilities with custom functions, external integrations, stored procedures, and sequences.

## [User-Defined Functions (UDF)](./udf.md)
Create reusable custom functions in SQL, Python, or JavaScript
```sql
-- SQL function
CREATE FUNCTION calculate_bonus(salary FLOAT, rating FLOAT)
RETURNS FLOAT AS $$ salary * rating * 0.1 $$;

-- Use it
SELECT name, calculate_bonus(salary, performance_rating) as bonus
FROM employees;
```

## [External Functions](./external-function.md)
Integrate with external services and APIs
```sql
-- Call external ML model
SELECT customer_id, predict_churn(age, tenure, usage) as churn_risk
FROM customers;
```

## [Stored Procedures](./stored-procedure.md)
Multi-step operations with control flow
```sql
-- Complex business logic
CALL monthly_report_generation('2023-12');
```

## [Sequences](./sequences.md)
Generate unique identifiers and sequential values
```sql
-- Create auto-incrementing ID
CREATE SEQUENCE user_id_seq;
INSERT INTO users VALUES (NEXTVAL(user_id_seq), 'John Doe');
```


## Best Practices

### Function Design
- **Keep functions pure** - Same input always produces same output
- **Handle NULLs** - Consider NULL input handling
- **Use appropriate types** - Match input/output types to usage
- **Document well** - Clear parameter and return descriptions

### Performance Considerations
- **UDF overhead** - SQL functions are fastest, Python/JS slower
- **Batch operations** - Process data in batches when possible
- **Resource limits** - Monitor memory usage for complex functions

### Security
- **Validate inputs** - Check parameters in UDF code
- **Least privilege** - External connections should have minimal permissions
- **Audit usage** - Monitor UDF and external function calls