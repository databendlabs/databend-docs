---
title: 配置管理用户
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.75"/>

Databend 不提供任何开箱即用的内置管理用户。在 Databend 启动之前，需要在 **databend-query.toml** 配置文件中配置一个用户，它相当于其他数据库中的 root 用户。为此，请按照以下步骤操作：

1. 打开 **databend-query.toml** 配置文件，然后找到 [query.users] 部分。

2. 取消注释（删除 # 符号）您想要使用的用户帐户，或者以相同的格式添加您自己的帐户。对于每个用户，指定以下信息：
    - **name**: 帐户的用户名。
    - **auth_type**: 帐户的身份验证类型。它可以是 "no_password"、"double_sha1_password" 或 "sha256_password"。
    - **auth_string**: 与用户帐户关联的密码或身份验证字符串。

要生成 **auth_string**，请使用加密哈希函数。以下是如何为每种身份验证类型生成 auth_string 的方法：

- **no_password**: 对于 no_password 身份验证类型，不需要密码。在这种情况下，根本不需要 auth_string 字段。

- **double_sha1_password**: 要为 double_sha1_password 身份验证类型生成 auth_string，请首先选择一个密码（例如，“databend”）。然后，运行以下命令，并将结果输出用作 auth_string：

  ```shell
  # xxd 实用程序未预安装在大多数 Linux 发行版中，但可以使用默认的包管理器轻松安装。
  # 对于 Ubuntu/Debian 基础，`apt install xxd`。
  echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
  ```

- **sha256_password**: 要为 sha256_password 身份验证类型生成 auth_string，请首先选择一个密码（例如，“databend”）。然后，运行以下命令，并将结果输出用作 auth_string：

  ```shell
  echo -n "databend" | sha256sum
  ```