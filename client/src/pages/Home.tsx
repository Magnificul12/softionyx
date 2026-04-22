import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'SoftIonyx Technologies',
    url: 'https://softionyx.com',
    logo: 'https://softionyx.com/logo.png',
    image: 'https://softionyx.com/og-image.jpg',
    description:
      'Soluții IT profesionale: dezvoltare web, aplicații mobile, frontend & backend, blockchain analytics și servicii de programare.',
    priceRange: '$$',
    areaServed: 'Worldwide',
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'Backend Development',
      'Frontend Development',
      'Blockchain Analytics',
      'Custom Software Development',
    ],
  };

  return (
    <>
      <SEO
        title="SoftIonyx - Soluții IT Profesionale & Dezvoltare Software"
        description="SoftIonyx oferă soluții IT profesionale: dezvoltare web, aplicații mobile, backend, frontend, blockchain și servicii de programare. Transformăm ideile tale în produse digitale de impact."
        keywords="dezvoltare web, IT solutions, software development, aplicații mobile, blockchain, programare, SoftIonyx, agenție IT, Romania"
        url="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <Services />
      <About />
      <Contact />
    </>
  );
}
