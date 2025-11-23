---
title: 集成 MCP Server
---

import DetailsWrap from '@site/src/components/DetailsWrap';

# 集成 MCP Server

[mcp-databend](https://github.com/databendlabs/mcp-databend) 是一个 MCP（Model Context Protocol）服务器，使 AI 助手能够使用自然语言直接与你的 Databend 数据库交互。

## mcp-databend 能做什么

- **execute_sql** - 执行带超时保护的 SQL 查询
- **show_databases** - 列出所有可用数据库
- **show_tables** - 列出数据库中的表（支持可选过滤）
- **describe_table** - 获取详细的表结构信息

## 构建 ChatBI 工具

本教程将展示如何使用 mcp-databend 和 Agno 框架构建对话式商业智能（Business Intelligence）工具。你将创建一个本地 Agent，能够用自然语言回答数据问题。

![Databend MCP ChatBI](@site/static/img/connect/databend-mcp-chatbi.png)

## 前置条件

开始前，你需要：

1. **Databend 数据库** - 可选择 [Databend Cloud](https://app.databend.cn)（提供免费套餐）或自托管实例
2. **DeepSeek API Key** - 从 [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) 获取

## 分步教程

### 第 1 步：配置 Databend 连接

如果还没有 Databend 数据库：

1. **注册 [Databend Cloud](https://app.databend.cn)**（免费套餐可用）
2. **创建 Warehouse 和数据库**
3. **在控制台获取连接字符串**

有关 DSN 格式和示例，参阅[连接字符串文档](https://docs.databend.cn/developer/drivers/#connection-string-dsn)。

| 部署方式           | 连接字符串示例                                                |
| ------------------ | ------------------------------------------------------------- |
| **Databend Cloud** | `databend://user:pwd@host:443/database?warehouse=wh`          |
| **自托管**         | `databend://user:pwd@localhost:8000/database?sslmode=disable` |

### 第 2 步：配置 API Key 和环境变量

设置 API Key 和数据库连接：

```bash
# 设置 DeepSeek API Key
export DEEPSEEK_API_KEY="your-deepseek-api-key"

# 设置 Databend 连接字符串
export DATABEND_DSN="your-databend-connection-string"
```

### 第 3 步：安装依赖

创建虚拟环境并安装所需包：

```bash
# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装包
pip install packaging openai agno sqlalchemy fastapi mcp-databend
```

### 第 4 步：创建 ChatBI Agent

现在创建 ChatBI Agent，它将使用 mcp-databend 与数据库交互。

创建文件 `agent.py`：

```python
from contextlib import asynccontextmanager
import os
import logging
import sys

from agno.agent import Agent
from agno.playground import Playground
from agno.storage.sqlite import SqliteStorage
from agno.tools.mcp import MCPTools
from agno.models.deepseek import DeepSeek
from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_env_vars():
    required = {
        "DATABEND_DSN": "https://docs.databend.cn/developer/drivers/#connection-string-dsn",
        "DEEPSEEK_API_KEY": "https://platform.deepseek.com/api_keys"
    }

    missing = [var for var in required if not os.getenv(var)]

    if missing:
        print("❌ 缺少环境变量：")
        for var in missing:
            print(f"  • {var}: {required[var]}")
        print("\n示例：export DATABEND_DSN='...' DEEPSEEK_API_KEY='...'")
        sys.exit(1)

    print("✅ 环境变量检查通过")

check_env_vars()

class DatabendTool:
    def __init__(self):
        self.mcp = None
        self.dsn = os.getenv("DATABEND_DSN")

    def create(self):
        env = os.environ.copy()
        env["DATABEND_DSN"] = self.dsn
        self.mcp = MCPTools(
            command="python -m mcp_databend",
            env=env,
            timeout_seconds=300
        )
        return self.mcp

    async def init(self):
        try:
            await self.mcp.connect()
            logger.info("✓ 已连接到 Databend")
            return True
        except Exception as e:
            logger.error(f"✗ Databend 连接失败：{e}")
            return False

databend = DatabendTool()

agent = Agent(
    name="ChatBI",
    model=DeepSeek(),
    tools=[],
    instructions=[
        "你是 ChatBI - 专为 Databend 打造的商业智能助手。",
        "帮助用户使用自然语言探索和分析数据。",
        "始终从探索可用数据库和表开始。",
        "将查询结果格式化为清晰易读的表格。",
        "在分析中提供见解和解释。"
    ],
    storage=SqliteStorage(table_name="chatbi", db_file="chatbi.db"),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
    show_tool_calls=True,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    tool = databend.create()
    if not await databend.init():
        logger.error("初始化 Databend 失败")
        raise RuntimeError("Databend 连接失败")

    agent.tools.append(tool)
    logger.info("ChatBI 初始化成功")

    yield

    if databend.mcp:
        await databend.mcp.close()

playground = Playground(
    agents=[agent],
    name="ChatBI with Databend",
    description="由 Databend 驱动的商业智能助手"
)

app = playground.get_app(lifespan=lifespan)

if __name__ == "__main__":
    print("🤖 正在为 Databend 启动 MCP Server")
    print("打开 http://localhost:7777 开始聊天！")
    playground.serve(app="agent:app", host="127.0.0.1", port=7777)

```

### 第 5 步：启动 ChatBI Agent

运行 Agent 启动本地服务器：

```bash
python agent.py
```

你将看到：

```
✅ 环境变量检查通过
🤖 正在为 Databend 启动 MCP Server
打开 http://localhost:7777 开始聊天！
INFO 正在 http://127.0.0.1:7777 启动 playground
INFO:     Started server process [189851]
INFO:     等待应用启动。
INFO:agent:✓ 已连接到 Databend
INFO:agent:ChatBI 初始化成功
INFO:     应用启动完成。
INFO:     Uvicorn 运行在 http://127.0.0.1:7777（按 CTRL+C 退出）
```

### 第 6 步：配置 Web 界面

为获得更佳体验，可配置 Agno 的 Web 界面：

```bash
# 创建 Agent UI
npx create-agent-ui@latest

# 出现提示时输入 'y'，然后运行：
cd agent-ui && npm run dev
```

**连接到 Agent：**

1. 打开 [http://localhost:3000](http://localhost:3000)
2. 选择 "localhost:7777" 作为端点
3. 开始提问关于数据的问题！

**试试这些查询：**

- "显示所有数据库"
- "我有哪些表？"
- "描述我的表结构"
- "运行查询显示示例数据"

## 资源

- **GitHub 仓库**: [databendlabs/mcp-databend](https://github.com/databendlabs/mcp-databend)
- **PyPI 包**: [mcp-databend](https://pypi.org/project/mcp-databend)
- **Agno 框架**: [Agno MCP](https://docs.agno.com/tools/mcp/mcp)
- **Agent UI**: [Agent UI](https://docs.agno.com/agent-ui/introduction)
