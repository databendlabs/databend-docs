---
title: Fail-Safe
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='FAIL-SAFE'/>

Fail-Safe refers to mechanisms aimed at recovering lost or accidentally deleted data from object storage.

- Storage Compatibility: Currently, Fail-Safe supports only S3-compatible storage types.
- Bucket Versioning: For Fail-Safe to work, bucket versioning must be enabled. Note that data created before enabling versioning *cannot* be recovered using this method.

### Implementing Fail-Safe

Databend offers the `system$fuse_amend` table function to enable Fail-Safe recovery. This function lets you restore data from an S3-compatible storage bucket when bucket versioning is enabled.

### Usage Example

Below is a step-by-step example of using the system$fuse_amend function to recover a table's data from S3:

1. Enable versioning for the bucket `databend-doc`.

![alt text](../../../../static/img/guides/bucket-versioning.png)

2. Create an external table, storing the table data in the `fail-safe` folder in the `databend-doc` bucket.

```sql
CREATE TABLE t(a INT) 
's3://databend-doc/fail-safe/' 
CONNECTION = (access_key_id ='<your-access-key-id>' secret_access_key ='<your-secret-accesskey>');

-- Insert sample data
INSERT INTO t VALUES (1), (2), (3);
```

If you open the `fail-safe` folder in the bucket now, you can see the data is already there:

![alt text](../../../../static/img/guides/bucket-versioning-2.png)

3. Simulate data loss by creating an external stage with the same folder in the bucket, and then removing the objects from the stage.

```sql
CREATE STAGE test_fail_safe 
URL = 's3://databend-doc/fail-safe/'  
CONNECTION = (access_key_id ='<your-access-key-id>' secret_access_key ='<your-secret-accesskey>');

REMOVE @test_fail_safe e;
```

5. Attempting to query the table after removal will result in an error:

```sql
SELECT * FROM t;  -- This will throw a "NotFound" error
```

6. Recover the Table Data Using system$fuse_amend:

```sql
CALL system$fuse_amend('test_failsafe', 't');
```

7. Verify the Recovery:

```sql
SELECT SUM(a) FROM t;  -- This should now return the correct result
```
Important Notes:

Storage Compatibility: Currently, only S3-compatible storage types are supported.
API Limitations: Since OpenDAL lacks support for the list_object_versions API and retrieving objects by version ID, the AWS Rust SDK is used for implementing this feature.
Bucket Versioning: The bucket must have versioning enabled for Fail-Safe to function. Data created before versioning was enabled cannot be recovered using this method.