import type {Plugin} from '@docusaurus/types';

export default function faviconHeadTagsPlugin(): Plugin {
  return {
    name: 'favicon-head-tags-plugin',
    injectHtmlTags() {
      return {
        headTags: [
          // Standard favicon
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/x-icon',
              href: '/img/favicon/favicon.ico',
            },
          },
          // PNG favicons
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/png',
              sizes: '16x16',
              href: '/img/favicon/favicon-16x16.png',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/png',
              sizes: '32x32',
              href: '/img/favicon/favicon-32x32.png',
            },
          },
          // Apple touch icon
          {
            tagName: 'link',
            attributes: {
              rel: 'apple-touch-icon',
              sizes: '180x180',
              href: '/img/favicon/apple-touch-icon.png',
            },
          },
          // Android Chrome icons
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/png',
              sizes: '192x192',
              href: '/img/favicon/android-chrome-192x192.png',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/png',
              sizes: '512x512',
              href: '/img/favicon/android-chrome-512x512.png',
            },
          },
          // Web manifest
          {
            tagName: 'link',
            attributes: {
              rel: 'manifest',
              href: '/img/favicon/site.webmanifest',
            },
          },
          // Theme color
          {
            tagName: 'meta',
            attributes: {
              name: 'theme-color',
              content: '#13171C',
            },
          },
        ],
      };
    },
  };
}

