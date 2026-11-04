---
title: ALTER FUNCTION
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

替换现有外部函数的定义。

## 语法

```sql
ALTER FUNCTION <function_name>
    ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name>
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>'
    [ EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...) ]
    [ DESC = '<description>' ]
```

此语句提供完整的新定义，不是局部更新。参数说明见 [CREATE FUNCTION](ddl-create-function.md)。`ALTER FUNCTION` 不支持 `IF EXISTS` 或 `IF NOT EXISTS`。

## 访问控制与策略

修改 UDF 需要原有的全局 `ALTER` 权限。如果新定义引用 integration，开发者还需要每个对象的 `USAGE`。引用 integration 不会为该语句额外增加 `SUPER` 要求。

所有 integration 都必须存在且已启用。地址必须匹配规则，并通过非空的 operator `udf_server_allow_list`。Databend 在 integration 绑定的策略和远程 schema 校验之前检查权限。Arrow Flight schema 的要求不变。

新定义省略 `EXTERNAL_ACCESS_INTEGRATIONS` 时，会移除绑定，改用原有的配置 allow-list 路径。配置列表为空时，此路径拒绝访问。要保留绑定，需要在替换定义中再次指定。

## 示例

假定 `gcd` 已存在，integration `udf_access` 允许该目标，且 Flight 服务器提供兼容的 `gcd_new` handler：

```sql
ALTER FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd_new'
    ADDRESS = 'https://udf.example.com'
    EXTERNAL_ACCESS_INTEGRATIONS = (udf_access);
```

配置与传播行为见[外部访问集成](/guides/security/external-access-integration)。
