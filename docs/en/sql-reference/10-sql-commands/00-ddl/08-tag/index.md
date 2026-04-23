---
title: Tag
---

Tags let you attach key-value metadata to Databend objects for data governance, classification, and compliance tracking. You can define tags with optional allowed values, assign them to objects, and query tag assignments through the TAG_REFERENCES table function.

## Tag Management

| Command | Description |
|---------|-------------|
| [CREATE TAG](01-ddl-create-tag.md) | Creates a new tag with optional allowed values and comment |
| [DROP TAG](02-ddl-drop-tag.md) | Removes a tag (must have no active references) |
| [SHOW TAGS](03-ddl-show-tags.md) | Lists tag definitions |

## Tag Assignment

| Command | Description |
|---------|-------------|
| [SET TAG / UNSET TAG](04-ddl-set-tag.md) | Assigns or removes tags on database objects |
| [TAG_REFERENCES](/sql/sql-functions/table-functions/tag-references) | Queries tag assignments on a specific object |
