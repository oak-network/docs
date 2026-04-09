import React, {useState, useEffect, useCallback, type JSX} from 'react';
import {useLocation} from '@docusaurus/router';
import AIMenuModal from './AIMenuModal';
import styles from './AIMenu.module.css';

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

export default function AIMenuButton(): JSX.Element {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'i' && !isEditable) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, toggle, close]);

  return (
    <>
      <button
        className={`${styles.fab} ${open ? styles.fabHidden : ''}`}
        onClick={toggle}
        aria-label="Open AI menu"
        title="AI Menu (⌘I)"
      >
        <SparkleIcon />
      </button>
      {open && <AIMenuModal onClose={close} />}
    </>
  );
}
