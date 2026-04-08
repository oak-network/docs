import type {Plugin} from '@docusaurus/types';

export default function faviconHeadTagsPlugin(): Plugin {
  return {
    name: 'favicon-head-tags-plugin',
    injectHtmlTags() {
      return {
        headTags: [
          // Preconnect to Google Fonts for faster font loading
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://fonts.googleapis.com',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://fonts.gstatic.com',
              crossorigin: 'anonymous',
            },
          },
          // Primary font — swap ensures text is visible immediately
          {
            tagName: 'link',
            attributes: {
              rel: 'stylesheet',
              href: 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap',
            },
          },
          // Decorative fonts — optional avoids layout shift and FOIT
          {
            tagName: 'link',
            attributes: {
              rel: 'stylesheet',
              href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Manrope:wght@400;600;800&family=Outfit:wght@800&display=optional',
            },
          },
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

