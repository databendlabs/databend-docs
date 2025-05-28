import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const { site } = process.env;
const isCN = (site || "cn") === "cn";
const lang = isCN ? "zh" : "en";

const homeLink = isCN ? "https://www.databend.cn" : "https://www.databend.com";
const cloudLink = isCN ? "https://app.databend.cn" : "https://app.databend.com";
const docsHomeLink = isCN
  ? "https://docs.databend.cn"
  : "https://docs.databend.com";
const TwitterSvg =
  '<svg width="20" style="top: 5px; position: relative" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>';

const { site_env } = process.env;
const isProduction = site_env === "production";
const ASKBEND_URL = "https://ask.databend.com";
const algolia = isCN
  ? {
    appId: "FUCSAUXK2Q",
    apiKey: "0f200c10999f19584ec9e31b5caa9065",
    indexName: "databend",
    contextualSearch: true
  }
  : {
    appId: "XA8ZCKIEYU",
    apiKey: "81e5ee11f82ed1c5de63ef7ea0551abf",
    indexName: "databend",
    contextualSearch: false
  };

const config: Config = {
  title: "Databend",
  staticDirectories: ["static", "./docs/public"],
  tagline:
    "Databend - Your best alternative to Snowflake. Cost-effective and simple for massive-scale analytics.",
  url: docsHomeLink,
  baseUrl: "/",
  onBrokenAnchors: "ignore",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/rect-icon.png",
  organizationName: "DatabendLabs",
  projectName: 'Databend', // Usually your repo name.
  future: {
    experimental_faster: true,
  },
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: lang,
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        label: "English",
      },
      zh: {
        label: "中文",
      },
    },
  },
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "mask-icon",
        sizes: "any",
        color: "#0175f6",
        href: "/img/logo/logo-no-text.svg",
      },
    },
  ],
  customFields: {
    isChina: isCN,
    docsHomeLink,
    homeLink,
    cloudLink,
    blogTags: ["weekly", "databend"],
    askBendUrl: isProduction ? ASKBEND_URL : "",
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: `./docs/${site}/guides`,
          routeBasePath: "guides",
          sidebarPath: require.resolve("./docs/en/sidebars.js"),
          editUrl: ({ locale, docPath }) => {
            // // @ts-ignore
            // if (locale !== config.i18n.defaultLocale) {
            //     return `https://databend.crowdin.com/databend/${locale}`;
            // }
            return `https://github.com/datafuselabs/databend-docs/tree/main/docs/${site}/guides/${docPath}`;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.scss',
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
        },
        gtag: {
          // com: G-KYDJ7HV75X
          // cn: G-M88HSQF3DK
          // rs: G-WBQPTTG4ZG
          trackingID: isCN ? "G-M88HSQF3DK" : "G-KYDJ7HV75X",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    "docusaurus-plugin-sass",
    "./src/plugins/global-sass-var-inject",
    "./src/plugins/fetch-databend-releases",
    "./src/plugins/gurubase-widget",
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "dev",
        path: `./docs/${site}/dev`,
        routeBasePath: "dev",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, devPath }) => {
          // @ts-ignore
          // if (locale !== config.i18n.defaultLocale) {
          //     return `https://databend.crowdin.com/databend/${locale}`;
          // }
          return `https://github.com/datafuselabs/databend-docs/edit/main/docs/dev/${devPath}`;
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "tutorials",
        path: `./docs/${site}/tutorials`,
        routeBasePath: "tutorials",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, docPath }) => {
          return `https://github.com/datafuselabs/databend-docs/tree/main/docs/${site}/tutorials/${docPath}`;
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "sqlReference",
        path: `./docs/${site}/sql-reference`,
        routeBasePath: "sql",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, docPath }) => {
          return `https://github.com/datafuselabs/databend-docs/edit/main/docs/${site}/sql-reference/${docPath}`;
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "releaseNotes",
        path: `./docs/${site}/release-notes`,
        routeBasePath: "release-notes",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, docPath }) => {
          return `https://github.com/datafuselabs/databend-docs/edit/main/docs/${site}/release-notes/${docPath}`;
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "developer",
        path: `./docs/${site}/developer`,
        routeBasePath: "developer",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, docPath }) => {
          return `https://github.com/datafuselabs/databend-docs/edit/main/docs/${site}/developer/${docPath}`;
        },
      },
    ],
    [
      "docusaurus-plugin-devserver",
      {
        devServer: {
          proxy: {
            "/query": {
              target: ASKBEND_URL,
              // pathRewrite: { "^/query": "" },
              changeOrigin: true,
              headers: {
                Origin: ASKBEND_URL,
              },
            },
          },
        },
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/',
            to: '/guides/'
          },
          {
            from: '/sql/sql-reference/table-engines/iceberg',
            to: '/guides/access-data-lake/iceberg/'
          },
          {
            from: '/sql/sql-functions/ai-functions/ai-cosine-distance',
            to: '/sql/sql-functions/vector-distance-functions/vector-cosine-distance/'
          },
          {
            from: '/guides/migrate/',
            to: '/tutorials/migrate/'
          },
          {
            from: '/guides/migrate/mysql',
            to: '/tutorials/migrate/migrating-from-mysql-with-db-archiver'
          },
          {
            from: '/guides/migrate/snowflake',
            to: '/tutorials/migrate/migrating-from-snowflake'
          }
        ],
        createRedirects(existingPath) {
          if (existingPath?.includes('/developer/community/rfcs/')) {
            return existingPath.replace('/developer/community/rfcs/', '/guides/community/rfcs/');
          }
          return undefined;
        }
      }

    ]
  ],
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },
  themeConfig: {
    // Replace with your project's social card
    image: "img/logo/logo-no-text.png",
    algolia,
    mermaid: {
      theme: { dark: 'dark' }
    },
    announcementBar: {
      id: "announcementBar-2", // Increment on change
      content: `⭐️ If you like Databend, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/datafuselabs/databend">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://x.com/DatabendLabs" >Twitter</a> ${TwitterSvg}`,
    },
    navbar: {
      title: "DOCUMENTATION",
      logo: {
        href: homeLink,
        target: "_blank",
        srcDark: "img/logo-dark.svg",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/guides/",
          label: "Guides",
          position: "right",
        },
        {
          to: "/tutorials/",
          label: "Tutorials",
          position: "right",
        },
        {
          to: "/developer/",
          label: "Developer",
          position: "right",
        },
        {
          to: "/sql/",
          label: "SQL Reference",
          position: "right",
        },
        //
        {
          to: "/release-notes/",
          label: "Releases",
          position: "right",
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        // { to: '/blog', label: 'Blog', position: 'left' }, // or position: 'right'
        // {
        //   to: "/download",
        //   label: "Downloads",
        //   position: "right",
        // },
      ],
    },
    footer: {
      links: [
        {
          title: "RESOURCES",
          items: [
            {
              label: "Products",
              to: `/guides/`,
            },
            {
              label: "AI",
              to: `/guides/ai-functions`,
            },
            {
              label: "Performance",
              to: `/guides/benchmark/tpch`,
            },
            {
              label: "Changelog",
              to: "/release-notes/",
            },
            {
              label: "Downloads",
              to: `${homeLink}/download/`,
            },
            {
              label: "Developer",
              to: "/developer/",
            },
            {
              label: "Blog",
              to: `${homeLink}/blog/`,
            },
          ],
        },
        {
          title: "COMMUNITY",
          items: [
            {
              label: "Slack",
              href: "https://link.databend.com/join-slack",
            },
            {
              label: "Twitter",
              href: "https://x.com/DatabendLabs",
            },
          ],
        },
      ],
      copyright: `Copyright © 2023 Datafuse Labs, Inc. Built with Docusaurus. <br><br> <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg">`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@databend.com" },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;