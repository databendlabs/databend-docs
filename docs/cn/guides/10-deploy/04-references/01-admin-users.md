---
title: 配置管理员用户
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入: v1.1.75"/>

Databend 没有提供任何内置的管理员用户。在 Databend 启动之前，需要在 **databend-query.toml** 配置文件中配置一个管理员用户，这相当于其他数据库中的 root 用户。具体步骤如下：

1. 打开 **databend-query.toml** 配置文件，然后找到 [query.users] 部分。

2. 取消注释（删除 # 符号）你想要使用的用户账户，或者以相同的格式添加你自己的用户账户。对于每个用户，指定以下信息：
    - **name**: 账户的用户名。
    - **auth_type**: 账户的认证类型。可以是 "no_password"、"double_sha1_password" 或 "sha256_password"。
    - **auth_string**: 与用户账户关联的密码或认证字符串。

要生成 **auth_string**，请使用加密哈希函数。以下是如何为每种提到的认证类型生成 auth_string 的方法：

- **no_password**: 对于 no_password 认证类型，不需要密码。在这种情况下，auth_string 字段根本不需要。

- **double_sha1_password**: 要为 double_sha1_password 认证类型生成 auth_string，首先选择一个密码（例如 "databend"）。然后，运行以下命令并将结果输出用作 auth_string：

  ```shell
  # xxd 工具在大多数 Linux 发行版中没有预安装，但可以通过默认的包管理器轻松安装。
  # 对于 Ubuntu/Debian 系统，`apt install xxd`。
  echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
  ```

- **sha256_password**: 要为 sha256_password 认证类型生成 auth_string，首先选择一个密码（例如 "databend"）。然后，运行以下命令并将结果输出用作 auth_string：

  ```shell
  echo -n "databend" | sha256sum
  ```