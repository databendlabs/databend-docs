import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { announcementBarContent, ASKBEND_URL, siteConfig, tagline } from './site-config';
import siteRedirects from './site-redirects';


const { site } = process.env;
const isCN = (site || "cn") === "cn";
const lang = isCN ? "zh" : "en";

const { site_env } = process.env;
const isProduction = site_env === "production";

const config: Config = {
  title: "Databend",
  staticDirectories: ["static", "./docs/public"],
  tagline,
  url: siteConfig[lang].docsHomeLink, // Your website URL
  baseUrl: "/",
  onBrokenAnchors: "ignore",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/rect-icon.png",
  organizationName: "DatabendLabs",
  projectName: 'Databend', // Usually your repo name.
  future: {
    experimental_faster: {
      rspackBundler: true, // required flag
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
    }
  },
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: lang,
    locales: [lang],
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
    docsHomeLink: siteConfig[lang].docsHomeLink,
    homeLink: siteConfig[lang].homeLink,
    cloudLink: siteConfig[lang].cloudLink,
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
            return `https://github.com/databendlabs/databend-docs/tree/main/docs/${site}/guides/${docPath}`;
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
          trackingID: siteConfig[lang].trackingID,
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
          return `https://github.com/databendlabs/databend-docs/edit/main/docs/dev/${devPath}`;
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
          return `https://github.com/databendlabs/databend-docs/tree/main/docs/${site}/tutorials/${docPath}`;
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
          return `https://github.com/databendlabs/databend-docs/edit/main/docs/${site}/sql-reference/${docPath}`;
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
          return `https://github.com/databendlabs/databend-docs/edit/main/docs/${site}/release-notes/${docPath}`;
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
          return `https://github.com/databendlabs/databend-docs/edit/main/docs/${site}/developer/${docPath}`;
        },
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "integrations",
        path: `./docs/${site}/Integrations`,
        routeBasePath: "integrations",
        sidebarPath: require.resolve("./docs/en/sidebars.js"),
        editUrl: ({ locale, docPath }) => {
          return `https://github.com/databendlabs/databend-docs/edit/main/docs/${site}/integrations/${docPath}`;
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
        redirects: siteRedirects,
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
    algolia: siteConfig[lang].algolia,
    mermaid: {
      theme: { dark: 'dark' }
    },
    announcementBar: {
      id: "announcementBar-2", // Increment on change
      content: announcementBarContent,
    },
    navbar: {
      title: "DOCUMENTATION",
      logo: {
        href: siteConfig[lang].homeLink,
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
        {
          to: "/integrations/",
          label: "Integrations",
          position: "right",
        },
        {
          to: "/release-notes/",
          label: "Releases",
          position: "right",
        },
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
              to: `${siteConfig[lang].homeLink}/download/`,
            },
            {
              label: "Developer",
              to: "/developer/",
            },
            {
              label: "Blog",
              to: `${siteConfig[lang].homeLink}/blog/`,
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
              label: "X",
              href: "https://x.com/DatabendLabs",
            },
          ],
        },
      ],
      copyright: '@DatabendLabs',
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