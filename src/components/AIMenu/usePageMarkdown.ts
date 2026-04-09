import {useLocation} from '@docusaurus/router';
import {useCallback} from 'react';

function htmlToMarkdown(el: Element): string {
  const lines: string[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? '';
      if (text.trim()) lines.push(text);
      continue;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const node = child as Element;
    const tag = node.tagName.toLowerCase();

    if (['script', 'style', 'nav', 'button', 'svg'].includes(tag)) continue;

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      lines.push(`\n${'#'.repeat(level)} ${node.textContent?.trim() ?? ''}\n`);
    } else if (tag === 'p') {
      lines.push(`\n${node.textContent?.trim() ?? ''}\n`);
    } else if (tag === 'pre') {
      const code = node.querySelector('code');
      const lang = code?.className?.match(/language-(\w+)/)?.[1] ?? '';
      lines.push(`\n\`\`\`${lang}\n${code?.textContent ?? node.textContent ?? ''}\n\`\`\`\n`);
    } else if (tag === 'code' && node.parentElement?.tagName.toLowerCase() !== 'pre') {
      lines.push(`\`${node.textContent ?? ''}\``);
    } else if (tag === 'a') {
      const href = node.getAttribute('href') ?? '';
      lines.push(`[${node.textContent ?? ''}](${href})`);
    } else if (tag === 'strong' || tag === 'b') {
      lines.push(`**${node.textContent ?? ''}**`);
    } else if (tag === 'em' || tag === 'i') {
      lines.push(`*${node.textContent ?? ''}*`);
    } else if (tag === 'ul' || tag === 'ol') {
      const items = node.querySelectorAll(':scope > li');
      items.forEach((li, i) => {
        const prefix = tag === 'ol' ? `${i + 1}. ` : '- ';
        lines.push(`${prefix}${li.textContent?.trim() ?? ''}`);
      });
      lines.push('');
    } else if (tag === 'table') {
      const rows = node.querySelectorAll('tr');
      rows.forEach((row, ri) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map(
          (c) => c.textContent?.trim() ?? '',
        );
        lines.push(`| ${cells.join(' | ')} |`);
        if (ri === 0) {
          lines.push(`| ${cells.map(() => '---').join(' | ')} |`);
        }
      });
      lines.push('');
    } else if (tag === 'blockquote') {
      const text = node.textContent?.trim() ?? '';
      lines.push(`\n> ${text}\n`);
    } else if (tag === 'hr') {
      lines.push('\n---\n');
    } else if (tag === 'img') {
      const alt = node.getAttribute('alt') ?? '';
      const src = node.getAttribute('src') ?? '';
      lines.push(`![${alt}](${src})`);
    } else {
      const nested = htmlToMarkdown(node);
      if (nested.trim()) lines.push(nested);
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export interface PageMarkdown {
  title: string;
  content: string;
  url: string;
  slug: string;
}

export function usePageMarkdown() {
  const location = useLocation();

  const isDocsPage = location.pathname.startsWith('/docs/');

  const getPageMarkdown = useCallback((): PageMarkdown => {
    const url = typeof window !== 'undefined'
      ? window.location.href
      : `https://docs.oaknetwork.org${location.pathname}`;

    const slug = isDocsPage
      ? location.pathname.replace(/^\/docs\//, '').replace(/\/$/, '')
      : location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'index';

    const titleEl = document.querySelector('article h1, .theme-doc-markdown h1');
    const title = titleEl?.textContent?.trim() ?? document.title;

    const article =
      document.querySelector('article .theme-doc-markdown') ??
      document.querySelector('article') ??
      document.querySelector('.theme-doc-markdown') ??
      document.querySelector('main');
    const content = article ? htmlToMarkdown(article) : document.title;

    return {title, content, url, slug};
  }, [location.pathname, isDocsPage]);

  const getFormattedContent = useCallback((): string => {
    const {title, content, url} = getPageMarkdown();
    return `# ${title}\n\n${content}\n\n---\nSource: ${url}`;
  }, [getPageMarkdown]);

  const getGitHubRawUrl = useCallback((): string => {
    const {slug} = getPageMarkdown();
    if (isDocsPage) {
      return `https://github.com/oak-network/docs/blob/main/docs/${slug}.md`;
    }
    return `https://github.com/oak-network/docs/blob/main/src/pages/${slug}.tsx`;
  }, [getPageMarkdown, isDocsPage]);

  return {getPageMarkdown, getFormattedContent, getGitHubRawUrl, isDocsPage};
}
