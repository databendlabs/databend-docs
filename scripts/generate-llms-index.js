const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '../build');
const site = process.env.site || 'en';
const isCN = site === 'cn';
const baseUrl = isCN ? 'https://docs.databend.cn' : 'https://docs.databend.com';

const llmsDir = path.join(buildDir, 'llms');

// Extract title and description from a .md file
function extractMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');

  const lines = content.split('\n');
  let description = '';
  let inCodeBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith(':::')) continue;
    if (trimmed.startsWith('|')) continue;
    if (trimmed.startsWith('-')) continue;
    if (trimmed.startsWith('import')) continue;
    if (trimmed.startsWith('<')) continue;
    if (trimmed.startsWith('{')) continue;
    if (/^!\[/.test(trimmed)) continue;
    description = trimmed.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    description = description.slice(0, 150);
    if (trimmed.length > 150) description += '...';
    break;
  }
  return { title, description };
}

// Check if a directory is a leaf page (only has index.html, no .md files or meaningful subdirs)
function isLeafDir(fullDir) {
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  const hasMd = entries.some(e => e.isFile() && e.name.endsWith('.md'));
  const hasSubdirs = entries.some(e => e.isDirectory());
  return !hasMd && !hasSubdirs && entries.some(e => e.name === 'index.html');
}

// Extract title from index.html
function extractTitleFromHtml(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (match) {
    // Remove site suffix like " | Databend"
    return match[1].replace(/\s*[|–-]\s*Databend.*$/i, '').trim();
  }
  return null;
}

// Get title for a subdirectory (from .md sibling, index.html, or dirname)
function getSubMeta(fullDir, parentDir, sub) {
  const indexMd = path.join(parentDir, `${sub}.md`);
  if (fs.existsSync(indexMd)) {
    return extractMeta(indexMd);
  }
  const indexHtml = path.join(fullDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    const htmlTitle = extractTitleFromHtml(indexHtml);
    if (htmlTitle) return { title: htmlTitle, description: '' };
  }
  return { title: sub.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), description: '' };
}

// Generate an index for a directory: list subdirs (as links to sub-indexes) + leaf .md files
function generateDirIndex(dir, llmsPath, title, description) {
  const fullDir = path.join(buildDir, dir);
  if (!fs.existsSync(fullDir)) return;

  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
  const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md')).map(e => e.name).sort();

  // Separate leaf dirs (pages) from branch dirs (sub-sections)
  const leafDirs = [];
  const branchDirs = [];
  for (const sub of subdirs) {
    const subFullDir = path.join(fullDir, sub);
    if (isLeafDir(subFullDir)) {
      leafDirs.push(sub);
    } else {
      branchDirs.push(sub);
    }
  }

  let content = `# ${title}\n\n> ${description}\n\n`;

  // Sub-categories (directories with deeper content)
  if (branchDirs.length > 0) {
    content += `## Sub-sections\n\n`;
    for (const sub of branchDirs) {
      const subFullDir = path.join(fullDir, sub);
      const { title: subTitle, description: subDesc } = getSubMeta(subFullDir, fullDir, sub);
      const desc = subDesc ? `: ${subDesc}` : '';
      content += `- [${subTitle}](${baseUrl}/llms/${dir}/${sub}.txt)${desc}\n`;
    }
    content += '\n';
  }

  // Leaf pages: .md files at this level + leaf directories (only index.html)
  const hasPages = mdFiles.length > 0 || leafDirs.length > 0;
  if (hasPages) {
    if (branchDirs.length > 0) content += `## Pages\n\n`;
    for (const file of mdFiles) {
      const filePath = path.join(fullDir, file);
      const { title: pageTitle, description: pageDesc } = extractMeta(filePath);
      const urlPath = `${dir}/${file.replace(/\.md$/, '')}`;
      const desc = pageDesc ? `: ${pageDesc}` : '';
      content += `- [${pageTitle}](${baseUrl}/${urlPath}.md)${desc}\n`;
    }
    for (const sub of leafDirs) {
      const subFullDir = path.join(fullDir, sub);
      const { title: pageTitle } = getSubMeta(subFullDir, fullDir, sub);
      content += `- [${pageTitle}](${baseUrl}/${dir}/${sub})\n`;
    }
  }

  // Write index file
  const outPath = path.join(llmsDir, `${dir}.txt`);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, content);

  const pageCount = mdFiles.length + leafDirs.length;
  console.log(`Generated llms/${dir}.txt (${branchDirs.length} sub-sections, ${pageCount} pages)`);

  // Recursively generate sub-indexes for branch directories only
  for (const sub of branchDirs) {
    const subFullDir = path.join(fullDir, sub);
    const { title: subTitle, description: subDesc } = getSubMeta(subFullDir, fullDir, sub);
    generateDirIndex(`${dir}/${sub}`, `${llmsPath}/${sub}`, subTitle, subDesc || subTitle);
  }
}

// Top-level sections
const topSections = [
  {
    dir: 'sql',
    title: isCN ? 'Databend SQL 参考' : 'Databend SQL Reference',
    description: isCN
      ? '完整的 SQL 参考，包括 DDL、DML、函数、数据类型、系统表和存储过程。'
      : 'Complete SQL reference including DDL, DML, functions, data types, system tables, and stored procedures.',
  },
  {
    dir: 'guides',
    title: isCN ? 'Databend 使用指南' : 'Databend Guides',
    description: isCN
      ? '涵盖云服务配置、数据加载、查询优化、安全和管理的用户指南。'
      : 'User guides covering Cloud setup, data loading, querying, performance tuning, security, and administration.',
  },
  {
    dir: 'tutorials',
    title: isCN ? 'Databend 教程' : 'Databend Tutorials',
    description: isCN
      ? '常见场景的分步教程，如数据导入、CDC、BI 工具连接等。'
      : 'Step-by-step tutorials for common use cases like data ingestion, CDC, and connecting BI tools.',
  },
  {
    dir: 'developer',
    title: isCN ? 'Databend 开发者' : 'Databend Developer',
    description: isCN
      ? '开发者文档，包括 API、SDK、架构内部实现和贡献指南。'
      : 'Developer documentation including APIs, SDKs, architecture internals, and contribution guides.',
  },
];

// Clean llms directory
if (fs.existsSync(llmsDir)) fs.rmSync(llmsDir, { recursive: true });
fs.mkdirSync(llmsDir, { recursive: true });

// Generate section indexes recursively
for (const section of topSections) {
  generateDirIndex(section.dir, section.dir, section.title, section.description);
}

// Generate top-level llms.txt
const llmsTxt = isCN
  ? `# Databend

> Databend 是基于对象存储（S3/GCS/Azure Blob）构建的云原生数据仓库，支持实时分析、SQL 驱动的 ETL 以及 AI/ML 工作流集成。

Databend Cloud 是托管服务。自部署请参考指南部分。

## 文档

- [SQL 参考](${baseUrl}/llms/sql.txt): 完整的 SQL 参考，包括 DDL、DML、函数、数据类型、系统表和存储过程。
- [使用指南](${baseUrl}/llms/guides.txt): 涵盖云服务配置、数据加载、查询优化、安全和管理的用户指南。
- [教程](${baseUrl}/llms/tutorials.txt): 常见场景的分步教程，如数据导入、CDC、BI 工具连接等。
- [开发者](${baseUrl}/llms/developer.txt): 开发者文档，包括 API、SDK、架构内部实现和贡献指南。

## 快速链接

- [快速开始](${baseUrl}/guides/cloud/getting-started.md): Databend Cloud 快速入门
- [SQL 函数](${baseUrl}/sql/sql-functions.md): 所有内置函数
- [数据加载](${baseUrl}/guides/load-data.md): 从文件、Stage 和 Stream 加载数据
- [连接](${baseUrl}/guides/connect.md): 驱动、SQL 客户端和 BI 工具集成
- [AI 函数](${baseUrl}/guides/ai-functions.md): 内置 AI/ML 能力和 MCP 集成

## 故障排查（重要）

当需要诊断 Databend 问题时，请先阅读此部分。基于 system_history 系统表进行问题定位。

- [故障排查入口](${baseUrl}/guides/diagnose.md): 慢查询、失败查询、资源异常、数据审计、登录问题的诊断指南
`
  : `# Databend

> Databend is a cloud-native data warehouse built on object storage (S3/GCS/Azure Blob). It supports real-time analytics, SQL-driven ETL, and seamless integration with AI/ML workflows.

Databend Cloud is the managed service. For self-hosted deployment, see the Guides section.

## Docs

- [SQL Reference](${baseUrl}/llms/sql.txt): Complete SQL reference including DDL, DML, functions, data types, system tables, and stored procedures.
- [Guides](${baseUrl}/llms/guides.txt): User guides covering Cloud setup, data loading, querying, performance tuning, security, and administration.
- [Tutorials](${baseUrl}/llms/tutorials.txt): Step-by-step tutorials for common use cases like data ingestion, CDC, and connecting BI tools.
- [Developer](${baseUrl}/llms/developer.txt): Developer documentation including APIs, SDKs, architecture internals, and contribution guides.

## Quick Links

- [Getting Started](${baseUrl}/guides/cloud/getting-started.md): Quick start with Databend Cloud
- [SQL Functions](${baseUrl}/sql/sql-functions.md): All built-in functions
- [Data Loading](${baseUrl}/guides/load-data.md): Load data from files, stages, and streams
- [Connect](${baseUrl}/guides/connect.md): Drivers, SQL clients, and BI tool integrations
- [AI Functions](${baseUrl}/guides/ai-functions.md): Built-in AI/ML capabilities and MCP integration

## Troubleshooting (Important)

When diagnosing Databend issues, start here. Uses system_history tables for root cause analysis.

- [Troubleshooting Guide](${baseUrl}/guides/diagnose.md): Diagnose slow queries, failed queries, resource issues, data audit, and login problems
`;

fs.writeFileSync(path.join(buildDir, 'llms.txt'), llmsTxt);
console.log(`\nGenerated llms.txt (${isCN ? 'cn' : 'en'})`);
