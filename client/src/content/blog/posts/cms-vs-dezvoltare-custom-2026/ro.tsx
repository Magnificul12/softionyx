import { LangLink, LangLink as Link } from '../../../../i18n/routing';

/** Id-uri de heading aliniate cu posts.json → toc */
export default function Article() {
  return (
    <>
      <h2 id="intro-decizie">De ce decizia de platformă merită o pagină întreagă</h2>
      <p>
        Stack-ul ales la început influențează viteza lansării, costul pe termen lung,
        securitatea și cât de ușor poți angaja dezvoltatori în Europa sau remote. O
        decizie nepotrivită se corectează adesea printr-o migrare scumpă — mai bine
        clarifici criteriile din start.
      </p>
      <p>
        Citește articolul împreună cu{' '}
        <LangLink to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          pilonul despre dezvoltare web
        </LangLink>{' '}
        și cu{' '}
        <LangLink to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          ghidul de bugete și prețuri
        </LangLink>
        .
      </p>

      <h2 id="cms-headless">CMS clasic și headless: când ajută, când complică</h2>
      <p>
        Un <strong>CMS clasic</strong> (panou pentru conținut, șabloane de pagină)
        accelerează site-uri editorial-conținut și MVP-uri când echipa vrea să editeze
        fără developer la fiecare schimbare. <strong>Headless CMS</strong> separă
        conținutul de prezentare: frontend-ul tău (ex. React) consumă API-uri — ideal
        când ai mai multe canale sau cerințe UI foarte specifice.
      </p>
      <p>
        Riscul comun: prea multe extensii sau câmpuri ad-hoc fără disciplină — apar
        probleme de performanță și securitate. Indiferent de furnizor, tratează CMS-ul ca
        produs: versiuni, backup, roluri și revizuire periodică.
      </p>

      <h2 id="saas-magazin">Platformă SaaS pentru magazin: avantaje și limite</h2>
      <p>
        O <strong>platformă SaaS de e-commerce</strong> (găzduită de un furnizor, cu
        abonament) poate scurta drumul până la primul coș plătit: checkout, plăți și
        livrări de bază sunt deja modelate. Util când ai un catalog moderat și flux B2C
        standard.
      </p>
      <p>
        Limitele apar la reguli de preț complexe, B2B cu contracte pe niveluri, catalog
        foarte atipic sau nevoia de control fin pe infrastructură și date. Atunci
        dezvoltarea custom sau un front custom peste API-uri devine mai rezonabilă pe
        termen lung.
      </p>

      <h2 id="custom-cand">Dezvoltare custom: pentru cazuri care nu încap în șabloane</h2>
      <p>
        La SoftIonyx livrăm în principal <strong>aplicații și site-uri custom</strong>{' '}
        (stack modern, API-uri, integrări). Merită când produsul tău <em>este</em>
        software-ul: SaaS, portaluri cu roluri, workflow-uri interne, marketplace-uri
        verticale.
      </p>
      <p>
        Bugetează mentenanță reală: dependențe, securitate, evoluție — la fel ca pentru
        orice produs software, nu ca pentru un pliant digital „lansat și uitat”.
      </p>

      <h2 id="tabel-comparativ">Comparație practică: cost, timp, riscuri</h2>
      <ul>
        <li>
          <strong>Timp până la MVP</strong>: de obicei SaaS de magazin &lt; CMS clasic
          bine configurat &lt; proiect custom complex.
        </li>
        <li>
          <strong>Cost 3 ani</strong>: include abonamente, ore de dezvoltare, conținut,
          integrări — nu doar ziua lansării.
        </li>
        <li>
          <strong>Risc</strong>: custom cere DevOps și testare; CMS cere disciplină la
          extensii; SaaS înseamnă acceptarea limitelor platformei.
        </li>
      </ul>

      <h2 id="legaturi-serie">Continuă în aceeași serie</h2>
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
          <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Hosting și performanță
          </Link>
        </li>
      </ul>
    </>
  );
}
