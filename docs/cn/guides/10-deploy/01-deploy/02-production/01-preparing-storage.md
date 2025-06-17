---
title: 准备存储
sidebar_label: 准备存储
description: 为 Databend 部署准备存储的建议。
---

本主题介绍了在生产环境中部署 Databend 时推荐的存储配置。

## AWS S3

在生产环境中使用 AWS S3 部署 Databend 时，请考虑以下建议：

### 安全性

阻止对 S3 存储桶的公共访问，防止未经授权的数据访问。可通过以下设置限制公共访问：

前往 AWS 管理控制台，选择 S3 服务，输入存储桶名称，点击 **Permissions** 标签页。在 **Block public access** 区域点击 **Edit**，选择 **Block all public access** 选项后点击 **Save**。

### 加密

启用 S3 存储桶的服务器端加密功能，保护静态数据。可选择以下加密方案：

- **SSE-S3**：使用 Amazon S3 托管密钥的服务器端加密
- **SSE-KMS**：使用 AWS 密钥管理服务（KMS）密钥的服务器端加密

前往 AWS 管理控制台，选择 S3 服务，输入存储桶名称，点击 **Properties** 标签页。在 **Default encryption** 区域点击 **Edit**，选择加密选项后点击 **Save**。

### 存储桶版本控制

启用 S3 存储桶版本控制功能，防止对象意外删除。该功能支持从误删或覆盖操作中恢复对象。

前往 AWS 管理控制台，选择 S3 服务，输入存储桶名称，点击 **Properties** 标签页。在 **Versioning** 区域点击 **Edit**，选择 **Enable versioning** 后点击 **Save**。

### 存储桶生命周期策略

启用存储桶版本控制后需配置生命周期规则。可通过生命周期策略自动删除对象旧版本或转换对象存储类别。

- 配置删除对象旧版本的生命周期规则：

  1. 前往 AWS 管理控制台，选择 S3 服务，输入存储桶名称，点击 **Management** 标签页。在 **Lifecycle** 区域点击 **Add lifecycle rule** 创建新规则
  
  2. 输入规则名称，选择对象前缀，配置规则操作：**Permanently delete noncurrent versions of objects**（永久删除对象的非当前版本）
  
  3. 设置对象变为非当前版本后的天数：建议 7 天
  
  4. 设置保留版本数量：建议 0
  
  5. 点击 **Create rule** 保存生命周期策略

- 配置清理过期删除标记和未完成分段上传的生命周期规则：

  1. 前往 AWS 管理控制台，选择 S3 服务，输入存储桶名称，点击 **Management** 标签页。在 **Lifecycle** 区域点击 **Add lifecycle rule** 创建新规则
  
  2. 输入规则名称，选择对象前缀，配置规则操作：**Delete expired object delete markers or incomplete multipart uploads**（删除过期的对象删除标记或未完成的分段上传）
  
  3. 勾选启用以下选项：
  
     - **Expired object delete markers**：清除过期对象的删除标记
     - **Incomplete multipart uploads**：在指定天数后清理未完成的分段上传
  
  4. 点击 **Create rule** 保存生命周期策略