---
title: system_history.query_history
---

Records detailed logs of all SQL query executions in Databend. For each query, two entries are generated: one when the query starts and another when it finishes. This table is valuable for monitoring query activity, auditing user actions, and analyzing performance metrics.

```sql
SELECT * FROM system_history.query_history LIMIT 2;

*************************** 1. row ***************************
                log_type: 1
           log_type_name: Start
            handler_type: HTTPQuery
               tenant_id: test_tenant
              cluster_id: test_cluster
                 node_id: CkdmtwYXLRMhJIvVzl6i11
                sql_user: root
          sql_user_quota: NULL
     sql_user_privileges: NULL
                query_id: 55758078-e85d-4fac-95fc-0203ba0d68b2
              query_kind: Query
              query_text: SELECT * FROM system_history.log_history LIMIT 1
              query_hash: e67623933f7ca8c66be47f5645f02367
query_parameterized_hash: 100446ab318d76cf2bfd2aaecff07305
              event_date: 2025-06-03
              event_time: 2025-06-03 01:32:49.864759
        query_start_time: 2025-06-03 01:32:49.843950
       query_duration_ms: 0
query_queued_duration_ms: 0
        current_database: default
            written_rows: 0
           written_bytes: 0
       join_spilled_rows: 0
      join_spilled_bytes: 0
        agg_spilled_rows: 0
       agg_spilled_bytes: 0
   group_by_spilled_rows: 0
  group_by_spilled_bytes: 0
        written_io_bytes: 0
written_io_bytes_cost_ms: 0
               scan_rows: 0
              scan_bytes: 0
           scan_io_bytes: 0
   scan_io_bytes_cost_ms: 0
         scan_partitions: 0
        total_partitions: 0
             result_rows: 0
            result_bytes: 0
  bytes_from_remote_disk: 0
   bytes_from_local_disk: 0
       bytes_from_memory: 0
          client_address: 127.0.0.1
              user_agent: bendsql/0.26.2-unknown
          exception_code: 0
          exception_text: 
          server_version: v1.2.747-nightly-1ed0ae8571(rust-1.88.0-nightly-2025-06-03T01:16:19.413296000Z)
               query_tag: 
             has_profile: NULL
       peek_memory_usage: {}
*************************** 2. row ***************************
                log_type: 2
           log_type_name: Finish
            handler_type: HTTPQuery
               tenant_id: test_tenant
              cluster_id: test_cluster
                 node_id: CkdmtwYXLRMhJIvVzl6i11
                sql_user: root
          sql_user_quota: NULL
     sql_user_privileges: NULL
                query_id: 55758078-e85d-4fac-95fc-0203ba0d68b2
              query_kind: Query
              query_text: SELECT * FROM system_history.log_history LIMIT 1
              query_hash: e67623933f7ca8c66be47f5645f02367
query_parameterized_hash: 100446ab318d76cf2bfd2aaecff07305
              event_date: 2025-06-03
              event_time: 2025-06-03 01:32:49.878900
        query_start_time: 2025-06-03 01:32:49.843950
       query_duration_ms: 34
query_queued_duration_ms: 0
        current_database: default
            written_rows: 0
           written_bytes: 0
       join_spilled_rows: 0
      join_spilled_bytes: 0
        agg_spilled_rows: 0
       agg_spilled_bytes: 0
   group_by_spilled_rows: 0
  group_by_spilled_bytes: 0
        written_io_bytes: 0
written_io_bytes_cost_ms: 0
               scan_rows: 38
              scan_bytes: 30922
           scan_io_bytes: 0
   scan_io_bytes_cost_ms: 0
         scan_partitions: 0
        total_partitions: 0
             result_rows: 1
            result_bytes: 1156
  bytes_from_remote_disk: 7580
   bytes_from_local_disk: 0
       bytes_from_memory: 0
          client_address: 127.0.0.1
              user_agent: bendsql/0.26.2-unknown
          exception_code: 0
          exception_text: 
          server_version: v1.2.747-nightly-1ed0ae8571(rust-1.88.0-nightly-2025-06-03T01:16:19.413296000Z)
               query_tag: 
             has_profile: NULL
       peek_memory_usage: {"CkdmtwYXLRMhJIvVzl6i11":571809}
```
