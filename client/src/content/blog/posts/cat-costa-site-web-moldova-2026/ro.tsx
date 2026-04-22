import { LangLink, LangLink as Link } from '../../../../i18n/routing';

/**
 * Article body. Uses `.prose-soft` typography from index.css and exposes
 * stable `id` attributes on every heading so the sidebar TOC can scroll to
 * them and highlight the active section.
 */
export default function Article() {
  return (
    <>
      <h2 id="introducere">De ce variază atât de mult prețul unui site web</h2>
      <p>
        Dacă ai cerut vreodată oferte pentru un site web (în Europa sau oriunde), probabil ai
        văzut variații uriașe: 500 EUR de la un freelancer, 3.000 EUR de la o
        agenție locală, 15.000 EUR de la una mai mare. Toate pentru „același”
        site, cel puțin în ochii clientului.
      </p>
      <p className="text-sm text-slate-400">
        Acest articol face parte din seria{' '}
        <LangLink
          to="/blog/ghid-complet-dezvoltare-web-moldova-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          ghidul complet de dezvoltare web
        </LangLink>
        — citește și{' '}
        <LangLink
          to="/blog/cms-vs-dezvoltare-custom-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          CMS vs dezvoltare custom
        </LangLink>{' '}
        și{' '}
        <LangLink
          to="/blog/hosting-performance-web-moldova-2026"
          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
        >
          hosting &amp; performanță
        </LangLink>
        .
      </p>
      <p>
        În realitate, <strong>prețul unui site web reflectă trei lucruri</strong>: cât
        de complex este produsul tehnic (un landing simplu vs. un e-commerce cu
        plăți și stocuri), cât timp petrece echipa pe el (design, dezvoltare,
        QA, corecții), și ce responsabilitate își asumă furnizorul după livrare
        (SEO, hosting, mentenanță, suport).
      </p>
      <p>
        În acest ghid, îți arătăm <strong>intervale de preț realiste pentru 2026</strong>, pe patru categorii de site-uri, plus factorii care
        umflă sau reduc costul, costurile ascunse pe care nimeni nu le
        menționează și cum să ceri o ofertă corectă ca să nu plătești de două
        ori.
      </p>

      <div className="not-prose my-8 p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
        <p className="text-sm text-indigo-200 font-medium mb-2">Pe scurt (TL;DR)</p>
        <ul className="text-sm text-slate-300 space-y-1.5 list-disc pl-5">
          <li>Landing page simplu: <strong className="text-white">500 – 1.500 EUR</strong></li>
          <li>Site corporativ (5-10 pagini): <strong className="text-white">1.500 – 4.500 EUR</strong></li>
          <li>Magazin online (e-commerce): <strong className="text-white">2.500 – 15.000 EUR</strong></li>
          <li>Aplicație web custom / SaaS: <strong className="text-white">6.000 – 30.000+ EUR</strong></li>
        </ul>
      </div>

      <h2 id="tipuri-de-site-uri">Tipuri de site-uri și prețuri reale în 2026</h2>
      <p>
        Mai jos găsești intervalele reale pe care le vezi la agenții și studio-uri
        serioase din regiune (inclusiv Europa de Est). Freelancerii individuali pot merge sub plafonul
        minim — dar, statistic, 70% din proiectele livrate „ieftin” ajung să fie
        refăcute în 12-18 luni.
      </p>

      <h3 id="landing-page">1. Landing page / site de prezentare simplu</h3>
      <p>
        <strong>Preț orientativ: 500 – 1.500 EUR.</strong> Un landing page este
        o singură pagină (sau 2-3 maximum) focusată pe o singură conversie:
        formular de contact, rezervare, înscriere la newsletter sau descărcare
        de broșură.
      </p>
      <p>
        <strong>Cât timp durează:</strong> 1-3 săptămâni. <strong>Ce include:</strong>
      </p>
      <ul>
        <li>Design personalizat (sau adaptare template premium)</li>
        <li>Responsive pe mobil, tabletă, desktop</li>
        <li>Formular de contact + anti-spam</li>
        <li>SEO de bază (meta tags, structured data, sitemap)</li>
        <li>Integrare analytics (Google Analytics, Pixel Meta)</li>
        <li>Hosting + domeniu configurat primul an</li>
      </ul>
      <p>
        <strong>Pentru cine:</strong> afaceri locale care lansează un serviciu
        sau un produs, campanii de marketing cu buget limitat, profesioniști
        independenți (avocați, consultanți, medici privați).
      </p>
      <p>
        <em>Exemplu:</em> un landing pentru o cabinetă stomatologică cu formular
        de programare și integrare calendar → aproximativ 900 EUR + 15 EUR/lună
        hosting, livrat în 2 săptămâni.
      </p>

      <h3 id="site-corporativ">2. Site corporativ / business</h3>
      <p>
        <strong>Preț orientativ: 1.500 – 4.500 EUR.</strong> Acesta este
        „site-ul clasic” pe care îl au majoritatea companiilor mici și medii:
        5-15 pagini (Acasă, Despre, Servicii, Portofoliu, Blog, Contact), design
        personalizat, CMS pentru actualizări și SEO structurat.
      </p>
      <p>
        <strong>Cât timp durează:</strong> 4-8 săptămâni. <strong>Ce primești în plus față de un landing:</strong>
      </p>
      <ul>
        <li>Arhitectură informațională profesionistă (sitemap, user flow)</li>
        <li>Design UI complet (10-20 ecrane), prototip Figma aprobat înainte de cod</li>
        <li>CMS (panou admin) pentru a edita texte, poze, blog fără developer</li>
        <li>Blog integrat cu SEO, categorii, tags</li>
        <li>Multi-limbă (RO / RU / EN) — opțional, +20-30% la preț</li>
        <li>Integrări: Google Maps, chat live, newsletter, CRM</li>
        <li>Page speed optimizat (sub 2 secunde LCP)</li>
        <li>Training 1-2h pentru echipa internă</li>
      </ul>
      <p>
        <strong>Pentru cine:</strong> firme de servicii (consultanță, imobiliare,
        construcții, avocatură, clinici), ONG-uri, producători locali care
        vând prin distribuitori și au nevoie de prezență online serioasă.
      </p>
      <p>
        <em>Exemplu real:</em> site pentru o firmă de construcții (8 pagini + portfolio
        dinamic + 3 limbi) → ~3.200 EUR, livrat în ~6 săptămâni.
      </p>

      <h3 id="e-commerce">3. Magazin online (e-commerce)</h3>
      <p>
        <strong>Preț orientativ: 2.500 – 15.000 EUR.</strong> Aici intervalul
        este mare pentru că „e-commerce” înseamnă lucruri foarte diferite: de
        la un mini-magazin SaaS cu zeci de SKU, la un magazin custom cu
        1.000+ SKU, variante de produs, prețuri pe cantități și integrare
        CRM+ERP.
      </p>
      <p>
        <strong>Sub-categorii de preț:</strong>
      </p>
      <ul>
        <li>
          <strong>Magazin pe platformă SaaS gata configurată</strong> (2.500 – 5.000 EUR):
          temă personalizată, plăți locale și internaționale, curieri, facturare de bază.
          Ideal până la câteva sute de SKU cu flux B2C standard.
        </li>
        <li>
          <strong>E-commerce mediu custom</strong> (5.000 – 10.000 EUR): design
          complet original, funcții avansate (recenzii, wishlist, program fidelitate,
          filtrare sofisticată, search cu autocomplete), integrare ERP/contabilitate
          (1C, SAP), PWA.
        </li>
        <li>
          <strong>E-commerce complex / multi-store</strong> (10.000 – 15.000+
          EUR): platforme cu mai multe mărci, vânzare B2B cu prețuri negociate,
          sincronizare stocuri live în mai multe magazine fizice, integrare
          marketplace (eMAG, 999.md, Amazon).
        </li>
      </ul>
      <p>
        <strong>Ce se adaugă mereu peste costul de dezvoltare:</strong> hosting
        dedicat (30-100 EUR/lună), mentenanță (200-800 EUR/lună), comisioane
        pentru procesatori de plăți (1-2.5% per tranzacție).
      </p>

      <h3 id="aplicatie-custom">4. Aplicație web custom (SaaS, portal, platformă)</h3>
      <p>
        <strong>Preț orientativ: 6.000 – 30.000+ EUR.</strong> Aplicațiile custom
        sunt proiecte unde site-ul nu e vitrină, ci produsul însuși: un portal
        pentru clienți, un SaaS B2B, o platformă de rezervări, un sistem intern
        de management.
      </p>
      <p>
        <strong>Ce face prețul să crească:</strong>
      </p>
      <ul>
        <li>Autentificare avansată (2FA, SSO, roluri complexe)</li>
        <li>Backend custom cu baze de date complexe</li>
        <li>Dashboard analitic și rapoarte personalizate</li>
        <li>Integrări multiple (API-uri externe, CRM, ERP, plăți recurente)</li>
        <li>Real-time (chat, notificări, colaborare simultană)</li>
        <li>Aplicație mobilă companion (React Native, +50-80% la costul total)</li>
      </ul>
      <p>
        <strong>Modul de livrare:</strong> aceste proiecte se fac în sprints
        (2 săptămâni), cu MVP livrat în 2-4 luni, urmat de iterații. Niciodată nu
        sunt „terminate” — cresc organic cu afacerea.
      </p>
      <p>
        <strong>Pentru cine:</strong> startup-uri care construiesc produs
        propriu, firme mari care vor să digitalizeze procese interne (HR,
        logistică, producție), aggregators de servicii (booking, marketplace
        vertical).
      </p>

      <h2 id="factori-pret">Ce factori umflă (sau reduc) prețul final</h2>
      <p>
        Chiar și în aceeași categorie, două site-uri pot avea costuri duble.
        Iată de ce:
      </p>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white font-medium">Factor</th>
              <th className="text-left py-3 px-4 text-white font-medium">Impact asupra prețului</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Design 100% custom vs template</td>
              <td className="py-3 px-4 text-emerald-400">+40-70%</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Multi-limbă (RO / EN / RU)</td>
              <td className="py-3 px-4 text-emerald-400">+20-30%</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Integrare CRM / ERP existent</td>
              <td className="py-3 px-4 text-emerald-400">+500 – 3.000 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Plăți online (Maib, Stripe, crypto)</td>
              <td className="py-3 px-4 text-emerald-400">+200 – 800 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Aplicație mobilă companion</td>
              <td className="py-3 px-4 text-emerald-400">+4.000 – 12.000 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">SEO tehnic avansat (structured data, prerender)</td>
              <td className="py-3 px-4 text-emerald-400">+300 – 1.200 EUR</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-3 px-4">Livrare urgentă (timeline redus cu 50%)</td>
              <td className="py-3 px-4 text-emerald-400">+25-50%</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Template premium + personalizare minimă</td>
              <td className="py-3 px-4 text-rose-400">-30-50%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cms-vs-custom">CMS / headless vs dezvoltare custom — cum decizi</h2>
      <p>
        A doua decizie mare după tipul de site: cât de mult „cumperi” din raft (CMS,
        SaaS) versus cât construiești la cheie. Detalii și criterii:{' '}
        <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          ghidul CMS vs custom
        </Link>
        . Pe scurt:
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">CMS (clasic sau headless)</h3>
      <ul>
        <li><strong>Cost:</strong> de obicei sub bugetul unui produs custom echivalent</li>
        <li><strong>Timp:</strong> adesea mai scurt pentru site-uri conținut-dominante</li>
        <li><strong>Avantaje:</strong> echipa publică conținut fără developer la fiecare tweak</li>
        <li><strong>Risc:</strong> extensii și câmpuri fără disciplină → lent și greu de întreținut</li>
      </ul>

      <h3 className="!text-xl !mb-2 !mt-6">Site / aplicație custom (React, Node, etc.)</h3>
      <ul>
        <li><strong>Cost:</strong> mediu-mare (2.000–30.000+ EUR în funcție de complexitate)</li>
        <li><strong>Timp:</strong> mediu-lung (4–16+ săptămâni)</li>
        <li><strong>Avantaje:</strong> performanță, control, scalare, model de date propriu</li>
        <li><strong>Dezavantaje:</strong> buget de mentenanță; fără CMS trebuie planificat fluxul editorial</li>
        <li><strong>Alege custom dacă:</strong> produsul digital e afacerea ta sau ai fluxuri care nu se mapează pe șabloane</li>
      </ul>

      <h3 className="!text-xl !mb-2 !mt-6">Magazin pe platformă SaaS</h3>
      <ul>
        <li><strong>Cost:</strong> personalizare + abonament lunar la furnizor</li>
        <li><strong>Timp:</strong> relativ scurt pentru fluxuri standard</li>
        <li><strong>Avantaje:</strong> checkout și plăți deja integrate, mai puțină inginerie de bază</li>
        <li><strong>Dezavantaje:</strong> comisioane și limite la reguli atipice de business</li>
      </ul>

      <h2 id="costuri-ascunse">Costuri ascunse pe care nimeni nu le menționează</h2>
      <p>
        Aici pierde bani 80% din clienții care cer oferta „doar pentru site”.
        Costul real include:
      </p>
      <ol>
        <li>
          <strong>Hosting și domeniu</strong> (50-1.200 EUR/an): un site
          corporativ merge pe hosting shared (~50-150 EUR/an). Un e-commerce
          serios are nevoie de VPS sau cloud (300-1.200 EUR/an).
        </li>
        <li>
          <strong>Mentenanță</strong> (100-800 EUR/lună): update-uri de
          securitate, backup-uri, monitoring uptime, fix-uri rapide. Fără asta,
          site-ul se va strica în 6-12 luni.
        </li>
        <li>
          <strong>Conținut</strong> (variabil, des neevaluat): texte scrise
          profesionist — 30-80 EUR per pagină. Fotografie profesională —
          200-800 EUR o sesiune. Video — 500-3.000 EUR.
        </li>
        <li>
          <strong>Traducere profesională</strong> (30-50 EUR per 1.000 caractere):
          Google Translate nu e acceptabil pentru un business serios — penalizare
          SEO și impresie proastă.
        </li>
        <li>
          <strong>SEO continuu</strong> (200-1.500 EUR/lună): site-ul nou nu
          apare automat pe Google pe poziția 1. Ai nevoie de content marketing,
          linking, optimizare continuă (vezi{' '}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/services/seo-optimizare">
            serviciul nostru de SEO
          </Link>
          ).
        </li>
        <li>
          <strong>Certificate SSL, licențe plugin, fonturi premium</strong>
          (100-500 EUR/an): adesea ascunse până la lansare.
        </li>
        <li>
          <strong>Schimbări post-livrare</strong> (50-100 EUR/oră): orice
          modificare după „go live” e facturată separat, cu excepția cazurilor
          când ai un contract de mentenanță.
        </li>
      </ol>
      <p>
        <strong>Regula de buzunar:</strong> bugetează <strong>+30-50% peste
        costul de dezvoltare</strong> pentru primul an — ca să nu fii prins pe
        picior greșit.
      </p>

      <h2 id="cum-ceri-oferta">Cum ceri o ofertă corectă (și compari ofertele)</h2>
      <p>
        Ofertele pe care le primești vor arăta complet diferit dacă nu ceri
        corect. Iată cum trebuie formulat brief-ul tău ca să primești oferte
        comparabile:
      </p>

      <ol>
        <li>
          <strong>Obiectivul de business</strong> (nu „vreau un site”):
          „vreau 50 de programări/lună prin site”, „vreau să încasez 3.000 EUR
          pe lună din magazin”, „vreau să-mi reduc apelurile telefonice cu 40%”.
        </li>
        <li>
          <strong>Audiența țintă:</strong> cine va folosi site-ul — clienți
          locali, firme, turiști străini, angajați? Limbi?
        </li>
        <li>
          <strong>Funcționalități obligatorii:</strong> listă clară, nu
          „magazin ca Amazon”. Exemplu: „catalog 200 produse, variante
          culori+mărime, plăți Maib+Stripe, livrare Nova Poshta + pickup, cupoane,
          program fidelitate”.
        </li>
        <li>
          <strong>Integrări obligatorii:</strong> numește-le (Mailchimp, 1C,
          SendGrid, WhatsApp Business, Zoom API). Impactul e mare.
        </li>
        <li>
          <strong>Exemple de site-uri care îți plac</strong> (3-5 link-uri):
          furnizorul estimează mult mai realist dacă vede referințe.
        </li>
        <li>
          <strong>Buget orientativ</strong> (interval, nu sumă exactă):
          „între 3.000 și 5.000 EUR”. Da, zi-le. Vei primi oferte în bugetul
          tău, nu cereri care te forțează să renegociezi totul.
        </li>
        <li>
          <strong>Termen de livrare dorit:</strong> urgent sau relaxat.
          Timelines scurte costă mai mult.
        </li>
        <li>
          <strong>Ce vei furniza tu:</strong> logo, texte, poze, acces la
          hosting existent, date, etc. Agenția nu ghicește.
        </li>
      </ol>

      <p>
        <strong>Când compari ofertele, verifică:</strong>
      </p>
      <ul>
        <li>Câte runde de feedback include? (standard: 2-3 per fază)</li>
        <li>Ce e inclus în garanție post-livrare? (standard: 30-90 zile fix bugs)</li>
        <li>Primești codul sursă la final? Ce licență?</li>
        <li>Ce tehnologii folosește? (poți angaja alt developer ca să continue?)</li>
        <li>Cine face hosting-ul? Sunt backup-urile incluse?</li>
        <li>Cum se face facturarea? (25%+25%+25%+25% e standard)</li>
      </ul>

      <h2 id="faq">Întrebări frecvente</h2>

      <h3 className="!text-xl !mb-2 !mt-6">Pot avea un site la 200 EUR?</h3>
      <p>
        Tehnic da — cu un template gata, fără design custom, fără texte proprii,
        fără suport. Practic, pentru un business serios, este pierdere de timp.
        Sub 500 EUR, primești un site pe care-l refaci în 6 luni.
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">De ce agenția X cere 4.000 EUR și agenția Y cere 8.000 EUR pentru „același” site?</h3>
      <p>
        În 90% din cazuri nu e „același” site — diferă în: nivel design, număr
        runde de feedback, garanție, timp de suport, tehnologie, persoane
        senior vs junior pe proiect. Cere breakdown pe task-uri și zile.
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">Cât ar trebui să aloc pentru mentenanță?</h3>
      <p>
        Regula: <strong>10-20% din costul de dezvoltare pe an</strong>. Pentru
        un site de 3.000 EUR — 300-600 EUR/an. Pentru un e-commerce de 10.000 EUR —
        1.000-2.000 EUR/an.
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">Pot migra mai târziu de la un CMS clasic la custom?</h3>
      <p>
        Da, dar costă — de obicei refaci front-ul și imporți conținutul/modelul de date.
        Dacă știi că vei scala mult, merită evaluat custom (sau headless) din start.
      </p>

      <h3 className="!text-xl !mb-2 !mt-6">Merită să plătesc mai mult pentru SEO inclus?</h3>
      <p>
        Da, dar numai dacă „SEO” înseamnă concret: structured data, sitemap,
        performanță, audit keywords, meta tags scrise profesional. „Optimizare
        SEO” generică și nefăcută explicit e <em>marketing-speak</em>.
      </p>

      <h2 id="concluzie">Concluzie: cât să aloci, realistic?</h2>
      <p>
        <strong>Dacă ai o afacere mică-medie și vrei un site care să
        conteze</strong>, bugetul realist total pentru primul an (site +
        conținut + hosting + SEO + mentenanță) este:
      </p>
      <ul>
        <li>
          <strong>Freelancer / studio mic:</strong> 1.500 – 3.500 EUR
          pentru un site de prezentare funcțional. Bun pentru început,
          limitat pentru creștere.
        </li>
        <li>
          <strong>Agenție medie (Europa de Est / similar):</strong> 3.500 – 8.000 EUR
          pentru un site complet, profesionist, cu SEO și mentenanță. Zona
          optimă pentru 80% dintre afacerile locale.
        </li>
        <li>
          <strong>Agenție completă / proiecte complexe:</strong> 8.000 –
          25.000+ EUR pentru e-commerce, platforme custom, produse SaaS.
        </li>
      </ul>
      <p>
        <strong>Recomandarea noastră:</strong> nu căuta „cel mai ieftin”. Caută
        cel mai <em>bun raport preț/valoare</em>. Un site de 4.000 EUR livrat
        corect generează mai mult venit într-un an decât un site de 1.000 EUR
        pe care-l refaci după 6 luni.
      </p>

      <div className="not-prose my-10 p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
        <p className="text-xl text-white font-medium mb-2">
          Vrei o estimare personalizată pentru proiectul tău?
        </p>
        <p className="text-slate-300 mb-5">
          Răspundem în 24h cu un breakdown clar, fără costuri ascunse.
          Consultația inițială este gratuită.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Cere ofertă gratuită
          </Link>
          <Link
            to="/services/dezvoltare-web"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-indigo-500/40 text-slate-200 font-medium transition-colors"
          >
            Vezi serviciul de dezvoltare web
          </Link>
        </div>
      </div>
    </>
  );
}
