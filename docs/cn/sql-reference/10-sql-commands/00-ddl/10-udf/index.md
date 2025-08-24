---
title: 用户自定义函数
---

Databend 中的用户自定义函数（User-Defined Function，UDF）允许您根据特定的数据处理需求创建自定义操作。本页面将帮助您为具体用例选择合适的函数类型。

## 函数类型对比

| 特性 | 标量 SQL（Scalar SQL） | 表格 SQL（Tabular SQL） | 嵌入式（Embedded） |
|---|---|---|---|
| **返回类型** | 单个值 | 表/结果集 | 单个值 |
| **语言** | SQL 表达式 | SQL 查询 | Python/JavaScript/WASM |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **需要企业版** | 否 | 否 | Python：是 |
| **包支持** | 否 | 否 | Python：是 |
| **最佳适用场景** | 数学计算<br/>字符串操作<br/>数据格式化 | 复杂查询<br/>多行结果<br/>数据转换 | 高级算法<br/>外部库<br/>控制流逻辑 |

## 函数管理命令

| 命令 | 描述 |
|---|---|
| [CREATE SCALAR FUNCTION](ddl-create-function.md) | 使用统一语法创建标量 SQL 函数 |
| [CREATE TABLE FUNCTION](ddl-create-table-function.md) | 创建返回结果集的表格函数 |
| [CREATE EMBEDDED FUNCTION](ddl-create-function-embedded.md) | 创建嵌入式函数（Python/JavaScript/WASM） |
| [SHOW USER FUNCTIONS](ddl-show-user-functions.md) | 列出所有用户自定义函数 |
| [ALTER FUNCTION](ddl-alter-function.md) | 修改现有函数 |
| [DROP FUNCTION](ddl-drop-function.md) | 移除函数 |

## 统一语法

所有本地 UDF 类型都使用一致的 `$$` 语法：

```sql
-- 标量函数
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE AS $$ expression $$;

-- 表格函数
CREATE FUNCTION func_name(param TYPE) RETURNS TABLE(...) AS $$ query $$;

-- 嵌入式函数
CREATE FUNCTION func_name(param TYPE) RETURNS TYPE LANGUAGE python 
HANDLER = 'handler' AS $$ code $$;
```