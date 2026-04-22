import { LangLink as Link } from '../../../../i18n/routing';

export default function Article() {
  return (
    <>
      <h2 id="intro-performanta">Why infrastructure is part of the product</h2>
      <p>
        Speed signals trust. Search engines use experience signals (including Core Web
        Vitals) among many ranking factors. On mobile and variable networks, efficient
        content delivery matters even more.
      </p>
      <p>
        Pair this article with the{' '}
        <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          web development pillar
        </Link>
        — hosting sits in the launch chapter; here we go deeper on operations.
      </p>

      <h2 id="domenii-dns">Domains, DNS, and SSL — boring until it breaks</h2>
      <p>
        Keep the domain under your company account with DNS access. You should never be
        locked in if a vendor relationship ends badly.
      </p>
      <p>
        DNS affects resolution time — use sensible TTLs and avoid unnecessary CNAME
        chains. For SSL, use trusted CAs or Let&apos;s Encrypt; enable HSTS only after
        HTTP→HTTPS redirects are verified end-to-end.
      </p>

      <h2 id="hosting-tipuri">Shared vs VPS vs managed cloud</h2>
      <p>
        <strong>Shared</strong> — cheap, noisy neighbors, fine for prototypes.{' '}
        <strong>VPS</strong> — more control, needs sysadmin skills.{' '}
        <strong>Managed cloud / PaaS</strong> — higher cost, less ops burden for small
        teams.
      </p>
      <p>
        For commerce or sensitive data, isolation and automated backups matter. Ask
        providers for RPO/RTO in writing.
      </p>

      <h2 id="cwv-seo">Core Web Vitals and SEO</h2>
      <p>
        LCP reflects main content load; INP interaction responsiveness; CLS visual stability.
        They are not the only SEO lever, but improving them usually lifts conversion too.
      </p>
      <p>
        Measure in Search Console and Lighthouse with realistic throttling. Right-size
        images (WebP/AVIF where supported), tune font loading, and reserve space for ads or
        embeds to avoid CLS spikes.
      </p>

      <h2 id="optimizari">Quick wins: images, caching, fonts</h2>
      <ul>
        <li>Responsive images + lazy loading below the fold.</li>
        <li>CDN caching for static assets with controlled invalidation on deploy.</li>
        <li>Fewer font families/weights; subset for the languages you ship.</li>
        <li>Less JavaScript on critical routes; route-based code splitting.</li>
      </ul>

      <h2 id="legaturi-serie">More from the cluster</h2>
      <ul>
        <li>
          <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Development pillar
          </Link>
        </li>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Pricing guide
          </Link>
        </li>
        <li>
          <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            CMS vs custom development
          </Link>
        </li>
      </ul>
    </>
  );
}
