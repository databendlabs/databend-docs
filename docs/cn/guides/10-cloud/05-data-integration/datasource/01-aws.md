---
title: AWS - Credentials
---

本页介绍如何创建 `AWS - Credentials` 数据源。该数据源用于保存访问 Amazon S3 所需的凭据，可供多个 S3 集成任务复用。

## 使用场景

- 为多个 S3 导入任务统一管理 AWS Access Key 和 Secret Key
- 避免在每个任务里重复填写同一组 S3 访问凭据
- 在凭据轮换后统一更新引用它的任务

## 创建 AWS - Credentials

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 将服务类型选择为 **AWS - Credentials**，然后填写凭据信息：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 当前数据源的描述性名称 |
| **Access Key** | 是 | AWS Access Key ID |
| **Secret Key** | 是 | AWS Secret Access Key |

![创建 S3 数据源](/img/cloud/dataintegration/create-s3-datasource.png)

3. 点击 **Test Connectivity** 验证凭据；如果测试成功，点击 **OK** 保存数据源。

## 权限要求

AWS 凭据必须对目标 S3 存储桶具备读取权限。如果后续任务会启用 **Clean Up Original Files**，还需要具备写入和删除权限。

## 后续操作

创建完成后，您可以基于该数据源创建 [Amazon S3 集成任务](../task/01-s3.md)。
