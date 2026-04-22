import { LangLink, LangLink as Link } from '../../../../i18n/routing';

export default function Article() {
  return (
    <>
      <h2 id="intro-performanta">De ce infrastructura e parte din produs, nu „găzduire”</h2>
      <p>
        Utilizatorii asociază viteza cu încrederea în brand. Google folosește semnale de
        experiență (inclusiv Core Web Vitals) ca factori de ranking. Pe mobile și pe rețele
        variabile, optimizarea livrării conținutului contează și mai mult.
      </p>
      <p>
        Acest articol se leagă de{' '}
        <LangLink to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          pilonul de dezvoltare web
        </LangLink>{' '}
        — infrastructura e discutată acolo în contextul lansării; aici intrăm în detaliu
        practic.
      </p>

      <h2 id="domenii-dns">Domenii, DNS și SSL — bazele fără surprize</h2>
      <p>
        Înregistrarea domeniului (.md, .com sau alt TLD) trebuie să fie în contul tău sau
        al companiei tale, cu acces la DNS. Închiderea proiectului nu trebuie să blocheze
        domeniul la un furnizor necooperant.
      </p>
      <p>
        DNS-ul influențează timpul de rezoluție — folosiți TTL-uri rezonabile și evitați
        lanțuri inutile de CNAME. SSL: preferă Let&apos;s Encrypt sau certificate emise de
        CA recunoscute; configurați HSTS doar după ce redirecturile HTTP→HTTPS sunt
        verificate.
      </p>

      <h2 id="hosting-tipuri">Shared vs VPS vs cloud managed: ce alegi</h2>
      <p>
        <strong>Shared</strong> — cost mic, vecini necunoscuți pe același server, util
        pentru prototipuri. <strong>VPS</strong> — control mai bun, cere competență de
        administrare. <strong>Cloud managed</strong> (sau PaaS) — mai scump, dar reduce
        sarcina operațională pentru echipe mici.
      </p>
      <p>
        Pentru e-commerce sau date sensibile, izolarea și backup-urile automate sunt
        critice. Cereți furnizorului RPO/RTO (cât pierdeți date / cât durează restaurarea)
        în scris.
      </p>

      <h2 id="cwv-seo">Core Web Vitals și legătura cu SEO</h2>
      <p>
        LCP măsoară încărcarea conținutului principal; INP reacția la interacțiuni; CLS
        stabilitatea vizuală. Nu sunt singurul factor SEO, dar îmbunătățirea lor reduce
        abandonul și crește conversia.
      </p>
      <p>
        Măsurați în Search Console și în Lighthouse pe throttling realist. Optimizați
        imaginile (dimensiuni corecte, WebP/AVIF unde e suportat), folosiți font-display
        potrivit și evitați layout shifts din reclame sau embed-uri fără dimensiuni
        rezervate.
      </p>

      <h2 id="optimizari">Optimizări rapide: imagini, cache, fonturi</h2>
      <ul>
        <li>
          Generați versiuni responsive ale imaginilor; folosiți <code>loading=&quot;lazy&quot;</code>{' '}
          pentru conținut sub fold.
        </li>
        <li>
          Cache la edge (CDN) pentru asset-uri statice; invalidare controlată la deploy.
        </li>
        <li>
          Limitați numărul de font-uri și greutăți; subsetare pentru limbi folosite.
        </li>
        <li>
          Minimizați JavaScript pe rutele critice; împachetați codul pe rute (code
          splitting).
        </li>
      </ul>

      <h2 id="legaturi-serie">Mai mult din aceeași serie</h2>
      <ul>
        <li>
          <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Ghid complet (pilon)
          </Link>
        </li>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Bugete și prețuri
          </Link>
        </li>
        <li>
          <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            CMS vs dezvoltare custom
          </Link>
        </li>
      </ul>
    </>
  );
}
