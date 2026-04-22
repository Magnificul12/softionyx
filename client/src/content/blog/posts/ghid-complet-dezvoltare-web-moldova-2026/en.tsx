import { LangLink as Link } from '../../../../i18n/routing';

/** Pillar — same heading ids as ro.tsx / posts.json toc */
export default function Article() {
  return (
    <>
      <h2 id="context-piata">Context: what “web development” means today</h2>
      <p>
        Expectations have matured: a website is rarely just a brochure. It is often a
        sales channel, hiring surface, or operations tool. Web development now spans
        product thinking, design, frontend/backend engineering, integrations (payments,
        CRM, ERP), security, performance, and ongoing operations after launch.
      </p>
      <p>
        This guide is the <strong>pillar</strong> of a wider cluster. Read it end-to-end
        or jump to a section. Satellite articles go deeper on{' '}
        <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          pricing and budgets
        </Link>
        ,{' '}
        <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          CMS vs custom
        </Link>
        , and{' '}
        <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          hosting &amp; performance
        </Link>
        .
      </p>

      <h2 id="tipuri-proiecte">Project types and what you actually ship</h2>
      <p>
        Most requests fall into four families: <strong>marketing sites</strong> (lead
        gen), <strong>corporate</strong> (richer structure and integrations),{' '}
        <strong>e-commerce</strong> (catalog, checkout, logistics), and{' '}
        <strong>custom web apps</strong> (SaaS, portals, internal workflows). Each has a
        different risk profile, delivery cadence, and maintenance footprint.
      </p>
      <ul>
        <li>
          <strong>Marketing</strong> — fast launch, clear messaging, CTAs, solid
          analytics.
        </li>
        <li>
          <strong>Corporate</strong> — editorial roles, multilingual setups, advanced
          forms.
        </li>
        <li>
          <strong>Online store</strong> — stock, VAT, carriers; mistakes hit revenue
          directly.
        </li>
        <li>
          <strong>Custom app</strong> — your own data model, permissions, audit trails;
          templates rarely fit.
        </li>
      </ul>

      <h2 id="faza-strategie">Phase 1 — Strategy, brief, and information architecture</h2>
      <p>
        Before pixels and code, align on measurable goals: leads, sales, self-service,
        support deflection, etc. A solid brief answers who the audience is, which
        actions matter, what content already exists, and who maintains it post-launch.
      </p>
      <p>
        Information architecture (logical sitemap, user flows) prevents expensive
        mid-project pivots. Skipping this phase usually shows up later as a redesign or a
        module rewrite — the classic “rush tax”.
      </p>

      <h2 id="design-ux-ui">Phase 2 — UX, UI, and a pragmatic design system</h2>
      <p>
        UX defines journeys: how quickly someone finds the critical information. UI
        brings consistency: typography, spacing, error states, basic accessibility
        (contrast, focus, meaningful labels).
      </p>
      <p>
        Even a small design system helps you scale: reusable components, fewer one-off
        screens, faster onboarding for new developers.
      </p>

      <h2 id="implementare-tehnica">Phase 3 — Engineering: frontend, backend, integrations</h2>
      <p>
        Frontend is what users see: semantic HTML, CSS, JavaScript, and loading
        optimizations. Backend holds business logic, sensitive data, authentication, and
        third-party integrations. Modern stacks blur the boundary (APIs, SSR, edge), but
        responsibilities stay distinct.
      </p>
      <p>
        Treat integrations as first-class deliverables: timeouts, retries, structured
        logging, payment reconciliation. Many delays come from integrations negotiated
        only verbally, without acceptance criteria.
      </p>

      <h2 id="cms-custom-headless">CMS, custom, headless: choosing a model</h2>
      <p>
        <strong>Classic CMS</strong> (editorial UI + templates) accelerates content workflows and
        MVPs. <strong>Headless CMS</strong> separates content from presentation — useful
        for multi-channel publishing. <strong>Custom</strong> gives full control but
        costs more upfront and demands disciplined maintenance.
      </p>
      <p>
        Pick technology for your team, catalog complexity, and horizon — not trends.
        See the dedicated comparison in{' '}
        <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          CMS vs custom development
        </Link>
        .
      </p>

      <h2 id="ecommerce-seo-tehnic">E-commerce, payments, and technical SEO foundations</h2>
      <p>
        For stores, technical SEO starts with a category structure crawlers understand,
        stable URLs, product structured data where appropriate, and strong mobile
        performance. Payments should follow PCI DSS via certified providers — do not
        store raw card data without serious security expertise.
      </p>
      <p>
        If you sell cross-border, clarify VAT, invoicing, and returns inside the
        checkout flow — it affects both conversion and support volume.
      </p>

      <h2 id="securitate-performance">Security, performance, and QA</h2>
      <p>
        Security is ongoing: dependency updates, access control, API rate limiting, CSRF
        protections where needed, tested backups, and a restore playbook. Performance
        (LCP, INP, CLS) influences rankings and conversion — especially on mobile
        networks on mobile and for users abroad.
      </p>
      <p>
        QA should cover real scenarios: failed payments, cart edge cases, validation
        errors, upload limits. Test automation can wait; manual regressions become
        expensive after the first year of continuous change.
      </p>

      <h2 id="hosting-devops">Hosting, domains, SSL, and continuous delivery</h2>
      <p>
        Choose environments with baseline monitoring (uptime, latency, 5xx spikes) and
        explicit backup policies. SSL is table stakes; renewals and HTTP→HTTPS redirects
        must be re-checked on every migration.
      </p>
      <p>
        Continuous delivery (build, test, deploy) lowers launch anxiety and enables
        incremental improvements. For infrastructure and Core Web Vitals, read{' '}
        <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          hosting &amp; performance
        </Link>
        .
      </p>

      <h2 id="buget-timeline">Budget, timelines, and contracts — what is realistic in 2026</h2>
      <p>
        Budget for more than “initial build”: content, licenses, integrations, testing,
        and a stabilization window after go-live. Realistic schedules leave room for
        legal/compliance feedback and for learning from real analytics.
      </p>
      <p>
        For price bands and examples, see the{' '}
        <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          pricing guide
        </Link>
        .
      </p>

      <h2 id="alegere-furnizor">Choosing a partner (agency vs freelancer)</h2>
      <p>
        Look for cases similar to yours, not only visual polish. Ask for references,
        clarify product ownership, and inspect how communication works during a sprint.
        Strong partners push back on risky scope and propose sensible phasing.
      </p>
      <p>
        Transparency on code and repository access reduces vendor lock-in. Minimal
        documentation (local runbook, env vars, deploy steps) is part of the deliverable.
      </p>

      <h2 id="greseli-frecvente">Common mistakes that inflate cost or delay launches</h2>
      <ul>
        <li>Unbounded scope without a defined MVP.</li>
        <li>Final content arriving in launch week — blocks design and SEO.</li>
        <li>Ignoring performance until the end — refactors cost more than incremental tuning.</li>
        <li>No internal product owner — decisions stall or contradict.</li>
        <li>Integrations without written specs or acceptance tests.</li>
      </ul>

      <h2 id="checklist-lansare">Pre-launch checklist</h2>
      <ul>
        <li>301 redirects for legacy URLs; correct canonical tags.</li>
        <li>Robots and sitemaps updated; staging routes removed from index.</li>
        <li>Error monitoring and payment logging in place.</li>
        <li>Cookie consent aligned with your legal policy.</li>
        <li>Backup drill completed; rollback runbook documented.</li>
        <li>Baseline structured data (Organization/WebSite/Article as applicable).</li>
      </ul>

      <h2 id="seria-dezvoltare-web">Continue the series — recommended satellites</h2>
      <p>Go deeper with these companion articles:</p>
      <ul>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Website budget 2026 — scenarios and numbers
          </Link>
        </li>
        <li>
          <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            CMS vs custom development — how to decide
          </Link>
        </li>
        <li>
          <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Hosting, DNS, and Core Web Vitals
          </Link>
        </li>
      </ul>
      <p>
        Want this playbook applied to your project?{' '}
        <Link to="/contact" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          Contact SoftIonyx
        </Link>{' '}
        — we will phase the work to match your goals.
      </p>
    </>
  );
}
