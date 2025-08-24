---
title: JOINs
---

JOIN 用于将两个表中的行组合起来，创建一个新的组合行，以便在查询（Query）中使用。

## 简介

当数据分散在多个相关表中时，JOIN 非常有用。例如，一个表存储员工信息，另一个表存储部门详情。

我们来看一下示例数据：

**员工表（Employees Table）：**
```sql
SELECT * FROM employees ORDER BY id;
```

| id | name  | department  | salary   |
|----|-------|-------------|----------|
| 1  | Alice | Engineering | 75000.00 |
| 2  | Bob   | Engineering | 80000.00 |
| 3  | Carol | Marketing   | 65000.00 |
| 4  | David | Sales       | 70000.00 |
| 5  | Eve   | Marketing   | 68000.00 |

**部门表（Departments Table）：**
```sql
SELECT * FROM departments ORDER BY id;
```

| id | name        | budget     |
|----|-------------|------------|
| 1  | Engineering | 1000000.00 |
| 2  | Marketing   | 500000.00  |
| 3  | Sales       | 750000.00  |

这两个表有一个共同的关系：`employees.department` 与 `departments.name` 匹配。JOIN 让我们能够组合这些相关数据。

## JOIN 的类型

### 内连接（INNER JOIN）

内连接（INNER JOIN）将一个表中的每一行与另一个表中的匹配行配对。

```sql
-- 获取员工及其部门预算
SELECT e.name, e.salary, d.name as department_name, d.budget
FROM employees e
INNER JOIN departments d ON e.department = d.name
ORDER BY e.name;
```

**输出：**
| name  | salary   | department_name | budget     |
|-------|----------|-----------------|------------|
| Alice | 75000.00 | Engineering     | 1000000.00 |
| Bob   | 80000.00 | Engineering     | 1000000.00 |
| Carol | 65000.00 | Marketing       | 500000.00  |
| David | 70000.00 | Sales           | 750000.00  |
| Eve   | 68000.00 | Marketing       | 500000.00  |

输出仅包含 `employees.department` 和 `departments.name` 之间存在匹配的行。

### 左连接（LEFT JOIN）

左连接（LEFT JOIN）返回左表中的所有行，以及右表中匹配的数据。如果没有匹配项，右表的列将包含 NULL。

```sql
-- 获取所有员工，并显示其部门预算（如果可用）
SELECT e.name, e.department, d.budget
FROM employees e
LEFT JOIN departments d ON e.department = d.name
ORDER BY e.name;
```

**输出：**
| name  | department  | budget     |
|-------|-------------|------------|
| Alice | Engineering | 1000000.00 |
| Bob   | Engineering | 1000000.00 |
| Carol | Marketing   | 500000.00  |
| David | Sales       | 750000.00  |
| Eve   | Marketing   | 500000.00  |

所有员工都会显示，即使他们所在的部门不存在（此时预算将为 NULL）。

### 右连接（RIGHT JOIN）

右连接（RIGHT JOIN）返回右表中的所有行，以及左表中匹配的数据。

```sql
-- 获取所有部门，并显示其中的员工（如果有）
SELECT d.name as department_name, e.name as employee_name
FROM employees e
RIGHT JOIN departments d ON e.department = d.name
ORDER BY d.name, e.name;
```

**输出：**
| department_name | employee_name |
|-----------------|---------------|
| Engineering     | Alice         |
| Engineering     | Bob           |
| Marketing       | Carol         |
| Marketing       | Eve           |
| Sales           | David         |

所有部门都会显示，即使部门中没有员工（此时 employee_name 将为 NULL）。

### 全连接（FULL JOIN）

全连接（FULL JOIN）返回两个表中的所有行，并在可能的情况下进行匹配。

```sql
-- 获取所有员工和所有部门
SELECT e.name as employee_name, d.name as department_name
FROM employees e
FULL JOIN departments d ON e.department = d.name
ORDER BY e.name, d.name;
```

**输出：**
| employee_name | department_name |
|---------------|-----------------|
| Alice         | Engineering     |
| Bob           | Engineering     |
| Carol         | Marketing       |
| David         | Sales           |
| Eve           | Marketing       |

显示所有员工和部门，没有匹配项的地方为 NULL。

### 交叉连接（CROSS JOIN）

交叉连接（CROSS JOIN）会创建一个笛卡尔积（Cartesian product）——第一个表中的每一行都与第二个表中的每一行组合。

**警告**：这可能会产生非常大的结果集。请谨慎使用。

```sql
-- 每个员工与每个部门配对（很少使用）
SELECT e.name, d.name as department
FROM employees e
CROSS JOIN departments d
ORDER BY e.name, d.name;
```

**输出（部分 - 总共 15 行）：**
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

**结果**：5 名员工 × 3 个部门 = 总共 15 行。

## JOIN 的实现

### 使用 ON 子句（推荐）

```sql
SELECT e.name, d.budget
FROM employees e
JOIN departments d ON e.department = d.name;
```

### 使用 WHERE 子句（旧式）

```sql
SELECT e.name, d.budget
FROM employees e, departments d
WHERE e.department = d.name;
```

**建议**：使用 ON 子句语法，因为它更清晰，并且能正确处理外连接。

## 多表 JOIN

你可以将多个 JOIN 链接在一起，以组合来自两个以上表的数据：

```sql
-- 获取员工、部门预算和项目信息（如果存在 projects 表）
SELECT e.name, d.name as department, d.budget
FROM employees e
JOIN departments d ON e.department = d.name
JOIN projects p ON d.id = p.department_id
WHERE p.status = 'Active';
```

## 何时使用各种 JOIN 类型

- **内连接（INNER JOIN）**：当你只需要两个表中都匹配的记录时。
- **左连接（LEFT JOIN）**：当你需要左表中的所有记录，并尽可能匹配右表时。
- **右连接（RIGHT JOIN）**：当你需要右表中的所有记录，并尽可能匹配左表时。
- **全连接（FULL JOIN）**：当你需要两个表中的所有记录时。
- **交叉连接（CROSS JOIN）**：很少使用；仅在明确需要笛卡尔积（Cartesian product）时使用。