import DetailsWrap from '@site/src/components/DetailsWrap';

# 适用于 Databend 的 MCP 服务器

[mcp-databend](https://github.com/databendlabs/mcp-databend) 是一个 MCP（Model Context Protocol，模型上下文协议）服务器，它让 AI 助手能够使用自然语言直接与你的 Databend 数据库交互。

## mcp-databend 能做什么

- **execute_sql** - 执行带超时保护的 SQL 查询
- **show_databases** - 列出所有可用数据库
- **show_tables** - 列出数据库中的表（支持可选过滤）
- **describe_table** - 获取详细的表结构信息

## 构建 ChatBI 工具

本教程将演示如何使用 mcp-databend 和 Agno 框架构建对话式商业智能（Business Intelligence，BI）工具。你将创建一个本地 Agent，能够用自然语言回答数据问题。

![Databend MCP ChatBI](@site/static/img/connect/databend-mcp-chatbi.png)

## 分步教程

### 步骤 1：配置 Databend 连接

首先，你需要一个可连接的 Databend 数据库：

1. **注册 [Databend Cloud](https://app.databend.cn)**（提供免费套餐）
2. **创建 Warehouse 和数据库**
3. **在控制台获取连接字符串**

有关 DSN 格式和示例的详细信息，请参阅 [连接字符串文档](https://docs.databend.cn/developer/drivers/#connection-string-dsn)。

| 部署方式           | 连接字符串示例                                                |
| ------------------ | ------------------------------------------------------------- |
| **Databend Cloud** | `databend://user:pwd@host:443/database?warehouse=wh`          |
| **自托管**         | `databend://user:pwd@localhost:8000/database?sslmode=disable` |

### 步骤 2：安装依赖

创建虚拟环境并安装所需包：

```bash
# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装包
pip install packaging openai agno openrouter sqlalchemy fastapi mcp-databend
```

### 步骤 3：创建 ChatBI Agent

现在创建 ChatBI Agent，它将使用 mcp-databend 与数据库交互。

创建文件 `agent.py`：
<DetailsWrap>

<details>
<summary>点击查看 agent.py 代码</summary>

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
    """检查必需的环境变量"""
    required = {
        "DATABEND_DSN": "https://docs.databend.cn/developer/drivers/#connection-string-dsn",
        "OPENROUTER_API_KEY": "https://openrouter.ai/settings/keys"
    }

    missing = [var for var in required if not os.getenv(var)]

    if missing:
        print("❌ 缺少环境变量：")
        for var in missing:
            print(f"  • {var}: {required[var]}")
        print("\n示例：export DATABEND_DSN='...' OPENROUTER_API_KEY='...'")
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
    model=OpenRouter(
        id=os.getenv("MODEL_ID", "anthropic/claude-sonnet-4"),
        api_key=os.getenv("OPENROUTER_API_KEY")
    ),
    tools=[],
    instructions=[
        "你是 ChatBI —— Databend 的商业智能助手。",
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
    print("🤖 正在为 Databend 启动 MCP 服务器")
    print("打开 http://localhost:7777 开始聊天！")
    playground.serve(app="agent:app", host="127.0.0.1", port=7777)
```

</details>
</DetailsWrap>

### 步骤 4：配置环境

设置 API 密钥和数据库连接：

```bash
# 设置 OpenRouter API 密钥
export OPENROUTER_API_KEY="your-openrouter-key"

# 设置 Databend 连接字符串
export DATABEND_DSN="your-databend-connection-string"
```

### 步骤 5：启动 ChatBI Agent

运行 Agent 启动本地服务器：

```bash
python agent.py
```

你将看到：

```
✅ 环境变量检查通过
🤖 正在为 Databend 启动 MCP 服务器
打开 http://localhost:7777 开始聊天！
INFO Starting playground on http://127.0.0.1:7777
INFO:     Started server process [189851]
INFO:     Waiting for application startup.
INFO:agent:✓ 已连接到 Databend
INFO:agent:ChatBI 初始化成功
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:7777 (Press CTRL+C to quit)
```

### 步骤 6：设置 Web 界面

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
3. 开始提问你的数据！

**试试这些查询：**

- "显示所有数据库"
- "我有哪些表？"
- "描述我的表结构"
- "运行查询展示示例数据"

## 资源

- **GitHub 仓库**： [databendlabs/mcp-databend](https://github.com/databendlabs/mcp-databend)
- **PyPI 包**： [mcp-databend](https://pypi.org/project/mcp-databend)
- **Agno 框架**： [Agno MCP](https://docs.agno.com/tools/mcp/mcp)
- **Agent UI**： [Agent UI](https://docs.agno.com/agent-ui/introduction)