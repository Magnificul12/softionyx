/**
 * Language-agnostic service metadata for /services/:slug detail pages.
 *
 * Everything translatable (titles, copy, FAQ, pricing descriptions, etc.)
 * lives under the `services` i18n namespace — see:
 *   client/src/locales/{ro,en,ru}/services.json
 *
 * This file only holds data that is the same across all languages:
 * slugs, icons, accent colors, tech stack names, numeric prices, asset URLs,
 * and related-slug graph.
 *
 * IMPORTANT: If you rename a slug, also update:
 *   - scripts/generate-sitemap.js   (SERVICE_SLUGS array)
 *   - scripts/prerender.js          (ROUTES array)
 *   - client/src/components/Footer.tsx
 *   - client/src/locales/{ro,en,ru}/services.json  (the content.<slug> key)
 */

export type ServiceColor =
  | 'indigo'
  | 'purple'
  | 'emerald'
  | 'blue'
  | 'orange'
  | 'pink';

export type ServicePricingMeta = {
  priceFrom: number;
  priceCurrency: 'EUR' | 'MDL' | 'USD';
  popular?: boolean;
};

export type ServiceCaseStudyMeta = {
  url: string;
  image: string;
};

export type ServiceMeta = {
  slug: string;
  /** Short service type used in schema.org markup. Kept in English for
   *  vocabulary compatibility across locales. */
  serviceType: string;
  /** Lucide icon name. */
  icon: string;
  /** Tailwind color family used for accents. */
  color: ServiceColor;
  /** Tech / tool names (don't translate — these are product names). */
  techStack?: string[];
  /** Starting price — used in schema.org Offer markup and on the services index. */
  priceFrom?: number;
  priceCurrency?: 'EUR' | 'MDL' | 'USD';
  /** Optional pricing tier metadata. Translatable name/description/features
   *  come from i18n; only numeric prices + popular flag live here. */
  pricingMeta?: ServicePricingMeta[];
  /** Case study external link + image asset. Copy comes from i18n. */
  caseStudyMeta?: ServiceCaseStudyMeta;
  /** Multiple featured projects (carousel). When set, overrides a single `caseStudyMeta` for layout. */
  caseStudies?: ServiceCaseStudyMeta[];
  /** Related service slugs — surfaced at the bottom for internal linking. */
  related: string[];
};

export const SERVICES: ServiceMeta[] = [
  {
    slug: 'dezvoltare-web',
    serviceType: 'Web Development',
    icon: 'lucide:code-2',
    color: 'indigo',
    techStack: [
      'React', 'Next.js', 'TypeScript', 'Node.js',
      'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS',
    ],
    priceFrom: 800,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 800, priceCurrency: 'EUR' },
      { priceFrom: 2500, priceCurrency: 'EUR', popular: true },
      { priceFrom: 8000, priceCurrency: 'EUR' },
    ],
    caseStudies: [
      {
        url: 'https://rightmob.md',
        image: '/rightmob.png',
      },
      {
        url: 'https://easywasteremoval.ie/',
        image: '/easywaste-removal.png',
      },
      {
        url: 'https://cetateniero.md/',
        image: '/CetatetiaRo-Main.jpg',
      },
    ],
    related: ['aplicatii-mobile', 'e-commerce', 'software-custom'],
  },
  {
    slug: 'aplicatii-mobile',
    serviceType: 'Mobile App Development',
    icon: 'lucide:smartphone',
    color: 'purple',
    techStack: [
      'React Native', 'Flutter', 'Swift', 'Kotlin',
      'Firebase', 'Expo', 'Fastlane', 'TestFlight',
    ],
    priceFrom: 6000,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 6000, priceCurrency: 'EUR' },
      { priceFrom: 15000, priceCurrency: 'EUR', popular: true },
      { priceFrom: 25000, priceCurrency: 'EUR' },
    ],
    related: ['dezvoltare-web', 'software-custom', 'e-commerce'],
  },
  {
    slug: 'e-commerce',
    serviceType: 'E-commerce Development',
    icon: 'lucide:shopping-cart',
    color: 'emerald',
    techStack: [
      'Next.js', 'Medusa.js', 'Stripe', 'MAIB', 'PayNet',
      'PostgreSQL', 'Algolia',
    ],
    priceFrom: 1500,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 1500, priceCurrency: 'EUR' },
      { priceFrom: 4500, priceCurrency: 'EUR', popular: true },
      { priceFrom: 12000, priceCurrency: 'EUR' },
    ],
    related: ['dezvoltare-web', 'seo-optimizare', 'software-custom'],
  },
  {
    slug: 'software-custom',
    serviceType: 'Custom Software Development',
    icon: 'lucide:cpu',
    color: 'blue',
    techStack: [
      'TypeScript', 'React', 'Node.js', 'Python',
      'PostgreSQL', 'Redis', 'Docker', 'AWS / Azure',
    ],
    priceFrom: 10000,
    priceCurrency: 'EUR',
    caseStudyMeta: {
      url: 'https://work2now.com/',
      image: '/Work2Now.png',
    },
    related: ['dezvoltare-web', 'aplicatii-mobile', 'mentenanta-site'],
  },
  {
    slug: 'seo-optimizare',
    serviceType: 'SEO & Digital Marketing',
    icon: 'lucide:search',
    color: 'orange',
    techStack: [
      'Ahrefs', 'SEMrush', 'Google Search Console',
      'Google Analytics 4', 'Screaming Frog', 'Surfer SEO',
    ],
    priceFrom: 400,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 400, priceCurrency: 'EUR' },
      { priceFrom: 500, priceCurrency: 'EUR', popular: true },
      { priceFrom: 1500, priceCurrency: 'EUR' },
    ],
    related: ['dezvoltare-web', 'e-commerce', 'mentenanta-site'],
  },
  {
    slug: 'mentenanta-site',
    serviceType: 'Website Maintenance',
    icon: 'lucide:wrench',
    color: 'pink',
    techStack: [
      'Docker', 'Cloudflare', 'GitHub Actions', 'Sentry',
      'UptimeRobot', 'PostgreSQL', 'AWS / Vercel',
    ],
    priceFrom: 150,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 150, priceCurrency: 'EUR' },
      { priceFrom: 350, priceCurrency: 'EUR', popular: true },
      { priceFrom: 800, priceCurrency: 'EUR' },
    ],
    related: ['seo-optimizare', 'dezvoltare-web', 'cyber-security'],
  },
  {
    slug: 'cyber-security',
    serviceType: 'Cybersecurity',
    icon: 'lucide:shield',
    color: 'indigo',
    techStack: [
      'OWASP', 'Burp Suite', 'Metasploit', 'Nessus',
      'Splunk', 'CrowdStrike', 'Okta', 'Cloudflare',
    ],
    priceFrom: 2000,
    priceCurrency: 'EUR',
    related: ['software-custom', 'mentenanta-site', 'e-commerce'],
  },
  {
    slug: 'blockchain',
    serviceType: 'Blockchain Development',
    icon: 'lucide:blocks',
    color: 'purple',
    techStack: [
      'Solidity', 'Rust', 'Hardhat', 'Foundry',
      'Ethers.js', 'Web3.js', 'IPFS', 'The Graph',
    ],
    priceFrom: 100000,
    priceCurrency: 'EUR',
    pricingMeta: [
      { priceFrom: 100000, priceCurrency: 'EUR' },
      { priceFrom: 500000, priceCurrency: 'EUR', popular: true },
      { priceFrom: 1000000, priceCurrency: 'EUR' },
    ],
    related: ['software-custom', 'cyber-security', 'dezvoltare-web'],
  },
];

/** Helper to get service metadata by slug. */
export function getServiceBySlug(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** All slugs — useful for sitemap / prerender / static generation. */
export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

// ──────────────────────────────────────────────────────────────────────────
// i18n content accessor types — these mirror the shape of the JSON under
// `services.content.<slug>` and are used by ServiceDetail.tsx.
// ──────────────────────────────────────────────────────────────────────────

export type ServiceProcessStep = { title: string; description: string };
export type ServicePricingCopy = {
  name: string;
  description: string;
  features: string[];
};
export type ServiceCaseStudyCopy = {
  name: string;
  summary: string;
  highlights: string[];
};
export type ServiceFAQItem = { question: string; answer: string };
export type ServiceTestimonialCopy = {
  quote: string;
  author: string;
  role?: string;
};

/** Shape of the translated content block for a single service. */
export type ServiceContent = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  tagline: string;
  intro: string[];
  whatWeDo: string[];
  forWhom: string[];
  outcomes: string[];
  process: ServiceProcessStep[];
  pricing?: ServicePricingCopy[];
  caseStudy?: ServiceCaseStudyCopy;
  /** Multiple case studies; must align by index with `caseStudies` in `services.ts`. */
  caseStudies?: ServiceCaseStudyCopy[];
  /** One testimonial per case-study slide; index must match `caseStudies` / carousel order. */
  testimonials?: ServiceTestimonialCopy[];
  faq: ServiceFAQItem[];
  /** Fallback when `testimonials` is missing or shorter than the active slide index. */
  testimonial?: ServiceTestimonialCopy;
};
