---
title: JOINs
---

A JOIN combines rows from two tables to create a new combined row that can be used in the query.

## Introduction

JOINs are useful when data is split across related tables. For example, one table holds employee information, and another holds department details.

Let's look at our sample data:

**Employees Table:**
```sql
SELECT * FROM employees ORDER BY id;
```

| id | name    | department  | salary   |
|----|---------|-------------|----------|
| 1  | Alice   | Engineering | 75000.00 |
| 2  | Bob     | Engineering | 80000.00 |
| 3  | Carol   | Marketing   | 65000.00 |
| 4  | David   | Sales       | 70000.00 |
| 5  | Eve     | Marketing   | 68000.00 |

**Departments Table:**
```sql
SELECT * FROM departments ORDER BY id;
```

| id | name        | budget     |
|----|-------------|------------|
| 1  | Engineering | 1000000.00 |
| 2  | Marketing   | 500000.00  |
| 3  | Sales       | 750000.00  |

The two tables share a common relationship: `employees.department` matches `departments.name`. JOINs let us combine this related data.

## Types of JOINs

### INNER JOIN

An INNER JOIN pairs each row in one table with matching rows in the other table.

```sql
-- Get employees with their department budgets
SELECT e.name, e.salary, d.name as department_name, d.budget
FROM employees e
INNER JOIN departments d ON e.department = d.name
ORDER BY e.name;
```

**Output:**
| name  | salary   | department_name | budget     |
|-------|----------|----------------|------------|
| Alice | 75000.00 | Engineering    | 1000000.00 |
| Bob   | 80000.00 | Engineering    | 1000000.00 |
| Carol | 65000.00 | Marketing      | 500000.00  |
| David | 70000.00 | Sales          | 750000.00  |
| Eve   | 68000.00 | Marketing      | 500000.00  |

The output contains only rows where there's a match between `employees.department` and `departments.name`.

### LEFT JOIN

A LEFT JOIN returns all rows from the left table, with matching data from the right table. If there's no match, the right columns contain NULL.

```sql
-- Get all employees, show department budget if available
SELECT e.name, e.department, d.budget
FROM employees e
LEFT JOIN departments d ON e.department = d.name
ORDER BY e.name;
```

**Output:**
| name  | department  | budget     |
|-------|-------------|------------|
| Alice | Engineering | 500000.00  |
| Bob   | Engineering | 500000.00  |
| Carol | Marketing   | 200000.00  |
| David | Sales       | 300000.00  |
| Eve   | Marketing   | 200000.00  |

All employees are shown, even if their department doesn't exist (budget would be NULL).

### RIGHT JOIN

A RIGHT JOIN returns all rows from the right table, with matching data from the left table.

```sql
-- Get all departments, show employees if any
SELECT d.name as department_name, e.name as employee_name
FROM employees e
RIGHT JOIN departments d ON e.department = d.name
ORDER BY d.name, e.name;
```

**Output:**
| department_name | employee_name |
|----------------|---------------|
| Engineering    | Alice         |
| Engineering    | Bob           |
| Marketing      | Carol         |
| Marketing      | Eve           |
| Sales          | David         |

All departments are shown, even if they have no employees (employee_name would be NULL).

### FULL JOIN

A FULL JOIN returns all rows from both tables, matching where possible.

```sql
-- Get all employees and all departments
SELECT e.name as employee_name, d.name as department_name
FROM employees e
FULL JOIN departments d ON e.department = d.name
ORDER BY e.name, d.name;
```

**Output:**
| employee_name | department_name |
|--------------|----------------|
| Alice        | Engineering    |
| Bob          | Engineering    |
| Carol        | Marketing      |
| David        | Sales          |
| Eve          | Marketing      |

Shows all employees and departments, with NULLs where there's no match.

### CROSS JOIN

A CROSS JOIN creates a Cartesian product - every row from the first table combined with every row from the second table.

**Warning**: This can create very large result sets. Use with caution.

```sql
-- Every employee paired with every department (rarely useful)
SELECT e.name, d.name as department
FROM employees e
CROSS JOIN departments d
ORDER BY e.name, d.name;
```

**Output (partial - 15 rows total):**
| name  | department  |
|-------|-------------|
| Alice | Engineering |
| Alice | Marketing   |
| Alice | Sales       |
| Bob   | Engineering |
| Bob   | Marketing   |
| Bob   | Sales       |
| Carol | Engineering |
| ...   | ...         |

**Result**: 5 employees × 3 departments = 15 rows total.

## JOIN Implementation

### Using ON Clause (Recommended)

```sql
SELECT e.name, d.budget
FROM employees e
JOIN departments d ON e.department = d.name;
```

### Using WHERE Clause (Legacy)

```sql
SELECT e.name, d.budget
FROM employees e, departments d
WHERE e.department = d.name;
```

**Recommendation**: Use the ON clause syntax because it's clearer and handles outer joins correctly.

## Multiple Table JOINs

You can chain JOINs together to combine data from more than two tables:

```sql
-- Employees with department budgets and project info (if projects table existed)
SELECT e.name, d.name as department, d.budget
FROM employees e
JOIN departments d ON e.department = d.name
JOIN projects p ON d.id = p.department_id
WHERE p.status = 'Active';
```

## When to Use Each JOIN Type

- **INNER JOIN**: When you only want matching records from both tables
- **LEFT JOIN**: When you want all records from the left table, matched where possible
- **RIGHT JOIN**: When you want all records from the right table, matched where possible  
- **FULL JOIN**: When you want all records from both tables
- **CROSS JOIN**: Rarely used; only when you specifically need a Cartesian product
