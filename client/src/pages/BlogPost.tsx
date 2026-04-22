import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getClusterPosts, getPostBySlug, getRelatedPosts } from '../content/blog';
import ArticleLayout from '../components/blog/ArticleLayout';
import SEO, { SITE_URL } from '../components/SEO';
import {
  buildBlogPostingSchema,
  buildBreadcrumbList,
} from '../utils/structuredData';
import { resolveBlogPostStrings } from '../utils/blogPostI18n';
import { LangLink } from '../i18n/routing';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const post = slug ? getPostBySlug(slug) : undefined;

  const display = useMemo(
    () => (post ? resolveBlogPostStrings(i18n, t, post) : null),
    [post, i18n.language, i18n.resolvedLanguage, t]
  );

  if (!slug) return <Navigate to=".." replace />;

  if (!post) {
    // 404 for unknown slugs – prerender picks this up and skips writing the file.
    return (
      <div className="pt-32 pb-20 min-h-screen text-center px-6">
        <meta name="prerender-status-code" content="404" />
        <h1 className="text-4xl font-medium text-white mb-3">
          {t('blog.notFoundTitle')}
        </h1>
        <p className="text-slate-400">{t('blog.notFoundDescription')}</p>
        <LangLink
          to="/blog"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
        >
          {t('blog.notFoundCta')}
        </LangLink>
      </div>
    );
  }

  if (!display) return null;

  const clusterPeers = post.clusterId
    ? getClusterPosts(post.clusterId, post.slug)
    : [];
  const peerSlugs = new Set(clusterPeers.map((p) => p.slug));
  const related = getRelatedPosts(post.slug, 6)
    .filter((p) => !peerSlugs.has(p.slug))
    .slice(0, 3);
  const url = `/blog/${post.slug}`;
  const categoryQuery = `/blog?category=${encodeURIComponent(post.category)}`;
  const absoluteImage = post.cover
    ? post.cover.startsWith('http')
      ? post.cover
      : `${SITE_URL}${post.cover}`
    : undefined;

  const schema = [
    buildBlogPostingSchema({
      title: display.metaTitle,
      description: display.metaDescription,
      slug: post.slug,
      image: post.cover,
      author: display.authorName,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
    }),
    buildBreadcrumbList([
      { name: t('breadcrumbs.home'), path: '/' },
      { name: t('breadcrumbs.blog'), path: '/blog' },
      { name: t(`blog.categories.${post.category}`), path: categoryQuery },
      { name: display.title, path: url },
    ]),
  ];

  return (
    <>
      <SEO
        title={display.metaTitle}
        description={display.metaDescription}
        keywords={display.keywords}
        url={url}
        image={absoluteImage}
        type="article"
        author={display.authorName}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt || post.publishedAt}
        jsonLd={schema}
      />
      <ArticleLayout
        post={post}
        clusterPosts={clusterPeers}
        related={related}
        display={display}
      />
    </>
  );
}
