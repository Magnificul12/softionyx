import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { Icon } from '../components/Icons';
import Reveal from '../components/Reveal';
import ArticleCard from '../components/blog/ArticleCard';
import { BLOG_POSTS_META, getFeaturedPost } from '../content/blog';
import { BLOG_CATEGORIES, isBlogCategoryId } from '../content/blog/categories';
import type { BlogCategoryId } from '../content/blog/types';
import { buildBreadcrumbList } from '../utils/structuredData';
import { resolveBlogPostStrings } from '../utils/blogPostI18n';
import { LangLink } from '../i18n/routing';

type CategoryFilter = BlogCategoryId | 'all';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const selected: CategoryFilter = useMemo(() => {
    const c = searchParams.get('category');
    if (c && isBlogCategoryId(c)) return c;
    return 'all';
  }, [searchParams]);

  const query = searchParams.get('q') ?? '';

  const setCategory = (cat: CategoryFilter) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next, { replace: true });
  };

  const setQueryParam = (q: string) => {
    const next = new URLSearchParams(searchParams);
    if (!q.trim()) next.delete('q');
    else next.set('q', q);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const featured = getFeaturedPost();

  // When a category or search is active, drop the hero/featured slot so the
  // filtered grid is the focus.
  const isFiltered = selected !== 'all' || query.trim().length > 0;

  const filtered = useMemo(() => {
    let list = BLOG_POSTS_META;
    if (selected !== 'all') list = list.filter((p) => p.category === selected);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const d = resolveBlogPostStrings(i18n, t, p);
        const hay =
          `${d.title} ${d.excerpt} ${d.tags.join(' ')} ${d.authorName}`.toLowerCase();
        return hay.includes(q);
      });
    }
    // Hide the featured post from the grid when it's shown in hero slot.
    if (!isFiltered && featured) {
      list = list.filter((p) => p.slug !== featured.slug);
    }
    return list;
  }, [selected, query, isFiltered, featured, i18n.language, i18n.resolvedLanguage, t]);

  return (
    <>
      <SEO
        title={t('blog.seoTitle')}
        description={t('blog.seoDescription')}
        keywords={t('blog.seoKeywords')}
        jsonLd={buildBreadcrumbList([
          { name: t('breadcrumbs.home'), path: '/' },
          { name: t('breadcrumbs.blog'), path: '/blog' },
        ])}
      />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 min-h-screen">
        {/* Hero */}
        <section className="relative py-10 sm:py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <Reveal variant="fade-up">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium text-white tracking-tighter mb-4 sm:mb-6 [text-wrap:balance] leading-[1.15]">
                {t('blog.heroTitlePrefix')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                  {t('blog.heroTitleHighlight')}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light px-2">
                {t('blog.heroSubtitle')}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 sm:py-8 relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative w-full lg:w-80">
              <Icon
                name="search"
                width={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                placeholder={t('blog.searchPlaceholder')}
                value={query}
                onChange={(e) => setQueryParam(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40"
              />
            </div>

            <div className="flex flex-wrap gap-2 lg:ml-auto">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selected === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-indigo-500/20'
                }`}
              >
                {t('blog.categories.all')}
              </button>
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all inline-flex items-center gap-2 ${
                    selected === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-indigo-500/20'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cat.color }}
                    aria-hidden
                  />
                  {t(`blog.categories.${cat.id}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        {!isFiltered && featured && (
          <section className="py-10 sm:py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <Reveal variant="fade-up">
                <p className="text-xs uppercase tracking-widest text-indigo-300 font-medium mb-4">
                  {t('blog.featured')}
                </p>
                <ArticleCard post={featured} featured />
              </Reveal>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="py-8 sm:py-10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 mb-4">
                  {t('blog.noResults')}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-indigo-300 hover:text-indigo-200 text-sm font-medium"
                >
                  {t('blog.clearFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((post, idx) => (
                  <Reveal key={post.slug} variant="fade-up" delay={idx * 60}>
                    <ArticleCard post={post} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-14 sm:py-20 relative z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal variant="fade-up">
              <div className="text-center p-8 sm:p-10 rounded-2xl glass border border-white/5">
                <h2 className="text-2xl sm:text-3xl font-medium text-white mb-2 [text-wrap:balance]">
                  {t('blog.ctaTitle')}
                </h2>
                <p className="text-slate-400 font-light mb-5 max-w-xl mx-auto">
                  {t('blog.ctaSubtitle')}
                </p>
                <LangLink
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                >
                  {t('blog.ctaAction')}
                  <Icon name="arrow-right" width={14} />
                </LangLink>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
