---
title: Python
---

Databend offers the following Python packages enabling you to develop Python applications that interact with Databend:

- [databend-driver (**Recommended**)](https://pypi.org/project/databend-driver/): A Python driver for Databend, providing both synchronous and asynchronous interfaces to interact with Databend, execute SQL queries, and handle data operations.
- [databend-sqlalchemy](https://github.com/databendcloud/databend-sqlalchemy): Provides a SQL toolkit and [Object-Relational Mapping](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) to interface with the Databend database. [SQLAlchemy](https://www.sqlalchemy.org/) is a popular SQL toolkit and ORM for Python, and databend-SQLAlchemy is a dialect for SQLAlchemy that allows you to use SQLAlchemy to interact with Databend.

Both packages require Python version 3.7 or higher. To check your Python version, run `python --version` in your command prompt. To install the latest `databend-driver` or `databend-sqlalchemy` package:

```bash
# install databend-driver
pip install databend-driver

# install databend-sqlalchemy
pip install databend-sqlalchemy
```

## Data Type Mappings

This table illustrates the correspondence between Databend general data types and their corresponding Python equivalents:

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

This table illustrates the correspondence between Databend semi-structured data types and their corresponding Python equivalents:

| Databend | Python |
| -------- | ------ |
| ARRAY    | list   |
| TUPLE    | tuple  |
| MAP      | dict   |
| VARIANT  | str    |
| BITMAP   | str    |
| GEOMETRY | str    |

## Tutorials

- [Integrating with Databend Cloud using databend-driver](/tutorials/programming/python/integrating-with-databend-cloud-using-databend-driver)
- [Integrating with Databend Cloud using databend-sqlalchemy](/tutorials/programming/python/integrating-with-databend-cloud-using-databend-sqlalchemy)
- [Integrating with Self-Hosted Databend](/tutorials/programming/python/integrating-with-self-hosted-databend)