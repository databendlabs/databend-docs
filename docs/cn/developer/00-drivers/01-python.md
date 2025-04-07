---
title: Python
---

Databend 提供了以下 Python 包，使你能够开发与 Databend 交互的 Python 应用程序：

- [databend-driver (**推荐**)](https://pypi.org/project/databend-driver/): 一个用于 Databend 的 Python 驱动程序，提供同步和异步接口来与 Databend 交互、执行 SQL 查询和处理数据操作。
- [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy): 提供 SQL 工具包和 [对象关系映射](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) 以与 Databend 数据库连接。[SQLAlchemy](https://www.sqlalchemy.org/) 是一个流行的 Python SQL 工具包和 ORM，而 databend-SQLAlchemy 是 SQLAlchemy 的一种方言，允许你使用 SQLAlchemy 与 Databend 交互。

这两个包都需要 Python 3.7 或更高版本。要检查你的 Python 版本，请在命令提示符中运行 `python --version`。要安装最新的 `databend-driver` 或 `databend-sqlalchemy` 包：

```bash
# install databend-driver
pip install databend-driver

# install databend-sqlalchemy
pip install databend-sqlalchemy
```

## 数据类型映射

下表说明了 Databend 常规数据类型及其对应的 Python 等效项之间的对应关系：

| Databend  | Python            |
| --------- | ----------------- |
| BOOLEAN   | bool              |
| TINYINT   | int               |
| SMALLINT  | int               |
| INT       | int               |
| BIGINT    | int               |
| FLOAT     | float             |
| DOUBLE    | float             |
| DECIMAL   | decimal.Decimal   |
| DATE      | datetime.date     |
| TIMESTAMP | datetime.datetime |
| VARCHAR   | str               |
| BINARY    | bytes             |

下表说明了 Databend 半结构化数据类型及其对应的 Python 等效项之间的对应关系：

| Databend | Python |
| -------- | ------ |
| ARRAY    | list   |
| TUPLE    | tuple  |
| MAP      | dict   |
| VARIANT  | str    |
| BITMAP   | str    |
| GEOMETRY | str    |

## 教程

- [使用 databend-driver 与 Databend Cloud 集成](/tutorials/programming/python/integrating-with-databend-cloud-using-databend-driver)
- [使用 databend-sqlalchemy 与 Databend Cloud 集成](/tutorials/programming/python/integrating-with-databend-cloud-using-databend-sqlalchemy)
- [与私有化部署 Databend 集成](/tutorials/programming/python/integrating-with-self-hosted-databend)
