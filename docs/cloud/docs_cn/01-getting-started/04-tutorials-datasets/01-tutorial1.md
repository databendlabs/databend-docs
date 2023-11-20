---
title: "分析匿名点击数据集"
---

在本教程中，您将在 Databend Cloud 导入一份匿名的 Web 流量数据集，并做一些简单的查询和分析。在开始之前，请确保您已成功注册和登录 Databend Cloud 账号，详细步骤请参考[开通 Databend Cloud](../00-activate.md)。

匿名用户点击数据集（hits_v1）是 ClickBench 榜单中使用的数据集，它的体积有 7.5 GB，内部包含有 1 亿行数据。它是脱敏后的真实用户点击数据，反映真实的用户行为分析场景。

该数据集对应的表结构如下：

```sql
  CREATE TABLE IF NOT EXISTS hits_100m_obfuscated_v1 (
    WatchID BIGINT NOT NULL,
    JavaEnable SMALLINT NOT NULL,
    Title VARCHAR NOT NULL,
    GoodEvent SMALLINT NOT NULL,
    EventTime TIMESTAMP NOT NULL,
    EventDate Date NOT NULL,
    CounterID INTEGER NOT NULL,
    ClientIP INTEGER NOT NULL,
    RegionID INTEGER NOT NULL,
    UserID BIGINT NOT NULL,
    CounterClass SMALLINT NOT NULL,
    OS SMALLINT NOT NULL,
    UserAgent SMALLINT NOT NULL,
    URL VARCHAR NOT NULL,
    Referer VARCHAR NOT NULL,
    IsRefresh SMALLINT NOT NULL,
    RefererCategoryID SMALLINT NOT NULL,
    RefererRegionID INTEGER NOT NULL,
    URLCategoryID SMALLINT NOT NULL,
    URLRegionID INTEGER NOT NULL,
    ResolutionWidth SMALLINT NOT NULL,
    ResolutionHeight SMALLINT NOT NULL,
    ResolutionDepth SMALLINT NOT NULL,
    FlashMajor SMALLINT NOT NULL,
    FlashMinor SMALLINT NOT NULL,
    FlashMinor2 VARCHAR NOT NULL,
    NetMajor SMALLINT NOT NULL,
    NetMinor SMALLINT NOT NULL,
    UserAgentMajor SMALLINT NOT NULL,
    UserAgentMinor VARCHAR(255) NOT NULL,
    CookieEnable SMALLINT NOT NULL,
    JavascriptEnable SMALLINT NOT NULL,
    IsMobile SMALLINT NOT NULL,
    MobilePhone SMALLINT NOT NULL,
    MobilePhoneModel VARCHAR NOT NULL,
    Params VARCHAR NOT NULL,
    IPNetworkID INTEGER NOT NULL,
    TraficSourceID SMALLINT NOT NULL,
    SearchEngineID SMALLINT NOT NULL,
    SearchPhrase VARCHAR NOT NULL,
    AdvEngineID SMALLINT NOT NULL,
    IsArtifical SMALLINT NOT NULL,
    WindowClientWidth SMALLINT NOT NULL,
    WindowClientHeight SMALLINT NOT NULL,
    ClientTimeZone SMALLINT NOT NULL,
    ClientEventTime TIMESTAMP NOT NULL,
    SilverlightVersion1 SMALLINT NOT NULL,
    SilverlightVersion2 SMALLINT NOT NULL,
    SilverlightVersion3 INTEGER NOT NULL,
    SilverlightVersion4 SMALLINT NOT NULL,
    PageCharset VARCHAR NOT NULL,
    CodeVersion INTEGER NOT NULL,
    IsLink SMALLINT NOT NULL,
    IsDownload SMALLINT NOT NULL,
    IsNotBounce SMALLINT NOT NULL,
    FUniqID BIGINT NOT NULL,
    OriginalURL VARCHAR NOT NULL,
    HID INTEGER NOT NULL,
    IsOldCounter SMALLINT NOT NULL,
    IsEvent SMALLINT NOT NULL,
    IsParameter SMALLINT NOT NULL,
    DontCounthits_100m_obfuscated_v1 SMALLINT NOT NULL,
    WithHash SMALLINT NOT NULL,
    HitColor VARCHAR NOT NULL,
    LocalEventTime TIMESTAMP NOT NULL,
    Age SMALLINT NOT NULL,
    Sex SMALLINT NOT NULL,
    Income SMALLINT NOT NULL,
    Interests SMALLINT NOT NULL,
    Robotness SMALLINT NOT NULL,
    RemoteIP INTEGER NOT NULL,
    WindowName INTEGER NOT NULL,
    OpenerName INTEGER NOT NULL,
    HistoryLength SMALLINT NOT NULL,
    BrowserLanguage VARCHAR NOT NULL,
    BrowserCountry VARCHAR NOT NULL,
    SocialNetwork VARCHAR NOT NULL,
    SocialAction VARCHAR NOT NULL,
    HTTPError SMALLINT NOT NULL,
    SendTiming INTEGER NOT NULL,
    DNSTiming INTEGER NOT NULL,
    ConnectTiming INTEGER NOT NULL,
    ResponseStartTiming INTEGER NOT NULL,
    ResponseEndTiming INTEGER NOT NULL,
    FetchTiming INTEGER NOT NULL,
    SocialSourceNetworkID SMALLINT NOT NULL,
    SocialSourcePage VARCHAR NOT NULL,
    ParamPrice BIGINT NOT NULL,
    ParamOrderID VARCHAR NOT NULL,
    ParamCurrency VARCHAR NOT NULL,
    ParamCurrencyID SMALLINT NOT NULL,
    OpenstatServiceName VARCHAR NOT NULL,
    OpenstatCampaignID VARCHAR NOT NULL,
    OpenstatAdID VARCHAR NOT NULL,
    OpenstatSourceID VARCHAR NOT NULL,
    UTMSource VARCHAR NOT NULL,
    UTMMedium VARCHAR NOT NULL,
    UTMCampaign VARCHAR NOT NULL,
    UTMContent VARCHAR NOT NULL,
    UTMTerm VARCHAR NOT NULL,
    FromTag VARCHAR NOT NULL,
    HasGCLID SMALLINT NOT NULL,
    RefererHash BIGINT NOT NULL,
    URLHash BIGINT NOT NULL,
    CLID INTEGER NOT NULL
  );
```

在本教程中，我们将利用 Databend Cloud 的内置数据导入功能进行数据导入，无需手工创建表结构。

## 第一步：一键导入数据

Databend Cloud 内置了这份数据集，支持一键导入。

1. 打开首页，点击“导入数据”：

![Alt text](@site/static/img/documents_cn/getting-started/t2-1.png)

2. 选择“Anonymized Web Analytics Data.TSV (7.5G)”后，点击“下一步”：

![Alt text](@site/static/img/documents_cn/getting-started/t2-2.png)

3. Databend Cloud 自动为内置数据集创建数据表，所以导入内置数据集时无需手动创建表格。这里请选择一个执行导入的计算集群，然后点击"确认"：

![Alt text](@site/static/img/documents_cn/getting-started/t2-3.png)

此时可以看到数据导入在执行中的信息提示：

![Alt text](@site/static/img/documents_cn/getting-started/t2-4.png)

该数据集较大，请耐心等待。一般 Small 规格的计算集群可在十三分钟左右导入完毕，提高计算集群规格可加速数据导入。导入完毕后，可以访问数据管理页找到目标表查看数据表信息：

![Alt text](@site/static/img/documents_cn/getting-started/t2-5.png)

## 第二步：分析数据

1. 新建工作区，复制并粘贴下述 SQL：

```sql
-- Q1
SELECT COUNT(*) FROM hits_100m_obfuscated_v1;

-- Q2
SELECT COUNT(*) FROM hits_100m_obfuscated_v1 WHERE AdvEngineID <> 0;

-- Q3
SELECT SUM(AdvEngineID), COUNT(*), AVG(ResolutionWidth) FROM hits_100m_obfuscated_v1;

-- Q4
SELECT AVG(UserID) FROM hits_100m_obfuscated_v1;

-- Q5
SELECT COUNT(DISTINCT UserID) FROM hits_100m_obfuscated_v1;

-- Q6
SELECT COUNT(DISTINCT SearchPhrase) FROM hits_100m_obfuscated_v1;

-- Q7
SELECT MIN(EventDate), MAX(EventDate) FROM hits_100m_obfuscated_v1;

-- Q8
SELECT AdvEngineID, COUNT(*) FROM hits_100m_obfuscated_v1 WHERE AdvEngineID <> 0 GROUP BY AdvEngineID ORDER BY COUNT(*) DESC;

-- Q9
SELECT RegionID, COUNT(DISTINCT UserID) AS u FROM hits_100m_obfuscated_v1 GROUP BY RegionID ORDER BY u DESC LIMIT 10;

-- Q10
SELECT RegionID, SUM(AdvEngineID), COUNT(*) AS c, AVG(ResolutionWidth), COUNT(DISTINCT UserID) FROM hits_100m_obfuscated_v1 GROUP BY RegionID ORDER BY c DESC LIMIT 10;

-- Q11
SELECT MobilePhoneModel, COUNT(DISTINCT UserID) AS u FROM hits_100m_obfuscated_v1 WHERE MobilePhoneModel <> '' GROUP BY MobilePhoneModel ORDER BY u DESC LIMIT 10;

-- Q12
SELECT MobilePhone, MobilePhoneModel, COUNT(DISTINCT UserID) AS u FROM hits_100m_obfuscated_v1 WHERE MobilePhoneModel <> '' GROUP BY MobilePhone, MobilePhoneModel ORDER BY u DESC LIMIT 10;
```

2. 点击选中其中一条 SQL，然后点击"运行"。比如执行 Q10：

![Alt text](@site/static/img/documents_cn/getting-started/t2-6.png)
