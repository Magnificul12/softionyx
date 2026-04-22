import { SITE_URL } from '../components/SEO';

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildServiceSchema(service: {
  name: string;
  description: string;
  slug?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType || service.name,
    provider: {
      '@type': 'Organization',
      name: 'SoftIonyx Technologies',
      url: SITE_URL,
    },
    areaServed: 'Worldwide',
    ...(service.slug && { url: `${SITE_URL}/services/${service.slug}` }),
  };
}

export function buildJobPostingSchema(job: {
  title: string;
  description: string;
  department?: string;
  location?: string;
  employmentType?: string;
  datePosted?: string;
  validThrough?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || new Date().toISOString().split('T')[0],
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'SoftIonyx Technologies',
      sameAs: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    jobLocation: job.location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
            addressCountry: 'RO',
          },
        }
      : undefined,
    ...(job.department && { industry: job.department }),
    directApply: true,
  };
}

function mapEmploymentType(t?: string): string | string[] {
  if (!t) return 'FULL_TIME';
  const normalized = t.toLowerCase();
  if (normalized.includes('full')) return 'FULL_TIME';
  if (normalized.includes('part')) return 'PART_TIME';
  if (normalized.includes('contract')) return 'CONTRACTOR';
  if (normalized.includes('intern')) return 'INTERN';
  if (normalized.includes('temp')) return 'TEMPORARY';
  if (normalized.includes('remote')) return ['FULL_TIME', 'REMOTE'];
  return 'FULL_TIME';
}

/**
 * FAQPage schema — enables Google "rich result" with expandable Q&A snippets
 * directly in SERP. Huge CTR boost when it triggers.
 */
export function buildFAQPageSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * LocalBusiness / ProfessionalService schema — tells Google we're a legitimate
 * business in Moldova with real contact details. Critical for local SEO.
 */
export function buildLocalBusinessSchema(opts?: {
  latitude?: number;
  longitude?: number;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: 'SoftIonyx Technologies',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Agenție de dezvoltare software în Chișinău, Moldova. Aplicații web, mobile, e-commerce, blockchain și consultanță IT.',
    telephone: '+37378200341',
    priceRange: opts?.priceRange || '€€',
    areaServed: [
      { '@type': 'Country', name: 'Moldova' },
      { '@type': 'Country', name: 'Romania' },
      { '@type': 'Country', name: 'European Union' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chișinău',
      addressCountry: 'MD',
    },
    ...(opts?.latitude && opts?.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: opts.latitude,
            longitude: opts.longitude,
          },
        }
      : {}),
    sameAs: [
      'https://www.linkedin.com/company/softionyx-group/',
      'https://www.instagram.com/softionix.group',
    ],
  };
}

/**
 * Detailed Service schema with offers (pricing), provider details and area served.
 * Richer than the minimal variant; use on `/services/:slug` pages.
 */
export function buildDetailedServiceSchema(service: {
  name: string;
  description: string;
  slug: string;
  serviceType: string;
  priceFrom?: number;
  priceCurrency?: string;
  areaServed?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'SoftIonyx Technologies',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    areaServed: (service.areaServed || ['Moldova', 'Romania', 'European Union']).map(
      (name) => ({ '@type': 'Country', name })
    ),
    ...(service.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            price: service.priceFrom,
            priceCurrency: service.priceCurrency || 'EUR',
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: service.priceCurrency || 'EUR',
              price: service.priceFrom,
              minPrice: service.priceFrom,
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : `${SITE_URL}/og-image.jpg`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Organization',
      name: post.author || 'SoftIonyx Technologies',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SoftIonyx Technologies',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  };
}
