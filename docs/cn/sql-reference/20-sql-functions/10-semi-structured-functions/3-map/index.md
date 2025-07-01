---
title: MAP (Map) 函数
---

本节提供了 Databend 中 MAP 函数的参考信息。MAP 函数允许您创建、操作和提取 MAP 数据结构（键值对）中的信息。

## MAP 创建与合并

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_CAT](map-cat) | 将多个 MAP 合并为一个 MAP | `MAP_CAT({'a':1}, {'b':2})` → `{'a':1,'b':2}` |

## MAP 访问与信息

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_KEYS](map-keys) | 以数组形式返回 MAP 中的所有键 | `MAP_KEYS({'a':1,'b':2})` → `['a','b']` |
| [MAP_VALUES](map-values) | 以数组形式返回 MAP 中的所有值 | `MAP_VALUES({'a':1,'b':2})` → `[1,2]` |
| [MAP_SIZE](map-size) | 返回 MAP 中键值对的数量 | `MAP_SIZE({'a':1,'b':2,'c':3})` → `3` |
| [MAP_CONTAINS_KEY](map-contains-key) | 检查 MAP 是否包含指定的键 | `MAP_CONTAINS_KEY({'a':1,'b':2}, 'a')` → `TRUE` |

## MAP 修改

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_INSERT](map-insert) | 向 MAP 中插入一个键值对 | `MAP_INSERT({'a':1,'b':2}, 'c', 3)` → `{'a':1,'b':2,'c':3}` |
| [MAP_DELETE](map-delete) | 从 MAP 中移除一个键值对 | `MAP_DELETE({'a':1,'b':2,'c':3}, 'b')` → `{'a':1,'c':3}` |

## MAP 转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_TRANSFORM_KEYS](map-transform-keys) | 对 MAP 中的每个键应用一个函数 | `MAP_TRANSFORM_KEYS({'a':1,'b':2}, x -> UPPER(x))` → `{'A':1,'B':2}` |
| [MAP_TRANSFORM_VALUES](map-transform-values) | 对 MAP 中的每个值应用一个函数 | `MAP_TRANSFORM_VALUES({'a':1,'b':2}, x -> x * 10)` → `{'a':10,'b':20}` |

## MAP 筛选与选择

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_FILTER](map-filter) | 根据谓词筛选键值对 | `MAP_FILTER({'a':1,'b':2,'c':3}, (k,v) -> v > 1)` → `{'b':2,'c':3}` |
| [MAP_PICK](map-pick) | 使用指定的键创建一个新的 MAP | `MAP_PICK({'a':1,'b':2,'c':3}, ['a','c'])` → `{'a':1,'c':3}` |