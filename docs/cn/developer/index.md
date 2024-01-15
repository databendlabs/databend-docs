---
title: 开发者资源
sidebar_position: -2
---

## 驱动程序

学习使用 Go、Python、Node.js、Java 和 Rust 等编程语言开发与 Databend 交互的应用程序。下表中描述的驱动程序可以用来从这些应用程序访问 Databend 或 Databend Cloud，使得支持的语言能够与 Databend 通信。

| 语言 	 | 驱动程序                                                                                                                                   	 | 原生? 	 | 描述                                                                                                                                                                                                                                                       	                 |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Go       	 | [ databend-go ]( https://github.com/datafuselabs/databend-go )                                                                           	 | 是     	 | 通过为 Go 编程语言设计的原生接口连接并与 Databend 或 Databend Cloud 交互。[点击这里](00-drivers/00-golang.md)了解有关驱动程序安装、教程和代码示例的更多信息。                                              	 |
| Python   	 | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ]( https://github.com/databendcloud/databend-py ) 	 | 是     	 | 通过为 Python 编程语言开发的原生接口连接并与 Databend 或 Databend Cloud 交互。[点击这里](00-drivers/01-python.md)了解有关驱动程序安装、教程和代码示例的更多信息。                                         	 |
| Node.js  	 | [databend-driver](https://www.npmjs.com/package/databend-driver)                                                                           	 | 是      	 | 使用 Databend 驱动程序 Node.js 绑定连接并与 Databend 或 Databend Cloud 交互。[点击这里](00-drivers/02-nodejs.md)了解有关驱动程序安装、教程和代码示例的更多信息。                                                                     	 |
| Java     	 | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                           	 | 是     	 | 通过为 Java 编程语言设计的原生接口从各种客户端工具和应用程序连接并与 Databend 或 Databend Cloud 交互。[点击这里](00-drivers/03-jdbc.md)了解有关驱动程序安装、教程和代码示例的更多信息。 	   |
| Rust     	 | [databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)                                                               	 | 是     	 | 通过为 Rust 编程语言开发的原生接口连接并与 Databend 或 Databend Cloud 交互。[点击这里](00-drivers/04-rust.md)了解有关驱动程序安装、教程和代码示例的更多信息。                                               |

## APIs

Databend 提供了多种强大的 API，允许您无缝地与系统交互、与外部数据库集成、启用实时数据摄取以及简化文件上传。在支持的语言中开发时，随意使用这些 API 来充分利用 Databend 的全部潜力。

| API                	| 描述                                                                                                    	|
|--------------------	|------------------------------------------------------------------------------------------------------------|
| [HTTP 处理器](10-apis/http.md)     	| 允许通过 HTTP 请求与 Databend 进行交互。                                                        	|
