---
title: 开发者资源
sidebar_position: -2
---

## APIs

Databend提供了各种强大的API，允许您与系统无缝交互，与外部数据库集成，实现实时数据摄取，并简化文件上传。在支持的编程语言中开发时，可以自由地利用这些API来发挥Databend的全部潜力。

| API                	| 描述                                                                                                    	|
|--------------------	|----------------------------------------------------------------------------------------------------------------	|
| [HTTP处理程序](00-apis/http.md)     	| 允许通过HTTP请求与Databend进行交互。                                                        	|                              	

## 驱动程序

学习使用Go、Python、Node.js、Java和Rust等编程语言开发与Databend交互的应用程序。下表中描述的驱动程序可用于从这些应用程序访问Databend或Databend Cloud，从而实现与Databend的通信。

| 语言 	 | 驱动程序                                                                                                                                   	 | 本地支持? 	 | 描述                                                                                                                                                                                                                                                       	                 |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Go       	 | [ databend-go ]( https://github.com/databendcloud/databend-go )                                                                           	 | 是     	 | 通过专为Go编程语言设计的本地接口连接到Databend或Databend Cloud并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/00-golang.md)。                                              	 |
| Python   	 | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ]( https://github.com/databendcloud/databend-py ) 	 | 是     	 | 通过专为Python编程语言开发的本地接口连接到Databend或Databend Cloud并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/01-python.md)。                                         	 |
| Node.js  	 | [Node.js的MySQL驱动程序](https://www.npmjs.com/package/mysql)                                                                           	 | 否      	 | 使用Node.js MySQL驱动程序接口连接到Databend或Databend Cloud并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/02-nodejs.md)。                                                                     	 |
| Java     	 | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                           	 | 是     	 | 通过专为Java编程语言设计的本地接口，从各种客户端工具和应用程序连接到Databend或Databend Cloud并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/03-jdbc.md)。 	   |
| Rust     	 | [databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)                                                               	 | 是     	 | 通过专为Rust编程语言开发的本地接口连接到Databend或Databend Cloud并与之交互。有关驱动程序安装、教程和代码示例的更多信息，请单击[此处](./01-drivers/04-rust.md)。                                               |