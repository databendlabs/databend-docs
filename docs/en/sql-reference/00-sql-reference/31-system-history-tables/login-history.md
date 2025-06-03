---
title: system_history.login_history
---

Records all login attempts in the system, including successful and failed login attempts. This table is useful for auditing user access and troubleshooting authentication issues.

Login successful example:
```sql
SELECT * FROM system_history.login_history LIMIT 1;

*************************** 1. row ***************************
    event_time: 2025-06-03 06:04:57.353108
       handler: HTTP
    event_type: LoginSuccess
connection_uri: /query
     auth_type: Password
     user_name: root
     client_ip: 127.0.0.1
    user_agent: bendsql/0.26.2-unknown
    session_id: 9a3ba9d8-44d9-49ca-9446-501deaca15c9
       node_id: 765ChL6Ra949Ioeb5LrTs
 error_message: 
```

Login failed example:
```sql
SELECT * FROM system_history.login_history LIMIT 1;

*************************** 1. row ***************************
    event_time: 2025-06-03 06:07:32.512021
       handler: MySQL
    event_type: LoginFailed
connection_uri: 
     auth_type: Password
     user_name: root1
     client_ip: 127.0.0.1:62050
    user_agent: 
    session_id: 4fb87258-865a-402c-8680-e3be1e01b4e6
       node_id: 765ChL6Ra949Ioeb5LrTs
 error_message: UnknownUser. Code: 2201, Text = User 'root1'@'%' does not exist..
```