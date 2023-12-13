---
title: "Analyzing Anonymous Click Dataset"
slug: /
---

In this tutorial, you will import an anonymous click traffic dataset into Databend Cloud, and do some simple queries and analysis. Before starting, please make sure you have successfully registered and logged into your Databend Cloud account.

The "hits_v1" dataset is sourced from the ClickBench ranking and consists of 100 million rows of data with a volume of 7.5 GB. It is real user click data that has been anonymized and reflects real user behavior for analysis.

This dataset is already built-in in Databend Cloud. You can import it with just one click without manually creating any table. The table schema is as follows:

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

## Step 1. Load Data with One Click

1. On the Home page, click **Load Data**:

![Alt text](@site/static/img/documents/getting-started/t1-2.png)

2. Select **Anonymized Web Analytics Data.TSV (7.5G)**, then click **Next**:

![Alt text](@site/static/img/documents/getting-started/t2-2.png)

3. Databend Cloud automatically creates data tables for built-in datasets, so there is no need to manually create tables when importing built-in datasets. Please select a compute cluster to perform the import and then click **Confirm**:

![Alt text](@site/static/img/documents/getting-started/t2-3.png)

You can see prompts about the data import in progress:

![Alt text](@site/static/img/documents/getting-started/t2-4.png)

Please be patient as this dataset is quite large. Generally, a Small warehouse can complete the import in about thirteen minutes, and using a bigger one can accelerate the data import. After the import is complete, you can access the **Data** page to find the target table and view its information:

![Alt text](@site/static/img/documents/getting-started/t2-5.png)

## Step 2. Analyzing Dataset

1. Copy and paste the following SQL statements to the editor of a worksheet:

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

2. Click to select one of the statements, then click **Run Script**:

![Alt text](@site/static/img/documents/getting-started/t2-6.png)