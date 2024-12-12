---
title: Developer Resources
sidebar_position: -2
---

## Drivers

Learn to use programming languages such as Go, Python, Node.js, Java, and Rust to develop applications that interact with Databend. Drivers described in the table below can be used to access Databend or Databend Cloud from these applications, enabling communication with Databend from the supported languages.

| Language | Drivers                                                                                                                              | Native? | Description                                                                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Go       | [ databend-go ](https://github.com/databendlabs/databend-go)                                                                         | Yes     | Connect to and interact with Databend or Databend Cloud through a native interface designed for Go programming language. [Click here](00-drivers/00-golang.md) for more information about the driver installation, tutorials, and code samples.                                            |
| Python   | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ](https://github.com/databendcloud/databend-py) | Yes     | Connect to and interact with Databend or Databend Cloud through a native interface developed for Python programming language. [Click here](00-drivers/01-python.md) for more information about the driver installation, tutorials, and code samples.                                       |
| Node.js  | [databend-driver](https://www.npmjs.com/package/databend-driver)                                                                     | Yes     | Connect to and interact with Databend or Databend Cloud using the Databend Driver Node.js Binding. [Click here](00-drivers/02-nodejs.md) for more information about the driver installation, tutorials, and code samples.                                                                  |
| Java     | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                      | Yes     | Connect to and interact with Databend or Databend Cloud from various client tools and applications through a native interface designed for Java programming language. [Click here](00-drivers/03-jdbc.md) for more information about the driver installation, tutorials, and code samples. |
| Rust     | [databend-driver](https://github.com/databendlabs/BendSQL/tree/main/driver)                                                          | Yes     | Connect to and interact with Databend or Databend Cloud through a native interface developed for Rust programming language. [Click here](00-drivers/04-rust.md) for more information about the driver installation, tutorials, and code samples.                                           |

## APIs

Databend offers a variety of powerful APIs, allowing you to seamlessly interact with the system, integrate with external databases, enable real-time data ingestion, and simplify file uploads. Feel free to utilize these APIs when developing in supported languages to leverage the full potential of Databend.

| API                             | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| [HTTP Handler](10-apis/http.md) | Allows interaction with Databend through HTTP requests. |
