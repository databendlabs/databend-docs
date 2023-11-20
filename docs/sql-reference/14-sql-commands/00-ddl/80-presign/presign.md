---
title: PRESIGN
description:
  Generates the pre-signed URL for a staged file.
---

Generate the pre-signed URL for a staged file by the stage name and file path you provide. The pre-signed URL enables you to access the file through a web browser or an API request.

:::tip
This command currently works with files stored at Amazon S3 only.
:::

See also: [Presign](/doc/contributing/rfcs/presign)

## Syntax

```sql
PRESIGN [ { DOWNLOAD | UPLOAD }] @<stage_name>/.../<file_name> [ EXPIRE = <expire_in_seconds> ]
```
Where：

`[ { DOWNLOAD | UPLOAD }]`: Specifies that the pre-signed URL is used for download or upload. The default value is `DOWNLOAD`.

`[ EXPIRE = <expire_in_seconds> ]`: Specifies the length of time (in seconds) after which the pre-signed URL expires. The default value is 3,600 seconds.

## Examples

### Generating and Using Pre-signed URLs for Download

This example generates the pre-signed URL for downloading the file `books.csv` on the stage `my-stage`:

```sql
PRESIGN @my_stage/books.csv
+--------+---------+---------------------------------------------------------------------------------+
| method | headers | url                                                                             |
+--------+---------+---------------------------------------------------------------------------------+
| GET    | {}      | https://example.s3.amazonaws.com/books.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&... |
+--------+---------+---------------------------------------------------------------------------------+
```

This example functions in the same way as the preceding one:

```sql
PRESIGN DOWNLOAD @my_stage/books.csv
```

To download the file with the pre-signed URL and save it as `books.csv`, execute the following command:

```bash
curl <presigned-url> -o books.csv  
```

This example generates the pre-signed URL that expires in 7,200 seconds (2 hours):

```sql
PRESIGN @my_stage/books.csv EXPIRE = 7200
```

### Generating and Using Pre-signed URLs for Upload

This example generates the pre-signed URL for uploading a file as `books.csv` to the stage `my_stage`:

```sql
PRESIGN UPLOAD @my_stage/books.csv
```

To upload the file `books.csv` with the pre-signed URL, execute the following command:

```bash
curl -X PUT -T books.csv <presigned-url>
```