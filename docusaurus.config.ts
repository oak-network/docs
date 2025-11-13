import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Oak Network',
  tagline: 'From Roots to Routes.',
  favicon: 'img/favicon/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Set the production url of your site here
  url: 'https://docs.oaknetwork.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'oak-network', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese,
  // you may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './src/plugins/favicon-head-tags.ts',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/oak-network/docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/oak-network/docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/oak-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: 'Oak Network Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 160,
        height: 35,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'contractsSidebar',
          position: 'left',
          label: 'Smart Contracts',
        },
        {to: '/docs/roadmap', label: 'Roadmap', position: 'left'},
        {to: '/docs/operations/bounty-program', label: 'Bounty Program', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/oak-network/ccprotocol-contracts',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.com/invite/srhtEpWBHx',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Oak Network Logo',
        src: 'img/logo.svg',
        href: 'https://oaknetwork.org',
        width: 160,
        height: 35,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Core Concepts',
              to: '/docs/concepts/overview',
            },
            {
              label: 'Smart Contracts',
              to: '/docs/contracts/overview',
            },
          ],
        },
        {
          title: 'Integration',
          items: [
            {
              label: 'Create Campaign',
              to: '/docs/guides/create-campaign',
            },
            {
              label: 'Platform Integration',
              to: '/docs/guides/platform-integration',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/srhtEpWBHx',
            },
            {
              label: 'X',
              href: 'https://x.com/oak_network',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/oak-network',
            },
          ],
        },
        {
          title: 'Protocol',
          items: [
            {
              label: 'Audit Reports',
              to: '/docs/security/audits',
            },
            {
              label: 'Deployment Addresses',
              to: '/docs/contracts/deployment',
            },
            {
              label: 'Open Source Philosophy',
              to: '/docs/concepts/open-source-philosophy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Oak Network.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'javascript', 'typescript'],
    },
    // Algolia search configuration - disabled until properly configured
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'oaknetwork',
    //   contextualSearch: true,
    //   searchParameters: {},
    //   searchPagePath: 'search',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;