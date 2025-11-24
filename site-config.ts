import XSvg from './static/icons/x';
export const siteConfig = {
  zh: {
    homeLink: 'https://www.databend.cn',
    iconLink: '/guides/',
    cloudLink: 'https://app.databend.cn',
    docsHomeLink: 'https://docs.databend.cn',
    algolia: {
      askAi: 'oZ2gEdzflDvN',
      appId: "FUCSAUXK2Q",
      apiKey: "0f200c10999f19584ec9e31b5caa9065",
      indexName: "databend",
      contextualSearch: true
    },
    trackingID: "G-M88HSQF3DK"
  },
  en: {
    homeLink: 'https://www.databend.com',
    iconLink: '/guides/',
    cloudLink: 'https://app.databend.com',
    docsHomeLink: 'https://docs.databend.com',
    algolia: {
      askAi: 'f2nql6AG9fqs',
      appId: "XA8ZCKIEYU",
      apiKey: "81e5ee11f82ed1c5de63ef7ea0551abf",
      indexName: "databend",
      contextualSearch: false
    },
    trackingID: "G-KYDJ7HV75X"
  }
}

export const ASKBEND_URL = "https://ask.databend.com";

export const tagline = "Databend - Your best alternative to Snowflake. Cost-effective and simple for massive-scale analytics."

export const announcementBarContent = `⭐️ If you like Databend, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/databendlabs/databend">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://x.com/DatabendLabs" >X(Twitter)</a> ${XSvg}`
