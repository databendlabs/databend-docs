---
title: GRANT <privilege> to SHARE
sidebar_position: 6
---

Grants privileges on a database object to a share.

## Syntax

```sql
GRANT { USAGE | SELECT | REFERENCE_USAGE } ON <object_name> TO SHARE <share_name>;
```

WHERE:

- **USAGE**: Grant the USAGE privilege on the database to which the objects you want to share belong.
- **SELECT**: Grant the SELECT privilege to the objects you want to share.
- **REFERENCE_USAGE**: If you want to share a secure view that references objects from multiple databases, grant the REFERENCE_USAGE privilege to each of the databases.

## Examples

The following examples grant the USAGE privilege on the database `db1` and the SELECT privilege on the table `table1` to the share `myshare`:

```sql
GRANT USAGE ON DATABASE db1 TO SHARE myshare;
GRANT SELECT ON TABLE db1.table1 TO SHARE myshare;
```