---
title: system_history.login_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.764"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='LOGIN HISTORY'/>

**身份验证安全审计** - 全面记录所有用户登录尝试（包括成功和失败）。这对于以下方面至关重要：

- **安全监控**：检测暴力破解攻击和未经授权的访问尝试
- **合规审计**：跟踪用户身份验证以满足法规要求
- **访问模式分析**：监控用户访问系统的时间和方式
- **事件调查**：调查安全事件和身份验证问题

## 字段

| 字段          | 类型      | 描述                                                    |
|---------------|-----------|--------------------------------------------------------|
| event_time    | TIMESTAMP | 登录事件发生时的时间戳                                 |
| handler       | VARCHAR   | 用于登录的协议或处理程序（例如 `HTTP`）                |
| event_type    | VARCHAR   | 登录事件的类型（例如 `LoginSuccess`、`LoginFailed`）   |
| connection_uri| VARCHAR   | 用于连接的 URI                                         |
| auth_type     | VARCHAR   | 使用的身份验证方法（例如密码）                         |
| user_name     | VARCHAR   | 尝试登录的用户名称                                     |
| client_ip     | VARCHAR   | 客户端的 IP 地址                                       |
| user_agent    | VARCHAR   | 客户端的用户代理字符串                                 |
| session_id    | VARCHAR   | 与登录尝试关联的会话 ID                                |
| node_id       | VARCHAR   | 处理登录的节点 ID                                      |
| error_message | VARCHAR   | 登录失败时的错误消息                                   |

## 示例

登录成功示例：
```sql
SELECT * FROM system_history.login_history LIMIT 1;

*************************** 1. row ***************************
    event_time: 2025-06-03 06:04:57.353108
       handler: HTTP
    event_type: LoginSuccess
connection_uri: /session/login?disable_session_token=true
     auth_type: Password
     user_name: root
     client_ip: 127.0.0.1
    user_agent: bendsql/0.26.2-unknown
    session_id: 9a3ba9d8-44d9-49ca-9446-501deaca15c9
       node_id: 765ChL6Ra949Ioeb5LrTs
 error_message: 
```

登录失败示例：
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