---
title: 用户自定义函数
---

Databend 中的用户自定义函数（User-Defined Function，UDF）允许您根据特定的数据处理需求创建自定义操作。本页将重点介绍常用命令，并帮助您选择适合您用例的函数类型。

## 函数管理命令

| 命令 | 描述 |
|---|---|
| [CREATE SCALAR FUNCTION](ddl-create-function.md) | 标量函数（SQL/Python/JavaScript） |
| [CREATE AGGREGATE FUNCTION](ddl-create-aggregate-function.md) | 脚本 UDAF（JavaScript/Python 运行时） |
| [CREATE TABLE FUNCTION](ddl-create-table-function.md) | 纯 SQL 表函数（返回结果集） |
| [SHOW USER FUNCTIONS](ddl-show-user-functions.md) | 列出所有用户自定义函数 |
| [ALTER FUNCTION](ddl-alter-function.md) | 修改现有函数 |
| [DROP FUNCTION](ddl-drop-function.md) | 移除函数 |

## 函数类型对比

| 特性 | 标量（SQL） | 标量（Python/JavaScript） | 聚合（脚本） | 表格（SQL） |
|---|---|---|---|---|
| **返回类型** | 单个值 | 单个值 | 单个值 | 表/结果集 |
| **语言** | SQL 表达式 | Python/JavaScript | JavaScript/Python 运行时 | SQL 查询 |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **需要企业版** | 否 | Python 运行时需要 | Python 运行时需要 | 否 |
| **包支持** | 否 | Python：支持 PACKAGES | Python：支持 PACKAGES | 否 |
| **最佳适用场景** | 数学计算<br/>字符串操作<br/>数据格式化 | 高级算法<br/>外部库<br/>控制流逻辑 | 自定义聚合逻辑<br/>需要脚本语言处理 | 复杂查询<br/>多行结果<br/>数据转换 |

## 统一语法

所有本地 UDF 类型都使用一致的 `$$` 语法：

```sql
-- 标量函数
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE AS $$ expression $$;

-- 表格函数
CREATE FUNCTION func_name(param TYPE) RETURNS TABLE(...) AS $$ query $$;

-- 标量函数（Python/JavaScript）
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE
LANGUAGE python
HANDLER = 'handler' AS $$ code $$;
```
