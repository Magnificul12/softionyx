import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../Icons';
import type { BlogPostMeta } from '../../content/blog/types';
import { getCategory } from '../../content/blog/categories';
import { dateLocaleTag, resolveBlogPostStrings } from '../../utils/blogPostI18n';
import { LangLink } from '../../i18n/routing';

type Props = {
  post: BlogPostMeta;
  /** Big card for "featured" slot on /blog. */
  featured?: boolean;
};

export default function ArticleCard({ post, featured = false }: Props) {
  const { t, i18n } = useTranslation();
  const cat = getCategory(post.category);

  const display = useMemo(
    () => resolveBlogPostStrings(i18n, t, post),
    [post, i18n.language, i18n.resolvedLanguage, t]
  );

  const locale = dateLocaleTag(i18n.language);
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      className={`group card-glow rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md relative overflow-hidden flex flex-col ${
        featured ? 'lg:grid lg:grid-cols-2 lg:gap-0' : ''
      }`}
    >
      <LangLink
        to={`/blog/${post.slug}`}
        className="block aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
        aria-label={display.title}
      >
        {post.cover ? (
          <img
            src={post.cover}
            alt={display.coverAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name={cat.icon} width={56} className="text-indigo-300/50" />
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/70 backdrop-blur border border-white/10 text-white">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.color }}
            aria-hidden
          />
          {t(`blog.categories.${cat.id}`)}
        </div>
        {post.featured && !featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-600/90 text-white">
            {t('blog.featured')}
          </div>
        )}
      </LangLink>

      <div className={`p-5 sm:p-6 flex flex-col flex-1 ${featured ? 'lg:p-8' : ''}`}>
        <LangLink to={`/blog/${post.slug}`} className="block group/title">
          <h3
            className={`font-medium text-white leading-snug mb-3 group-hover/title:text-indigo-200 transition-colors [text-wrap:balance] ${
              featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'
            }`}
          >
            {display.title}
          </h3>
        </LangLink>
        <p
          className={`text-slate-400 font-light leading-relaxed mb-4 ${
            featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {display.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt=""
              className="w-7 h-7 rounded-full border border-white/10 object-cover"
              aria-hidden
            />
          ) : null}
          <div className="flex-1 min-w-0">
            <p className="text-slate-300 font-medium truncate">
              {display.authorName}
            </p>
            <p className="flex items-center gap-1.5 text-slate-500">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Icon name="clock" width={12} />
                {post.readingTimeMin}{' '}
                {t('blog.readingTimeShort')}
              </span>
            </p>
          </div>
          <LangLink
            to={`/blog/${post.slug}`}
            className="shrink-0 inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-medium"
          >
            {t('blog.readMore')}
            <Icon name="arrow-right" width={14} />
          </LangLink>
        </div>
      </div>
    </article>
  );
}
