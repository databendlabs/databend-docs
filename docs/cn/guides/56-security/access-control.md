---
title: 访问控制
---

Databend 结合了 [基于角色的访问控制 (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control) 和 [自主访问控制 (DAC)](https://en.wikipedia.org/wiki/Discretionary_access_control) 模型来实现其访问控制功能。本指南描述了相关概念，并提供了如何在 Databend 中管理访问控制的指导。

## 基本概念

当用户在 Databend 中访问数据对象时，他们必须被授予适当的权限或角色，或者需要拥有数据对象的所有权。数据对象可以指各种元素，如数据库、表、视图、Stage 或 UDF。

![Alt text](/img/guides/access-control-1.png)

**权限** 在与 Databend 中的数据对象交互时起着至关重要的作用。这些权限，如读、写和执行，提供了对用户行为的精确控制，确保与用户需求保持一致并维护数据安全。

**角色** 简化了访问控制。角色是预定义的权限集，分配给用户，简化了权限管理。管理员可以根据职责对用户进行分类，高效地授予权限，无需逐个配置。

**所有权** 在 Databend 中是一种专门的权限，用于控制数据访问。当用户拥有数据对象时，他们拥有最高的控制级别，决定访问权限。这种直接的所有权模型使用户能够管理他们的数据，控制谁可以在 Databend 环境中访问或修改它。

## 管理权限

用户需要特定的权限才能在 Databend 中执行特定的操作。例如，要查询表，用户需要 SELECT 权限，要读取 Stage 中的数据集，需要 READ 权限。

![Alt text](/img/guides/access-control-2.png)

Databend 为不同类型的数据对象提供了不同级别的权限，允许根据用户的具体需求授予适当的权限。有关更多信息，请参阅 [访问控制权限](/sql/sql-reference/access-control-privileges)。Databend 建议谨慎行事，授予最小必要的权限以考虑安全。请根据用户的实际需求仔细评估和配置用户权限。

要管理用户或角色的权限，请使用以下命令：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

## 管理角色

在 Databend 中，角色在简化权限管理方面起着关键作用。当多个用户需要相同的一组权限时，逐个授予权限可能会很麻烦。角色提供了一个解决方案，允许将一组权限分配给一个角色，然后可以轻松地分配给多个用户。

![Alt text](/img/guides/access-control-3.png)

在使用 Databend 时，根据需要创建用户角色。要管理用户角色，请使用以下命令：

- [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role)
- [SET ROLE](/sql/sql-commands/ddl/user/user-set-role)
- [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles)
- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)

### 继承角色与建立层级

Databend 角色通过角色授予引入了一个强大的机制，使一个角色能够继承另一个角色的权限和责任。这有助于创建一个灵活的层级结构，类似于组织结构，其中存在两个[内置角色](#built-in-roles)：最高的是 `account-admin`，最低的是 `public`。

考虑这样一个场景，创建了三个角色：_manager_、_engineer_ 和 _intern_。在这个例子中，_intern_ 角色被授予给 _engineer_ 角色。因此，_engineer_ 不仅拥有他们自己的一套权限，还继承了与 _intern_ 角色相关的权限。进一步扩展这个层级，如果 _engineer_ 角色被授予给 _manager_，那么 _manager_ 现在获得了 _engineer_ 和 _intern_ 角色的固有权限。

![Alt text](/img/guides/access-control-4.png)

### 内置角色

Databend 引入了两个内置角色：

- `account-admin`：拥有所有权限，作为所有其他角色的父角色，并允许在租户内无缝切换到任何角色。
- `public`：不继承任何权限，将所有角色视为其父角色，并允许任何角色切换到公共角色。

要在 Databend Cloud 中将 `account-admin` 角色分配给用户，请在邀请用户时选择该角色。您也可以在他们加入后为用户分配角色。如果您使用的是 Databend 社区版或企业版，请在部署期间首先配置一个 `account-admin` 用户，然后根据需要将角色分配给其他用户。有关配置管理员用户的更多信息，请参阅 [配置管理员用户](/guides/deploy/admin-users)。

### 设置默认角色

当用户被授予多个角色时，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令为该用户设置默认角色。默认角色决定了用户在会话开始时自动被分配的角色：

- 用户可以在会话中使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令切换到其他角色。
- 用户可以使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令检查他们当前的角色并查看授予他们的所有角色。
- 如果您没有为用户明确设置默认角色，Databend 将默认使用内置角色 `public` 作为默认角色。

## 管理所有权

所有权是一种特殊的权限，表示角色对 Databend 中特定数据对象（当前包括数据库、表、UDF 和 Stage）的独家权利和责任。对象的所有权被分配给创建它的用户的当前角色。共享相同角色的用户也拥有该对象的所有权，并可以随后将这一所有权授予其他角色。

- 不能为 `default` 数据库中的表授予所有权，因为它由内置角色 `account_admin` 所拥有。
- 出于安全考虑，不支持将所有权授予内置角色 `public`。
- 可以将所有权授予角色，但目前还不支持将所有权授予用户。

要管理所有权，请使用以下命令：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
