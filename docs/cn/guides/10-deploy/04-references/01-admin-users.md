---
title: 配置管理员用户
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.75"/>

Databend 默认情况下不提供任何内置的管理员用户。在 Databend 首次启动之前，需要在 **databend-query.toml** 配置文件中配置一个，这相当于其他数据库中的 root 用户。要做到这一点，请按照以下步骤操作：

1. 打开 **databend-query.toml** 配置文件，然后定位到 [query.users] 部分。

2. 取消注释（移除 # 符号）您想要使用的用户账户，或以相同的格式添加您自己的账户。对于每个用户，指定以下信息：
    - **name**：账户的用户名。
    - **auth_type**：账户的认证类型。可以是 "no_password"、"double_sha1_password" 或 "sha256_password"。
    - **auth_string**：与用户账户关联的密码或认证字符串。

要生成 **auth_string**，请使用加密哈希函数。以下是为提到的每种认证类型生成 auth_string 的方法：

- **no_password**：对于 no_password 认证类型，不需要密码。在这种情况下，根本不需要 auth_string 字段。

- **double_sha1_password**：要为 double_sha1_password 认证类型生成 auth_string，请首先选择一个密码（例如，"databend"）。然后，运行以下命令并使用结果输出作为 auth_string：

  ```shell
  echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
  ```

- **sha256_password**：要为 sha256_password 认证类型生成 auth_string，请首先选择一个密码（例如，"databend"）。然后，运行以下命令并使用结果输出作为 auth_string：

  ```shell
  echo -n "databend" | sha256sum
  ```