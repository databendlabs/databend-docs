---
title: Sequences
sidebar_position: 4
---

Sequences generate unique, sequential numeric values, commonly used for primary keys and auto-incrementing identifiers.

## What are Sequences?

Sequences provide a thread-safe way to generate unique numbers across concurrent operations. Unlike auto-increment columns, sequences are database objects that can be used across multiple tables.

## Creating Sequences

### Basic Sequence
```sql
-- Create a simple sequence
CREATE SEQUENCE user_id_seq;

-- Use the sequence
SELECT NEXTVAL(user_id_seq);  -- Returns: 1
SELECT NEXTVAL(user_id_seq);  -- Returns: 2
SELECT NEXTVAL(user_id_seq);  -- Returns: 3
```

### Sequence with Options
```sql
-- Create sequence with custom settings
CREATE SEQUENCE order_id_seq 
    START = 1000
    INCREMENT = 1
    MINVALUE = 1000
    MAXVALUE = 999999999
    CACHE = 50;
```

## Using Sequences

### In INSERT Statements
```sql
-- Create table with sequence-generated IDs
CREATE TABLE users (
    id BIGINT,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Insert with sequence value
INSERT INTO users VALUES 
    (NEXTVAL(user_id_seq), 'John Doe', 'john@example.com'),
    (NEXTVAL(user_id_seq), 'Jane Smith', 'jane@example.com');
```

### Current and Next Values
```sql
-- Get next value (advances sequence)
SELECT NEXTVAL(user_id_seq);

-- Get current value (doesn't advance sequence)
SELECT CURRVAL(user_id_seq);
```

## Sequence Functions

| Function | Description | Example |
|----------|-------------|---------|
| `NEXTVAL(seq)` | Get next value and advance sequence | `NEXTVAL(user_id_seq)` |
| `CURRVAL(seq)` | Get current value without advancing | `CURRVAL(user_id_seq)` |

## Managing Sequences

### View Sequences
```sql
-- Show all sequences
SHOW SEQUENCES;

-- Describe specific sequence
DESC SEQUENCE user_id_seq;
```

### Modify Sequences
```sql
-- Reset sequence to specific value
ALTER SEQUENCE user_id_seq RESTART = 5000;

-- Change increment value
ALTER SEQUENCE user_id_seq INCREMENT = 10;
```

### Drop Sequences
```sql
-- Remove sequence
DROP SEQUENCE user_id_seq;
```

## Best Practices

### Performance Optimization
- **Use CACHE** - Improves performance by pre-allocating values
- **Appropriate INCREMENT** - Match your application needs
- **Monitor gaps** - Cached values may create gaps if server restarts

### Common Patterns
```sql
-- Auto-incrementing primary key pattern
CREATE SEQUENCE pk_seq START = 1 INCREMENT = 1 CACHE = 100;

CREATE TABLE products (
    id BIGINT DEFAULT NEXTVAL(pk_seq),
    name VARCHAR(100),
    price DECIMAL(10,2)
);

-- Order number pattern (readable IDs)
CREATE SEQUENCE order_seq START = 10000 INCREMENT = 1;

INSERT INTO orders VALUES 
    (NEXTVAL(order_seq), customer_id, order_date);
```

## vs Auto-Increment Columns

| Feature | Sequences | Auto-Increment |
|---------|-----------|----------------|
| **Reusability** | ✅ Multiple tables | ❌ Single column |
| **Control** | ✅ Full control | ❌ Limited options |
| **Gaps** | ✅ Predictable | ❌ May have gaps |
| **Performance** | ✅ Cacheable | ✅ Optimized |

## Common Use Cases

1. **Primary Keys** - Unique identifiers across tables
2. **Order Numbers** - Sequential business identifiers  
3. **Version Numbers** - Document or record versioning
4. **Batch IDs** - Processing batch identification