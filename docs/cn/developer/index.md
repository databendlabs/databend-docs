---
title: 开发者资源
sidebar_position: -2
---

## 驱动程序

学习使用Go、Python、Node.js、Java和Rust等编程语言开发与Databend交互的应用程序。下表中描述的驱动程序可用于从这些应用程序访问Databend或Databend Cloud，从而实现与支持语言的Databend通信。

| 语言       | 驱动程序                                                                                                                                    | 是否原生 | 描述                                                                                                                                                                                                                                                       	                 |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Go       	 | [ databend-go ]( https://github.com/datafuselabs/databend-go )                                                                           	 | 是     	 | 通过专为Go编程语言设计的原生接口连接并交互Databend或Databend Cloud。[点击此处](00-drivers/00-golang.md)获取更多关于驱动安装、教程和代码示例的信息。                                              	 |
| Python   	 | [databend-driver](https://pypi.org/project/databend-driver/) & [ databend-sqlalchemy ]( https://github.com/databendcloud/databend-py ) 	 | 是     	 | 通过专为Python编程语言开发的原生接口连接并交互Databend或Databend Cloud。[点击此处](00-drivers/01-python.md)获取更多关于驱动安装、教程和代码示例的信息。                                         	 |
| Node.js  	 | [databend-driver](https://www.npmjs.com/package/databend-driver)                                                                           	 | 是      	 | 使用Databend Driver Node.js绑定连接并交互Databend或Databend Cloud。[点击此处](00-drivers/02-nodejs.md)获取更多关于驱动安装、教程和代码示例的信息。                                                                     	 |
| Java     	 | [databend-jdbc](https://github.com/databendcloud/databend-jdbc)                                                                           	 | 是     	 | 通过专为Java编程语言设计的原生接口，从各种客户端工具和应用程序连接并交互Databend或Databend Cloud。[点击此处](00-drivers/03-jdbc.md)获取更多关于驱动安装、教程和代码示例的信息。 	   |
| Rust     	 | [databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)                                                               	 | 是     	 | 通过专为Rust编程语言开发的原生接口连接并交互Databend或Databend Cloud。[点击此处](00-drivers/04-rust.md)获取更多关于驱动安装、教程和代码示例的信息。                                               |

## API

Databend提供了一系列强大的API，使您能够无缝地与系统交互、集成外部数据库、实现实时数据摄取以及简化文件上传。在支持的语言中开发时，请随意使用这些API，以充分利用Databend的潜力。

| API                	| 描述                                                                                                    	|
|--------------------	|----------------------------------------------------------------------------------------------------------------	|
| [HTTP Handler](10-apis/http.md)     	| 允许通过HTTP请求与Databend交互。                                                        	|