import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BlogTocItem } from '../../content/blog/types';

type Props = {
  items: BlogTocItem[];
  /** id of the scrollable container holding the headings (usually window). */
  containerId?: string;
};

/**
 * Sticky sidebar table-of-contents. Highlights the currently-visible H2/H3
 * in the article body and smooth-scrolls to any heading when clicked.
 *
 * Works with IntersectionObserver; falls back gracefully during SSR/prerender.
 */
export default function TableOfContents({ items }: Props) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const targets: HTMLElement[] = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    if (targets.length === 0) return;

    // The section whose heading is nearest to the top of viewport wins.
    function update() {
      const scrollY = window.scrollY + 120; // offset for sticky header
      let current = targets[0].id;
      for (const el of targets) {
        if (el.offsetTop <= scrollY) current = el.id;
        else break;
      }
      setActiveId(current);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  function scrollTo(id: string, e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
    // Update URL without adding to history.
    history.replaceState(null, '', `#${id}`);
  }

  if (items.length === 0) return null;

  return (
    <nav aria-label={t('blog.toc')}>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">
        {t('blog.toc')}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => scrollTo(item.id, e)}
              className={`toc-link ${item.level === 3 ? 'toc-link--h3' : ''} ${
                activeId === item.id ? 'is-active' : ''
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
