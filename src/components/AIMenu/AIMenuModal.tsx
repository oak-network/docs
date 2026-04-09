import React, {useState, useCallback, useRef, useEffect, type JSX} from 'react';
import {usePageMarkdown} from './usePageMarkdown';
import styles from './AIMenu.module.css';

interface Props {
  onClose: () => void;
}

const MAX_URL_CONTENT = 6000;

const ChatGPTIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M4.709 15.955l4.72-10.495c.396-.88 1.09-1.36 1.963-1.36.864 0 1.52.47 1.922 1.36L18.1 16.672c.274.596.4.99.4 1.346 0 .89-.66 1.502-1.596 1.502-.808 0-1.28-.38-1.636-1.2l-1.1-2.56H9.014l-1.108 2.581c-.338.8-.826 1.18-1.606 1.18-.924 0-1.6-.63-1.6-1.523 0-.337.12-.73.41-1.34zm4.998-3.817h3.788L11.61 7.88z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const MarkdownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

export default function AIMenuModal({onClose}: Props): JSX.Element {
  const {getPageMarkdown, getFormattedContent, getGitHubRawUrl, isDocsPage} = usePageMarkdown();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { clearTimeout(toastTimer.current); };
  }, []);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const handleOpenChatGPT = useCallback(() => {
    const {content, title} = getPageMarkdown();
    const truncated = content.length > MAX_URL_CONTENT
      ? content.slice(0, MAX_URL_CONTENT) + '\n\n[content truncated]'
      : content;
    const prompt = `Here is documentation from Oak Network — "${title}":\n\n${truncated}\n\nPlease help me understand this.`;
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer');
    onClose();
  }, [getPageMarkdown, onClose]);

  const handleOpenClaude = useCallback(() => {
    const {content, title} = getPageMarkdown();
    const truncated = content.length > MAX_URL_CONTENT
      ? content.slice(0, MAX_URL_CONTENT) + '\n\n[content truncated]'
      : content;
    const prompt = `Here is documentation from Oak Network — "${title}":\n\n${truncated}\n\nPlease help me understand this.`;
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer');
    onClose();
  }, [getPageMarkdown, onClose]);

  const handleCopyForAI = useCallback(async () => {
    try {
      const text = getFormattedContent();
      await navigator.clipboard.writeText(text);
      showToast('Copied page for AI');
    } catch {
      showToast('Failed to copy');
    }
  }, [getFormattedContent, showToast]);

  const handleViewMarkdown = useCallback(() => {
    const url = getGitHubRawUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  }, [getGitHubRawUrl, onClose]);

  const handleCopyMCP = useCallback(async () => {
    try {
      const {slug} = getPageMarkdown();
      const mcpUrl = `https://docs.oaknetwork.org/llms-full.txt#${slug}`;
      await navigator.clipboard.writeText(mcpUrl);
      showToast('Copied MCP URL');
    } catch {
      showToast('Failed to copy');
    }
  }, [getPageMarkdown, showToast]);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-label="AI Menu">
        <div className={styles.sectionLabel}>Open in...</div>
        <div className={styles.menuList}>
          <button className={styles.menuItem} onClick={handleOpenChatGPT}>
            <span className={styles.menuItemIcon}><ChatGPTIcon /></span>
            <span className={styles.menuItemLabel}>ChatGPT</span>
          </button>
          <button className={styles.menuItem} onClick={handleOpenClaude}>
            <span className={styles.menuItemIcon}><ClaudeIcon /></span>
            <span className={styles.menuItemLabel}>Claude</span>
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.menuList}>
          <button className={styles.menuItem} onClick={handleCopyForAI}>
            <span className={styles.menuItemIcon}><CopyIcon /></span>
            <span className={styles.menuItemLabel}>Copy page for AI</span>
          </button>
          <button
            className={`${styles.menuItem} ${!isDocsPage ? styles.menuItemDisabled : ''}`}
            onClick={isDocsPage ? handleViewMarkdown : undefined}
            disabled={!isDocsPage}
            title={!isDocsPage ? 'Only available on docs pages' : undefined}
          >
            <span className={styles.menuItemIcon}><MarkdownIcon /></span>
            <span className={styles.menuItemLabel}>View as Markdown</span>
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.menuList}>
          <button
            className={`${styles.menuItem} ${!isDocsPage ? styles.menuItemDisabled : ''}`}
            onClick={isDocsPage ? handleCopyMCP : undefined}
            disabled={!isDocsPage}
            title={!isDocsPage ? 'Only available on docs pages' : undefined}
          >
            <span className={styles.menuItemIcon}><LinkIcon /></span>
            <span className={styles.menuItemLabel}>Copy MCP URL</span>
          </button>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
