import { LangLink, LangLink as Link } from '../../../../i18n/routing';

/**
 * Pilon tematic (Faza 3) — hub pentru clusterul „dezvoltare-web”.
 * Id-urile headingurilor trebuie să rămână sincronizate cu posts.json → toc.
 */
export default function Article() {
  return (
    <>
      <h2 id="context-piata">Context: ce înseamnă „dezvoltare web” azi</h2>
      <p>
        În Europa și global, așteptările s-au maturat: un site nu mai este doar o „prezență
        online”, ci un canal de vânzări, recrutare sau operațiuni. Dezvoltarea web
        include acum strategie de produs, design, inginerie frontend/backend,
        integrări (plăți, CRM, ERP), securitate, performanță și operare după lansare.
      </p>
      <p>
        Acest ghid este <strong>pilonul</strong> unei serii mai largi. Îl folosim ca hartă:
        îl poți citi cap-coadă sau să sari la secțiunea care te interesează. Articolele
        satelit intră în detaliu pe subiecte precum{' '}
        <LangLink to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          prețuri și bugete
        </LangLink>
        ,{' '}
        <LangLink to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          CMS vs custom
        </LangLink>{' '}
        și{' '}
        <LangLink to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          hosting &amp; performanță
        </LangLink>
        .
      </p>

      <h2 id="tipuri-proiecte">Tipuri de proiecte și ce livrabile presupun</h2>
      <p>
        În practică, majoritatea cererilor se împart în patru familii: <strong>site de
        prezentare</strong> (marketing + lead-uri), <strong>corporate</strong> (mai multe
        tipuri de pagini, integrări moderate), <strong>e-commerce</strong> (catalog,
        coș, plăți, livrări) și <strong>aplicații web custom</strong> (SaaS, portaluri,
        workflow-uri interne). Fiecare familie are alt profil de risc, alt ritm de
        livrare și alt tip de mentenanță.
      </p>
      <ul>
        <li>
          <strong>Marketing site</strong> — viteză de lansare, mesaj clar, CTA-uri,
          măsurare (analytics, evenimente).
        </li>
        <li>
          <strong>Corporate</strong> — structură mai bogată, roluri editoriale, uneori
          multilingv și formulare avansate.
        </li>
        <li>
          <strong>Magazin online</strong> — stocuri, TVA, curieri, reconcilieri; erorile
          costă direct bani.
        </li>
        <li>
          <strong>Custom app</strong> — model de date propriu, permisiuni, audit; nu se
          rezolvă cu un șablon.
        </li>
      </ul>

      <h2 id="faza-strategie">Faza 1 — Strategie, brief și arhitectură informațională</h2>
      <p>
        Înainte de design și cod, echipa ta trebuie să fie aliniată pe obiective
        măsurabile: lead-uri, vânzări, autoservire pentru clienți, reducerea costurilor
        de suport etc. Un brief bun răspunde la: cine e publicul, ce acțiuni vrei să
        facă pe site, ce conținut există deja și cine îl întreține după lansare.
      </p>
      <p>
        Arhitectura informațională (sitemap-ul logic, fluxurile utilizatorului) evită
        refactorizări scumpe la mijlocul proiectului. Dacă sari peste această fază, vei
        plăti „taxa de grabă” mai târziu — de obicei sub forma unui redesign sau a unui
        modul rescris de la zero.
      </p>

      <h2 id="design-ux-ui">Faza 2 — UX, UI și design system</h2>
      <p>
        UX-ul definește parcursurile: cum găsește utilizatorul informația critică în
        sub 30 de secunde. UI-ul aduce consistență vizuală: tipografie, spațiere,
        stări de eroare, accesibilitate de bază (contrast, focus, etichete pentru
        screen reader unde e cazul).
      </p>
      <p>
        Un design system (chiar minimal) îți permite să scalezi: componente reutilizate
        între pagini, mai puține inconsistențe și onboarding mai rapid pentru
        dezvoltatori noi în proiect.
      </p>

      <h2 id="implementare-tehnica">Faza 3 — Implementare: frontend, backend, integrări</h2>
      <p>
        Frontend-ul este ceea ce vede utilizatorul: HTML semantic, CSS, JavaScript,
        optimizări de încărcare. Backend-ul gestionează logica de business, datele
        sensibile, autentificarea și integrările cu sisteme externe. În proiectele
        moderne, linia dintre ele se estompează (API-uri, SSR, edge functions), dar
        responsabilitățile rămân distincte.
      </p>
      <p>
        Integrările (plăți, facturare, email transacțional, CRM) trebuie tratate ca
        livrabile cu contract clar: ce se întâmplă la timeout-uri, cum se loghează
        erorile, cum se reconciliază plățile. Aici apar multe întârzieri evitabile dacă
        nu există un owner tehnic pentru fiecare integrare.
      </p>

      <h2 id="cms-custom-headless">CMS, custom, headless: cum alegi modelul potrivit</h2>
      <p>
        <strong>CMS clasic</strong> (panou editorial + șabloane) accelerează conținut și
        MVP-uri. <strong>Headless CMS</strong> separă conținutul de frontend — util
        când ai mai multe canale (web, app, kiosk). <strong>Custom</strong> îți dă
        control total, dar costă mai mult la început și cere disciplină la mentenanță.
      </p>
      <p>
        Nu alege tehnologia după hype; alege-o după echipa disponibilă, complexitatea
        catalogului și orizontul de timp. Discuția detaliată e în articolul{' '}
        <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          CMS vs dezvoltare custom
        </Link>
        .
      </p>

      <h2 id="ecommerce-seo-tehnic">E-commerce, plăți și bază de SEO tehnic</h2>
      <p>
        Pentru magazine online, SEO-ul tehnic începe cu o structură de categorii
        înțeleasă de crawlere, URL-uri stabile, date structurate pentru produse acolo
        unde e cazul și performanță bună pe mobile. Plățile trebuie să respecte PCI DSS
        prin furnizori certificați — nu stocați PAN-uri în baza voastră fără expertiză
        de securitate.
      </p>
      <p>
        Dacă vindeți cross-border, clarificați TVA, facturarea și politica de retururi
        în flow-ul de checkout; acestea influențează și rata de conversie și numărul de
        tichete la suport.
      </p>

      <h2 id="securitate-performance">Securitate, performanță și calitate (QA)</h2>
      <p>
        Securitatea nu este un „extra”: este update-uri dependențe, control acces,
        rate limiting pe API, protecție CSRF unde e relevant, backup-uri testate și
        plan de restaurare. Performanța (LCP, INP, CLS) influențează SEO și conversie —
        mai ales pe rețele mobile și pentru utilizatori din diaspora.
      </p>
      <p>
        QA-ul trebuie să includă scenarii reale: plăți eșuate, coș abandonat, erori de
        validare, limite de upload. Automatizarea testelor e opțională la început, dar
        regresiile devin costisitoare după primul an de evoluție continuă.
      </p>

      <h2 id="hosting-devops">Hosting, domenii, SSL și livrare continuă</h2>
      <p>
        Alegeți un mediu cu monitorizare de bază (uptime, latență, erori 5xx) și
        politici clare de backup. SSL-ul este standard; reînnoirea certificatelor și
        redirecturile HTTP→HTTPS trebuie verificate la fiecare migrare.
      </p>
      <p>
        Livrarea continuă (build, test, deploy) reduce frica de lansare și permite
        îmbunătățiri incrementale. Ghid practic despre infrastructură și Core Web
        Vitals:{' '}
        <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          hosting &amp; performanță
        </Link>
        .
      </p>

      <h2 id="buget-timeline">Buget, timeline și contracte: ce e realist în 2026</h2>
      <p>
        Bugetul trebuie să includă nu doar „dezvoltarea inițială”, ci și conținut,
        licențe, integrări, testare și o fereastră de stabilizare după go-live. Un
        timeline realist lasă loc pentru feedback legal/compliance și pentru date reale
        din analytics.
      </p>
      <p>
        Pentru paliere de preț și exemple, vezi{' '}
        <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          ghidul de prețuri
        </Link>
        .
      </p>

      <h2 id="alegere-furnizor">Cum alegi furnizorul potrivit (agenție vs freelancer)</h2>
      <p>
        Verifică portofoliul pe cazuri similare ca ale tale, nu doar estetica. Cere
        referințe, întreabă cine e owner pe produs și cum arată comunicarea în sprint.
        Un partener bun spune „nu” la scope-uri periculoase și propune o fazare
        rezonabilă.
      </p>
      <p>
        Transparența pe cod și acces la repository îți reduce dependența de furnizor.
        Documentația minimă (cum rulezi local, variabile de mediu, cum faci deploy) e
        parte din livrabil, nu un favor.
      </p>

      <h2 id="greseli-frecvente">Greșeli frecvente care scumpesc sau întârzie proiectul</h2>
      <ul>
        <li>Scope nesfârșit fără MVP definit — „facem totul dintr-o dată”.</li>
        <li>
          Conținutul final amânat până în săptămâna lansării — blochează design și SEO.
        </li>
        <li>
          Ignorarea performanței până la final — refactorul e mai scump decât optimizarea
          incrementală.
        </li>
        <li>
          Lipsa unui responsabil intern de produs — deciziile întârzie sau se contrazic.
        </li>
        <li>
          Integrări negociate verbal — fără specificații, fără criterii de acceptanță.
        </li>
      </ul>

      <h2 id="checklist-lansare">Checklist înainte de lansare</h2>
      <ul>
        <li>Redirecturi 301 pentru URL-uri vechi; canonical corect.</li>
        <li>Robots + sitemap actualizate; pagini de test scoase din index.</li>
        <li>Monitorizare erori (ex. 404 spike) și logging pentru plăți.</li>
        <li>Cookie consent conform politicii voastre legale.</li>
        <li>Backup verificat; runbook pentru rollback.</li>
        <li>Date structurate de bază (Organization/WebSite/Article unde e cazul).</li>
      </ul>

      <h2 id="seria-dezvoltare-web">Continuă în serie: articole satelit recomandate</h2>
      <p>
        Acest pilon leagă împreună întregul subiect. Pentru detalii concrete:
      </p>
      <ul>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Buget site 2026 — scenarii și cifre
          </Link>
        </li>
        <li>
          <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            CMS vs dezvoltare custom — cum decizi
          </Link>
        </li>
        <li>
          <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Hosting, DNS și Core Web Vitals
          </Link>
        </li>
      </ul>
      <p>
        Dacă vrei să aplici această structură la proiectul tău,{' '}
        <Link to="/contact" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          contactează SoftIonyx
        </Link>{' '}
        — construim împreună faza potrivită pentru obiectivele tale.
      </p>
    </>
  );
}
