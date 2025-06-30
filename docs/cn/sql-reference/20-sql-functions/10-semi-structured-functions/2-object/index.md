---
title: 对象函数
---

本节提供 Databend 中对象函数的参考信息。对象函数支持对 JSON 对象数据结构进行创建、操作和信息提取。

## 对象构造

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [OBJECT_CONSTRUCT](object-construct) | 根据键值对创建 JSON 对象 | `OBJECT_CONSTRUCT('name', 'John', 'age', 30)` → `{"name":"John","age":30}` |
| [OBJECT_CONSTRUCT_KEEP_NULL](object-construct-keep-null) | 创建 JSON 对象并保留空值 | `OBJECT_CONSTRUCT_KEEP_NULL('a', 1, 'b', null)` → `{"a":1,"b":null}` |

## 对象信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [OBJECT_KEYS](object-keys) | 以数组形式返回 JSON 对象中的所有键 | `OBJECT_KEYS({"name":"John","age":30})` → `["name","age"]` |

## 对象修改

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [OBJECT_INSERT](object-insert) | 在 JSON 对象中插入或更新键值对 | `OBJECT_INSERT({"name":"John"}, "age", 30)` → `{"name":"John","age":30}` |
| [OBJECT_DELETE](object-delete) | 从 JSON 对象中移除键值对 | `OBJECT_DELETE({"name":"John","age":30}, "age")` → `{"name":"John"}` |

## 对象选择

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [OBJECT_PICK](object-pick) | 创建仅包含指定键的新对象 | `OBJECT_PICK({"a":1,"b":2,"c":3}, ["a","c"])` → `{"a":1,"c":3}` |