import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../Icons';

type Props = {
  url: string;
  title: string;
};

/**
 * Social share row: Twitter/X, LinkedIn, Facebook, WhatsApp, copy-link.
 * Uses `target=_blank` + share intents (no SDKs, zero runtime cost).
 */
export default function ShareButtons({ url, title }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const intents = [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: 'x',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: 'users',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: 'folder',
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: 'phone',
    },
  ];

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-slate-500 font-medium mr-2">
        {t('blog.share')}
      </span>
      {intents.map((intent) => (
        <a
          key={intent.name}
          href={intent.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('blog.shareOn', { network: intent.name })}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-colors"
        >
          <Icon name={intent.icon} width={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyToClipboard}
        aria-label={t('blog.copyLink')}
        className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-colors text-xs font-medium"
      >
        <Icon name={copied ? 'check' : 'external-link'} width={14} />
        {copied
          ? t('blog.copied')
          : t('blog.copyLink')}
      </button>
    </div>
  );
}
