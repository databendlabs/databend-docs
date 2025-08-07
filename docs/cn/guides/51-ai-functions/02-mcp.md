# 适用于 Databend 的 MCP 服务器

[mcp-databend](https://github.com/databendlabs/mcp-databend) 是一个 MCP（Model Context Protocol，模型上下文协议）服务器，它让 AI 助手能够使用自然语言直接与你的 Databend 数据库交互。

## mcp-databend 能做什么

- **execute_sql** - 执行 SQL 查询，并带有超时保护
- **show_databases** - 列出所有可用数据库
- **show_tables** - 列出数据库中的表（支持可选过滤）
- **describe_table** - 获取详细的表结构信息

## 构建 ChatBI 工具

本教程将演示如何使用 mcp-databend 和 Agno 框架构建一个对话式商业智能（Business Intelligence）工具。你将创建一个本地代理，能够用自然语言回答数据问题。

## 分步教程

### 步骤 1：配置 Databend 连接

首先，你需要一个可连接的 Databend 数据库：

1. **注册 [Databend Cloud](https://app.databend.cn)**（提供免费套餐）
2. **创建计算集群（Warehouse）和数据库**
3. **在控制台获取连接字符串**

有关 DSN 格式和示例的详细信息，请参阅[连接字符串文档](https://docs.databend.cn/developer/drivers/#connection-string-dsn)。

| 部署方式 | 连接字符串示例 |
|------------|---------------------------|
| **Databend Cloud** | `databend://user:pwd@host:443/database?warehouse=wh` |
| **自托管** | `databend://user:pwd@localhost:8000/database?sslmode=disable` |

### 步骤 2：安装依赖

创建虚拟环境并安装所需包：

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install packages
pip install packaging openai agno openrouter sqlalchemy fastapi mcp-databend
```

### 步骤 3：创建 ChatBI 代理

现在创建 ChatBI 代理，它将使用 mcp-databend 与数据库交互。

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
from agno.models.openrouter import OpenRouter
from fastapi import FastAPI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_env_vars():
    """Check required environment variables"""
    required = {
        "DATABEND_DSN": "https://docs.databend.cn/developer/drivers/#connection-string-dsn",
        "OPENROUTER_API_KEY": "https://openrouter.ai/settings/keys"
    }
    
    missing = [var for var in required if not os.getenv(var)]
    
    if missing:
        print("❌ Missing environment variables:")
        for var in missing:
            print(f"  • {var}: {required[var]}")
        print("\nExample: export DATABEND_DSN='...' OPENROUTER_API_KEY='...'")
        sys.exit(1)
    
    print("✅ Environment variables OK")

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
            logger.info("✓ Connected to Databend")
            return True
        except Exception as e:
            logger.error(f"✗ Databend connection failed: {e}")
            return False

databend = DatabendTool()

agent = Agent(
    name="ChatBI",
    model=OpenRouter(
        id=os.getenv("MODEL_ID", "anthropic/claude-sonnet-4"),
        api_key=os.getenv("OPENROUTER_API_KEY")
    ),
    tools=[],
    instructions=[
        "You are ChatBI - a Business Intelligence assistant for Databend.",
        "Help users explore and analyze their data using natural language.",
        "Always start by exploring available databases and tables.",
        "Format query results in clear, readable tables.",
        "Provide insights and explanations with your analysis."
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
        logger.error("Failed to initialize Databend")
        raise RuntimeError("Databend connection failed")
    
    agent.tools.append(tool)
    logger.info("ChatBI initialized successfully")
    
    yield
    
    if databend.mcp:
        await databend.mcp.close()

playground = Playground(
    agents=[agent],
    name="ChatBI with Databend",
    description="Business Intelligence Assistant powered by Databend"
)

app = playground.get_app(lifespan=lifespan)

if __name__ == "__main__":
    print("🤖 Starting MCP Server for Databend")
    print("Open http://localhost:7777 to start chatting!")
    playground.serve(app="agent:app", host="127.0.0.1", port=7777)
```

### 步骤 4：配置环境

设置 API 密钥和数据库连接：

```bash
# Set your OpenRouter API key
export OPENROUTER_API_KEY="your-openrouter-key"

# Set your Databend connection string
export DATABEND_DSN="your-databend-connection-string"
```

### 步骤 5：启动 ChatBI 代理

运行代理以启动本地服务器：

```bash
python agent.py
```

你应该会看到：
```
✅ Environment variables OK
🤖 Starting MCP Server for Databend
Open http://localhost:7777 to start chatting!
INFO Starting playground on http://127.0.0.1:7777                                                                                                                                          
INFO:     Started server process [189851]
INFO:     Waiting for application startup.
INFO:agent:✓ Connected to Databend
INFO:agent:ChatBI initialized successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:7777 (Press CTRL+C to quit)
```

### 步骤 6：设置 Web 界面

为获得更佳体验，可配置 Agno 的 Web 界面：

```bash
# Create the Agent UI
npx create-agent-ui@latest

# Enter 'y' when prompted, then run:
cd agent-ui && npm run dev
```

**连接到代理：**
1. 打开 [http://localhost:3000](http://localhost:3000)
2. 选择 "localhost:7777" 作为端点
3. 开始用自然语言提问数据问题！

**试试这些查询：**
- "Show me all databases"
- "What tables do I have?"
- "Describe the structure of my tables"
- "Run a query to show sample data"

## 资源

- **GitHub 仓库**：[databendlabs/mcp-databend](https://github.com/databendlabs/mcp-databend)
- **PyPI 包**：[mcp-databend](https://pypi.org/project/mcp-databend)
- **Agno 框架**：[Agno MCP](https://docs.agno.com/tools/mcp/mcp)
- **Agent UI**：[Agent UI](https://docs.agno.com/agent-ui/introduction)