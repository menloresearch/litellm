import { remarkCodeHike } from "@code-hike/mdx";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import dotenv from "dotenv";
import { themes as prismThemes } from "prism-react-renderer";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const date = new Date();

const month = ("0" + (date.getMonth() + 1)).slice(-2);
const day = ("0" + date.getDate()).slice(-2);
const year = date.getFullYear();

const formattedDate = `${month}-${day}-${year}`;

async function fetchDataDaily(date: string) {
  const response = await fetch(`https://delta.jan.ai/openai-api-collection-test/${date}.json`);
  if (!response.ok) {
    return {};
  }
  const data = await response.json();
  return data;
}

function generateDates(startDate: string, numberOfDays: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() - i);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}-${date.getFullYear()}`;
    dates.push(formattedDate);
  }

  return dates;
}

const dateArray = generateDates(formattedDate, 30);

// Load OpenAPI spec at build time
const openApiSpecPath = path.join(__dirname, 'static', 'openapi', 'menlo-platform.json');
const openApiSpec = JSON.parse(fs.readFileSync(openApiSpecPath, 'utf8'));

const config: Config = {
  title: "Platform",
  titleDelimiter: "-",
  tagline:
    "Platform is an Local AI engine for developers to run and customize Local LLMs. It is packaged with a Docker-inspired command-line interface and a Typescript client library. It can be used as a standalone server, or imported as a library. Platform's roadmap is to eventually support full OpenAI API-equivalence.",
  favicon: "img/favicons/web-app-manifest-192x192.png",
  staticDirectories: ["static"],

  plugins: [
    // [
    //   "@docusaurus/plugin-content-docs",
    //   {
    //     id: "changelog",
    //     path: "changelog",
    //     routeBasePath: "changelog",
    //   },
    // ],
    "docusaurus-plugin-sass",
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    "docusaurus-plugin-dotenv",
    [
      '@scalar/docusaurus',
      {
        label: 'API Reference',
        route: process.env.NODE_ENV === 'production' ? '/docs/api-reference' : '/api-reference',
        configuration: {
          spec: {
            content: openApiSpec,
          },
          theme: 'auto',
        },
      },
    ],
  ],

  scripts: [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GTM_ID}`,
      async: true,
    },
    {
      src: "/js/gtag.js",
      async: false,
    },
  ],

  // Set the production url of your site here
  url: "https://cortex.so",
  // Set the /<baseUrl>/ pathname under which your site is served
  // Development: serve at root, Production: serve under /docs/ (handled by nginx)
  baseUrl: process.env.NODE_ENV === 'production' ? '/docs/' : '/',

  themes: ["live-codeblock", "@docusaurus/theme-mermaid"],

  markdown: {
    format: "detect",
    mermaid: true,
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "janhq", // Usually your GitHub org/user name.
  projectName: "cortex", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          beforeDefaultRemarkPlugins: [
            [
              remarkCodeHike,
              {
                theme: "dark-plus",
                showCopyButton: true,
                skipLanguages: ["mermaid"],
              },
            ],
          ],
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        sitemap: {
          changefreq: "daily",
          priority: 1.0,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: [require.resolve("@code-hike/mdx/styles.css"), "./src/styles/main.scss"],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // algolia: {
    //   appId: process.env.ALGOLIA_APP_ID || "XXX",
    //   apiKey: process.env.ALGOLIA_API_KEY || "XXX",
    //   indexName: "cortex",
    //   contextualSearch: true,
    //   insights: true,
    // },

    metadata: [
      {
        name: "description",
        content:
          "Platform is an Local AI engine for developers to run and customize Local LLMs. It is packaged with a Docker-inspired command-line interface and a Typescript client library. It can be used as a standalone server, or imported as a library. Platform's roadmap is to eventually support full OpenAI API-equivalence.",
      },
      {
        name: "og:description",
        content:
          "Platform is an Local AI engine for developers to run and customize Local LLMs. It is packaged with a Docker-inspired command-line interface and a Typescript client library. It can be used as a standalone server, or imported as a library. Platform's roadmap is to eventually support full OpenAI API-equivalence.",
      },
    ],

    headTags: [
      // Declare some json-ld structured data
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Organization",
          name: "Platform",
          url: "https://platform.menlo.ai/",
          logo: "https://cortex.so/img/logos/cortex-logo.svg",
        }),
      },
    ],

    image: "img/social-card.jpg",
    navbar: {
      logo: {
        alt: "Menlo Logo",
        src: "img/menlo.svg",
        href: "/",
        width: 100,
        height: 26,
      },
      items: [
        {
          to: "/",
          label: "Docs",
          position: "left",
        },
        {
          type: "search",
          position: "right",
        },
        // {
        //   href: process.env.PLAYGROUND_URL || "http://localhost:3000" + "/playground/realtime",
        //   label: "Playground",
        //   position: "right",
        //   target: "_self",
        //   rel: "noopener noreferrer",
        // },
      ],
    },
    footer: {
      links: [
        {
          title: "Platform",
          items: [
            {
              label: "Docs",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Github",
              href: "https://github.com/janhq/",
            },
            {
              label: "Discord",
              href: "https://discord.gg/FTk2MvZwJH",
            },
            {
              label: "Twitter",
              href: "https://x.com/cortex_so",
            },
            {
              label: "Linkedin",
              href: "https://www.linkedin.com/company/homebrewltd/",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "About",
              href: "https://jan.ai/about",
            },
            {
              label: "Careers",
              href: "https://homebrew.bamboohr.com/careers",
            },
          ],
        },
      ],
      logo: {
        alt: "Platform Logo",
        src: "/img/logos/cortex-logo-mark.svg",
        srcDark: "/img/logos/cortex-logo-mark.svg",
        width: 34,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Menlo. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
