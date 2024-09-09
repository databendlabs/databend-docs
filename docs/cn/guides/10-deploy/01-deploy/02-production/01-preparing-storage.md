---
title: 准备存储
sidebar_label: 准备存储
description:
  为生产环境部署 Databend 的存储配置建议。
---

本主题解释了在生产环境中部署 Databend 的推荐存储配置。


## AWS S3

在生产环境中使用 AWS S3 部署 Databend 时，请考虑以下建议：


### 安全性

阻止对您的 S3 存储桶的公共访问，以防止未经授权访问您的数据。您可以通过配置以下设置来限制公共访问：

进入 AWS 管理控制台，选择 S3 服务，输入存储桶名称，然后点击 **Permissions** 选项卡。在 **Block public access** 部分，点击 **Edit**，然后选择 **Block all public access** 选项并点击 **Save**。


### 加密

在您的 S3 存储桶上启用服务器端加密，以保护您的静态数据。您可以选择以下加密选项：

- **SSE-S3**: 使用 Amazon S3 管理密钥的服务器端加密。
- **SSE-KMS**: 使用 AWS Key Management Service (KMS) 密钥的服务器端加密。

进入 AWS 管理控制台，选择 S3 服务，输入存储桶名称，然后点击 **Properties** 选项卡。在 **Default encryption** 部分，点击 **Edit**，然后选择加密选项并点击 **Save**。


### 存储桶版本控制

在您的 S3 存储桶上启用版本控制，以防止对象意外删除。版本控制允许您从意外删除或覆盖中恢复对象。

进入 AWS 管理控制台，选择 S3 服务，输入存储桶名称，然后点击 **Properties** 选项卡。在 **Versioning** 部分，点击 **Edit**，然后选择 **Enable versioning** 并点击 **Save**。


### 存储桶生命周期策略

当启用存储桶版本控制时，需要生命周期规则。您可以配置生命周期策略，以自动删除对象的旧版本或将对象转换到不同的存储类别。

1. 进入 AWS 管理控制台，选择 S3 服务，输入存储桶名称，然后点击 **Management** 选项卡。在 **Lifecycle** 部分，点击 **Add lifecycle rule** 以创建新规则。

2. 输入规则名称，选择对象前缀，并配置规则操作：**Permanently delete noncurrent versions of objects**。

3. 输入对象成为非当前版本后的天数：推荐 7 天。

4. 输入要保留的版本数：推荐 0。

5. 点击 **Create rule** 以保存生命周期策略。