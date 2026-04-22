import { Suspense, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../../content/blog/types';
import { getCategory } from '../../content/blog/categories';
import { Icon } from '../Icons';
import { SITE_URL } from '../SEO';
import TableOfContents from './TableOfContents';
import ReadingProgress from './ReadingProgress';
import ShareButtons from './ShareButtons';
import ArticleCard from './ArticleCard';
import { createLazyArticleBody } from '../../content/blog';
import type { ResolvedBlogPostStrings } from '../../utils/blogPostI18n';
import { appLangCode, dateLocaleTag } from '../../utils/blogPostI18n';
import { LangLink } from '../../i18n/routing';

type Props = {
  post: BlogPost;
  /** Same `clusterId` as this post (excluding self); hub-and-spoke series. */
  clusterPosts?: BlogPost[];
  related: BlogPost[];
  display: ResolvedBlogPostStrings;
};

export default function ArticleLayout({
  post,
  clusterPosts = [],
  related,
  display,
}: Props) {
  const { t, i18n } = useTranslation();
  const articleRef = useRef<HTMLElement>(null);
  const lang = appLangCode(i18n.language);
  const Body = useMemo(
    () => createLazyArticleBody(post.slug, lang),
    [post.slug, lang]
  );
  const cat = getCategory(post.category);
  const categoryHref = `/blog?category=${encodeURIComponent(post.category)}`;

  const locale = dateLocaleTag(i18n.language);
  const formattedPublished = new Date(post.publishedAt).toLocaleDateString(
    locale,
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const formattedUpdated =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? new Date(post.updatedAt).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

  const fullUrl = `${SITE_URL}/${lang}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress targetRef={articleRef} />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
        {/* ---------- Article header ---------- */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-12 relative z-10">
            {/* Breadcrumbs */}
            <nav
              aria-label={t('breadcrumbs.ariaLabel')}
              className="text-xs sm:text-sm text-slate-500 mb-6 flex items-center gap-2 flex-wrap"
            >
              <LangLink to="/" className="hover:text-white transition-colors">
                {t('breadcrumbs.home')}
              </LangLink>
              <Icon name="chevron-right" width={12} className="text-slate-600" />
              <LangLink to="/blog" className="hover:text-white transition-colors">
                {t('breadcrumbs.blog')}
              </LangLink>
              <Icon name="chevron-right" width={12} className="text-slate-600" />
              <LangLink
                to={categoryHref}
                className="hover:text-white transition-colors line-clamp-1"
              >
                {t(`blog.categories.${cat.id}`)}
              </LangLink>
              <Icon name="chevron-right" width={12} className="text-slate-600" />
              <span className="text-slate-300 line-clamp-1">{display.title}</span>
            </nav>

            {/* Category pill */}
            <LangLink
              to={categoryHref}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.03] border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-white transition-colors mb-5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cat.color }}
                aria-hidden
              />
              {t(`blog.categories.${cat.id}`)}
            </LangLink>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tighter mb-4 [text-wrap:balance] leading-[1.15]">
              {display.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed [text-wrap:pretty]">
              {display.excerpt}
            </p>

            {/* Author + meta row */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm text-white font-medium">
                    {display.authorName}
                  </p>
                  {display.authorRole ? (
                    <p className="text-xs text-slate-500">{display.authorRole}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" width={14} />
                  <time dateTime={post.publishedAt}>{formattedPublished}</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" width={14} />
                  {post.readingTimeMin}{' '}
                  {t('blog.readingTime')}
                </span>
                {formattedUpdated && (
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Icon name="check-circle" width={14} />
                    {t('blog.updated')}{' '}
                    {formattedUpdated}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cover image */}
          {post.cover && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                <img
                  src={post.cover}
                  alt={display.coverAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </header>

        {/* ---------- Article body + TOC ---------- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-14">
            <article
              ref={articleRef}
              className="prose-soft mx-auto w-full"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta itemProp="headline" content={display.title} />
              <meta itemProp="datePublished" content={post.publishedAt} />
              <meta
                itemProp="dateModified"
                content={post.updatedAt || post.publishedAt}
              />
              <Suspense
                fallback={
                  <div className="py-20 text-center text-slate-500 text-sm">
                    {t('blog.articleLoading')}
                  </div>
                }
              >
                <Body />
              </Suspense>

              {/* Tags */}
              {display.tags.length > 0 && (
                <div className="not-prose mt-12 flex flex-wrap gap-2">
                  {display.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-white/[0.02] border border-white/5 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="not-prose mt-8 pt-6 border-t border-white/5">
                <ShareButtons url={fullUrl} title={display.title} />
              </div>

              {/* Author bio */}
              {display.authorBio ? (
                <div className="not-prose mt-10 p-5 rounded-2xl glass border border-white/5 flex items-start gap-4">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt=""
                      className="w-12 h-12 rounded-full border border-white/10 object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{display.authorName}</p>
                    {display.authorRole ? (
                      <p className="text-xs text-slate-500 mb-2">
                        {display.authorRole}
                      </p>
                    ) : null}
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {display.authorBio}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>

            {/* TOC sidebar (desktop only) */}
            {display.toc.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents items={display.toc} />
                </div>
              </aside>
            )}
          </div>
        </section>

        {/* ---------- Topic cluster (hub-and-spoke) ---------- */}
        {clusterPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                {t('blog.clusterSeries')}
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                {t('blog.clusterSeriesHint')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clusterPosts.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* ---------- Related articles ---------- */}
        {related.length > 0 && (
          <section
            className={`max-w-7xl mx-auto px-4 sm:px-6 relative z-10 ${
              clusterPosts.length > 0 ? 'mt-14 sm:mt-16' : 'mt-20 sm:mt-24'
            }`}
          >
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                {t('blog.related')}
              </h2>
              <LangLink
                to="/blog"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-200"
              >
                {t('blog.viewAll')}
                <Icon name="arrow-right" width={14} />
              </LangLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back to blog link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-14 relative z-10">
          <LangLink
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <Icon name="arrow-left" width={14} />
            {t('blog.backToBlog')}
          </LangLink>
        </div>
      </div>
    </>
  );
}
