import { LangLink as Link } from '../../../../i18n/routing';

export default function Article() {
  return (
    <>
      <h2 id="introducere">Why website prices vary so much</h2>
      <p>
        If you have ever requested quotes for a website (in Europe or anywhere), you have probably seen huge spreads:
        €500 from a freelancer, €3,000 from a local agency, €15,000 from a larger one — all for the “same” site, at least in the client’s eyes.
      </p>
      <p className="text-sm text-slate-400">
        Part of the{' '}
        <Link
          to="/blog/ghid-complet-dezvoltare-web-moldova-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          full web development guide
        </Link>{' '}
        series — also read{' '}
        <Link
          to="/blog/cms-vs-dezvoltare-custom-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          CMS vs custom development
        </Link>{' '}
        and{' '}
        <Link
          to="/blog/hosting-performance-web-moldova-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          hosting &amp; performance
        </Link>
        .
      </p>
      <p>
        In reality, <strong>a website price reflects three things</strong>: how technically complex the product is (a simple landing vs. e-commerce with payments and stock),
        how much time the team spends on it (design, development, QA, revisions), and what responsibility the vendor takes after launch (SEO, hosting, maintenance, support).
      </p>
      <p>
        In this guide we share <strong>realistic 2026 price bands</strong> across four site categories, factors that raise or lower cost,
        hidden costs people rarely mention, and how to brief vendors so you do not pay twice.
      </p>

      <div className="not-prose my-8 p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
        <p className="text-sm text-indigo-200 font-medium mb-2">TL;DR</p>
        <ul className="text-sm text-slate-300 space-y-1.5 list-disc pl-5">
          <li>Simple landing: <strong className="text-white">500 – 1,500 EUR</strong></li>
          <li>Corporate site (5–10 pages): <strong className="text-white">1,500 – 4,500 EUR</strong></li>
          <li>Online store (e-commerce): <strong className="text-white">2,500 – 15,000 EUR</strong></li>
          <li>Custom web app / SaaS: <strong className="text-white">6,000 – 30,000+ EUR</strong></li>
        </ul>
      </div>

      <h2 id="tipuri-de-site-uri">Website types and real 2026 price bands</h2>
      <p>
        Below are realistic ranges from serious agencies and studios in the region (including Eastern Europe). Solo freelancers may quote below the floor — but roughly 70% of “cheap”
        deliveries are rebuilt within 12–18 months.
      </p>

      <h3 id="landing-page">1. Landing page / simple brochure site</h3>
      <p>
        <strong>Typical budget: 500 – 1,500 EUR.</strong> A landing is one page (or 2–3 max) focused on a single conversion: contact form, booking, newsletter signup, or brochure download.
      </p>
      <p>
        <strong>Timeline:</strong> 1–3 weeks. <strong>Usually includes:</strong>
      </p>
      <ul>
        <li>Custom design (or premium template adaptation)</li>
        <li>Responsive layout for mobile, tablet, desktop</li>
        <li>Contact form + anti-spam</li>
        <li>Basic SEO (meta tags, structured data, sitemap)</li>
        <li>Analytics (Google Analytics, Meta Pixel)</li>
        <li>Hosting + domain set up for year one</li>
      </ul>
      <p>
        <strong>Best for:</strong> local businesses launching a service or product, tight-budget campaigns, independent professionals (lawyers, consultants, private clinics).
      </p>
      <p>
        <em>Example:</em> a dental clinic landing with booking form and calendar integration → about €900 + ~€15/mo hosting, delivered in 2 weeks.
      </p>

      <h3 id="site-corporativ">2. Corporate / business website</h3>
      <p>
        <strong>Typical budget: 1,500 – 4,500 EUR.</strong> The “classic” site for most SMBs: 5–15 pages (Home, About, Services, Portfolio, Blog, Contact),
        custom design, CMS for updates, structured SEO.
      </p>
      <p>
        <strong>Timeline:</strong> 4–8 weeks. <strong>Compared with a landing you also get:</strong>
      </p>
      <ul>
        <li>Professional information architecture (sitemap, user flows)</li>
        <li>Full UI design (10–20 screens), Figma prototype signed off before code</li>
        <li>CMS (admin) to edit copy, images, and blog without a developer</li>
        <li>Blog with SEO, categories, tags</li>
        <li>Multi-language (RO / RU / EN) — optional, +20–30% to price</li>
        <li>Integrations: Google Maps, live chat, newsletter, CRM</li>
        <li>Optimized performance (under ~2s LCP)</li>
        <li>1–2h training for your team</li>
      </ul>
      <p>
        <strong>Best for:</strong> service firms (consulting, real estate, construction, law, clinics), NGOs, local manufacturers selling through distributors who need a credible web presence.
      </p>
      <p>
        <em>Real example:</em> a construction company site with 8 pages, dynamic portfolio, 3 languages → €3,200, delivered in 6 weeks.
      </p>

      <h3 id="e-commerce">3. Online store (e-commerce)</h3>
      <p>
        <strong>Typical budget: 2,500 – 15,000 EUR.</strong> The range is wide because “e-commerce” can mean a small SaaS-hosted catalog or a custom build with 1,000+ SKUs,
        variants, tiered pricing, and CRM+ERP integration.
      </p>
      <p>
        <strong>Price bands:</strong>
      </p>
      <ul>
        <li>
          <strong>Hosted SaaS storefront</strong> (2,500 – 5,000 EUR): theme work, local and international payments, carriers, basic invoicing — good for moderate SKU counts and standard B2C.
        </li>
        <li>
          <strong>Mid custom e-commerce</strong> (5,000 – 10,000 EUR): fully original design, advanced features (reviews, wishlist, loyalty, rich filtering, autocomplete search),
          ERP/accounting hooks (1C, SAP), PWA.
        </li>
        <li>
          <strong>Complex / multi-store</strong> (10,000 – 15,000+ EUR): multiple brands, B2B with negotiated prices, live stock across physical stores, marketplace connectors (eMAG, 999.md, Amazon).
        </li>
      </ul>
      <p>
        <strong>Beyond build cost you should expect:</strong> dedicated hosting (€30–100/mo), maintenance (€200–800/mo), payment processor fees (about 1–2.5% per transaction).
      </p>

      <h3 id="aplicatie-custom">4. Custom web application (SaaS, portal, platform)</h3>
      <p>
        <strong>Typical budget: 6,000 – 30,000+ EUR.</strong> Here the website is the product itself: a client portal, B2B SaaS, booking platform, or internal operations system.
      </p>
      <p>
        <strong>What drives price up:</strong>
      </p>
      <ul>
        <li>Advanced auth (2FA, SSO, complex roles)</li>
        <li>Custom backend and non-trivial data models</li>
        <li>Analytics dashboards and custom reporting</li>
        <li>Many integrations (external APIs, CRM, ERP, recurring billing)</li>
        <li>Real-time (chat, notifications, live collaboration)</li>
        <li>Companion mobile app (React Native, often +50–80% to total cost)</li>
      </ul>
      <p>
        <strong>How it is delivered:</strong> two-week sprints, MVP in 2–4 months, then iterations. These products are never “finished” — they grow with the business.
      </p>
      <p>
        <strong>Best for:</strong> startups building their own product, enterprises digitizing HR/logistics/production, vertical marketplaces or booking aggregators.
      </p>

      <h2 id="factori-pret">What raises (or lowers) the final price</h2>
      <p>Even within one category, two builds can differ 2×. Here is why:</p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white font-medium">Factor</th>
              <th className="text-left py-3 px-4 text-white font-medium">Price impact</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">100% custom design vs template</td>
              <td className="py-3 px-4 text-emerald-400">+40–70%</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Multi-language (RO / EN / RU)</td>
              <td className="py-3 px-4 text-emerald-400">+20–30%</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Existing CRM / ERP integration</td>
              <td className="py-3 px-4 text-emerald-400">+500 – 3,000 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Online payments (Maib, Stripe, crypto)</td>
              <td className="py-3 px-4 text-emerald-400">+200 – 800 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Companion mobile app</td>
              <td className="py-3 px-4 text-emerald-400">+4,000 – 12,000 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Advanced technical SEO (structured data, prerender)</td>
              <td className="py-3 px-4 text-emerald-400">+300 – 1,200 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Rush delivery (~50% shorter timeline)</td>
              <td className="py-3 px-4 text-emerald-400">+25–50%</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Premium template + minimal customization</td>
              <td className="py-3 px-4 text-rose-400">-30–50%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cms-vs-custom">CMS / headless vs custom development — how to choose</h2>
      <p>
        Stack choice is the second big cost lever (after site category). See the dedicated{' '}
        <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          CMS vs custom guide
        </Link>
        . In short:
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">CMS (classic or headless)</h3>
      <ul>
        <li><strong>Cost:</strong> usually below an equivalent fully custom product</li>
        <li><strong>Time:</strong> often shorter for content-heavy sites</li>
        <li><strong>Pros:</strong> marketing can ship copy without a developer each time</li>
        <li><strong>Risk:</strong> extension sprawl and messy fields → slow, hard-to-maintain stacks</li>
      </ul>

      <h3 className="!text-xl !mb-2 !mt-6">Custom site / app (React, Node, etc.)</h3>
      <ul>
        <li><strong>Cost:</strong> medium–high (about €2,000–30,000+ depending on scope)</li>
        <li><strong>Time:</strong> medium–long (4–16+ weeks)</li>
        <li><strong>Pros:</strong> performance, control, scaling, your own data model</li>
        <li><strong>Cons:</strong> maintenance budget; without a CMS you must plan editorial workflows</li>
        <li><strong>Pick custom if:</strong> the digital product is the business or flows do not map to templates</li>
      </ul>

      <h3 className="!text-xl !mb-2 !mt-6">SaaS commerce platform</h3>
      <ul>
        <li><strong>Cost:</strong> customization + monthly vendor subscription</li>
        <li><strong>Time:</strong> relatively short for standard flows</li>
        <li><strong>Pros:</strong> checkout and payments largely pre-built, less baseline engineering</li>
        <li><strong>Cons:</strong> fees and limits on atypical business rules</li>
      </ul>

      <h2 id="costuri-ascunse">Hidden costs almost nobody lists upfront</h2>
      <p>This is where most “website-only” quotes break down. Real first-year cost also includes:</p>
      <ol>
        <li>
          <strong>Hosting + domain</strong> (€50–1,200/year): brochure sites often sit on shared hosting (~€50–150/year); serious e-commerce needs VPS/cloud (~€300–1,200/year).
        </li>
        <li>
          <strong>Maintenance</strong> (€100–800/mo): security updates, backups, uptime monitoring, hotfixes. Without it, sites degrade in 6–12 months.
        </li>
        <li>
          <strong>Content</strong> (highly variable): pro copy ~€30–80/page, photo sessions ~€200–800, video ~€500–3,000.
        </li>
        <li>
          <strong>Professional translation</strong> (~€30–50 per 1k characters): machine translation hurts SEO and trust for serious brands.
        </li>
        <li>
          <strong>Ongoing SEO</strong> (€200–1,500/mo): new sites do not rank #1 by default — you need content, links, and continuous optimization (see{' '}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/services/seo-optimizare">our SEO service</Link>).
        </li>
        <li>
          <strong>SSL, plugin licenses, premium fonts</strong> (€100–500/year): often “surprise” line items at launch.
        </li>
        <li>
          <strong>Post-launch changes</strong> (€50–100/hour): anything after go-live is usually billed unless you have a maintenance plan.
        </li>
      </ol>
      <p>
        <strong>Rule of thumb:</strong> budget <strong>+30–50% on top of build cost</strong> for year one so you are not caught off guard.
      </p>

      <h2 id="cum-ceri-oferta">How to brief for a fair quote (and compare bids)</h2>
      <p>Garbage in, garbage out — weak briefs produce incomparable proposals. Structure yours like this:</p>
      <ol>
        <li>
          <strong>Business outcome</strong> (not “I need a website”): e.g. “50 bookings/month via the site”, “€3k/mo store revenue”, “cut phone inquiries by 40%”.
        </li>
        <li>
          <strong>Audience:</strong> who uses the site — locals, businesses, tourists, employees? Which languages?
        </li>
        <li>
          <strong>Must-have features:</strong> be specific, not “Amazon-like store”. Example: “200 products, color+size variants, Maib+Stripe, Nova Poshta + pickup, coupons, loyalty”.
        </li>
        <li>
          <strong>Required integrations:</strong> name them (Mailchimp, 1C, SendGrid, WhatsApp Business, Zoom API) — they swing estimates heavily.
        </li>
        <li>
          <strong>Reference sites you like</strong> (3–5 URLs) — helps calibrate design/UX expectations.
        </li>
        <li>
          <strong>Budget range</strong> (not a single number): e.g. “€3k–5k”. Yes, share it — you get realistic bids instead of fantasy scopes.
        </li>
        <li>
          <strong>Desired deadline:</strong> rush costs more.
        </li>
        <li>
          <strong>What you will supply:</strong> logo, copy, photos, hosting access, data exports. Agencies cannot guess missing inputs.
        </li>
      </ol>
      <p><strong>When comparing quotes, check:</strong></p>
      <ul>
        <li>How many feedback rounds per phase? (2–3 is typical)</li>
        <li>Post-launch warranty window? (30–90 days bugfix is common)</li>
        <li>Do you receive source code? Under what license?</li>
        <li>Which stack — can another team take over?</li>
        <li>Who hosts? Are backups included?</li>
        <li>Payment schedule (25/25/25/25 milestones is typical)</li>
      </ul>

      <h2 id="faq">Frequently asked questions</h2>
      <h3 className="!text-xl !mb-2 !mt-6">Can I get a site for €200?</h3>
      <p>
        Technically yes — boilerplate template, no custom design, no real content strategy, no support. For a serious business it is a dead end; under €500 you usually rebuild within 6 months.
      </p>
      <h3 className="!text-xl !mb-2 !mt-6">Why does agency A quote €4k and agency B €8k for the “same” site?</h3>
      <p>
        In ~90% of cases it is not the same deliverable — design depth, feedback rounds, warranty, seniority on the team, stack, and support hours differ. Ask for a task-level breakdown.
      </p>
      <h3 className="!text-xl !mb-2 !mt-6">What should I budget annually for maintenance?</h3>
      <p>
        Rule: <strong>10–20% of build cost per year</strong>. A €3k site → €300–600/year; a €10k store → €1k–2k/year.
      </p>
      <h3 className="!text-xl !mb-2 !mt-6">Can I migrate from a classic CMS to custom later?</h3>
      <p>
        Yes, but it is usually a front-end rebuild plus content/model migration. If you already know you will scale hard, evaluate custom (or headless) earlier.
      </p>
      <h3 className="!text-xl !mb-2 !mt-6">Is bundled “SEO” worth paying extra for?</h3>
      <p>
        Only if it is concrete: structured data, sitemap, performance work, keyword research, professionally written meta. Vague “SEO included” is just <em>marketing-speak</em>.
      </p>

      <h2 id="concluzie">Conclusion: what budget is realistic?</h2>
      <p>
        <strong>If you run an SMB and want a site that actually performs</strong>, realistic all-in year-one budget (build + content + hosting + SEO + maintenance) looks like:
      </p>
      <ul>
        <li><strong>Freelancer / small studio:</strong> €1,500 – 3,500 for a solid brochure — good to start, limited headroom.</li>
        <li><strong>Mid-size regional agency:</strong> €3,500 – 8,000 for a full professional build with SEO and care — the sweet spot for many businesses.</li>
        <li><strong>Full-service / complex builds:</strong> €8,000 – 25,000+ for e-commerce, custom platforms, SaaS products.</li>
      </ul>
      <p>
        <strong>Our take:</strong> do not optimize for cheapest — optimize for <em>value per euro</em>. A €4k site done right usually out-earns a €1k site you rip out after half a year.
      </p>

      <div className="not-prose my-10 p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
        <p className="text-xl text-white font-medium mb-2">Want a tailored estimate?</p>
        <p className="text-slate-300 mb-5">
          We reply within 24 hours with a clear breakdown — no hidden line items. The initial consultation is free.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
            Request a free quote
          </Link>
          <Link to="/services/dezvoltare-web" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-indigo-500/40 text-slate-200 font-medium transition-colors">
            Web development service
          </Link>
        </div>
      </div>
    </>
  );
}
