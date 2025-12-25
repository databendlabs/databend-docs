---
title: 手动部署与维护

---

## 概述

在本指南中，你将学习如何使用从 GitHub releases 获取的预构建软件包手动部署 Databend。本分步指南将引导你完成使用 systemd 进行服务管理来建立和管理 Databend 集群的全过程。部署过程包括：

1.  从 GitHub releases 下载并解压 Databend 软件包
2.  使用 systemd 配置并启动元数据服务（Meta Service）节点
3.  使用 systemd 配置并启动查询服务（Query Service）节点
4.  管理集群扩缩容操作：
    - 添加或移除元数据服务（Meta Service）节点
    - 添加或移除查询服务（Query Service）节点
5.  执行版本升级：
    - 升级元数据服务（Meta Service）节点
    - 升级查询服务（Query Service）节点

这种手动部署方法让你能够完全控制 Databend 集群的配置，适用于不方便或不倾向于使用自动化部署工具的环境。每个步骤都附有详细的说明和配置示例，以确保部署过程顺利进行。

## 目录

- [准备软件包环境](01-prepare.md)
- [部署元数据服务（Meta Service）](02-deploy-metasrv.md)
- [部署查询服务（Query Service）](03-deploy-query.md)
- [扩缩容元数据服务（Meta Service）节点](04-scale-metasrv.md)
- [扩缩容查询服务（Query Service）节点](05-scale-query.md)
- [升级元数据服务（Meta Service）](06-upgrade-metasrv.md)
- [升级查询服务（Query Service）](07-upgrade-query.md)