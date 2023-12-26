---
title: 配置管理员用户
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.75"/>

Databend默认情况下不提供内置的管理员用户。在Databend首次启动之前，需要在**databend-query.toml**配置文件中配置一个，这相当于其他数据库中的root用户。按照以下步骤操作：

1. 打开**databend-query.toml**配置文件，然后找到[query.users]部分。

2. 取消注释（移除#符号）你想使用的用户账户，或者按照相同的格式添加你自己的用户。对于每个用户，指定以下信息：
    - **name**：账户的用户名。
    - **auth_type**：账户的认证类型。可以是"no_password"、"double_sha1_password"或"sha256_password"。
    - **auth_string**：与用户账户关联的密码或认证字符串。

要生成**auth_string**，使用密码学哈希函数。以下是为提到的每种认证类型生成auth_string的方法：

- **no_password**：对于no_password认证类型，不需要密码。在这种情况下，根本不需要auth_string字段。

- **double_sha1_password**：要为double_sha1_password认证类型生成auth_string，请首先选择一个密码（例如，"databend"）。然后，运行以下命令并使用结果输出作为auth_string：

  ```shell
  echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
  ```

- **sha256_password**：要为sha256_password认证类型生成auth_string，请首先选择一个密码（例如，"databend"）。然后，运行以下命令并使用结果输出作为auth_string：

  ```shell
  echo -n "databend" | sha256sum
  ```