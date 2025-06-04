---
title: 映射函数（Map Functions）
---

本节提供 Databend 中映射函数（Map Functions）的参考信息。映射函数允许您创建、操作映射数据结构（键值对），并从中提取信息。

## 映射创建和组合

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_CAT](map-cat) | 将多个映射合并为单个映射 | `MAP_CAT({'a':1}, {'b':2})` → `{'a':1,'b':2}` |

## 映射访问和信息

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_KEYS](map-keys) | 返回映射中的所有键，以数组形式 | `MAP_KEYS({'a':1,'b':2})` → `['a','b']` |
| [MAP_VALUES](map-values) | 返回映射中的所有值，以数组形式 | `MAP_VALUES({'a':1,'b':2})` → `[1,2]` |
| [MAP_SIZE](map-size) | 返回映射中键值对的数量 | `MAP_SIZE({'a':1,'b':2,'c':3})` → `3` |
| [MAP_CONTAINS_KEY](map-contains-key) | 检查映射是否包含特定键 | `MAP_CONTAINS_KEY({'a':1,'b':2}, 'a')` → `TRUE` |

## 映射修改

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_INSERT](map-insert) | 向映射中插入一个键值对 | `MAP_INSERT({'a':1,'b':2}, 'c', 3)` → `{'a':1,'b':2,'c':3}` |
| [MAP_DELETE](map-delete) | 从映射中删除一个键值对 | `MAP_DELETE({'a':1,'b':2,'c':3}, 'b')` → `{'a':1,'c':3}` |

## 映射转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_TRANSFORM_KEYS](map-transform-keys) | 对映射中的每个键应用一个函数 | `MAP_TRANSFORM_KEYS({'a':1,'b':2}, x -> UPPER(x))` → `{'A':1,'B':2}` |
| [MAP_TRANSFORM_VALUES](map-transform-values) | 对映射中的每个值应用一个函数 | `MAP_TRANSFORM_VALUES({'a':1,'b':2}, x -> x * 10)` → `{'a':10,'b':20}` |

## 映射过滤和选择

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_FILTER](map-filter) | 基于谓词过滤键值对 | `MAP_FILTER({'a':1,'b':2,'c':3}, (k,v) -> v > 1)` → `{'b':2,'c':3}` |
| [MAP_PICK](map-pick) | 创建一个仅包含指定键的新映射 | `MAP_PICK({'a':1,'b':2,'c':3}, ['a','c'])` → `{'a':1,'c':3}` |