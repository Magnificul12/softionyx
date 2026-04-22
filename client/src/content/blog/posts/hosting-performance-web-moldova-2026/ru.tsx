import { LangLink as Link } from '../../../../i18n/routing';

export default function Article() {
  return (
    <>
      <h2 id="intro-performanta">Почему инфраструктура — часть продукта</h2>
      <p>
        Скорость влияет на доверие. Поисковики учитывают сигналы UX, включая Core Web
        Vitals. На мобильных и нестабильных сетях доставка контента особенно важна.
      </p>
      <p>
        Связка с{' '}
        <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          пилоном о веб-разработке
        </Link>
        : там инфраструктура в контексте запуска; здесь — операционные детали.
      </p>

      <h2 id="domenii-dns">Домены, DNS и SSL</h2>
      <p>
        Домен должен быть в вашем аккаунте с доступом к DNS. Не допускайте ситуации, когда
        при смене подрядчика вы теряете контроль.
      </p>
      <p>
        DNS влияет на время резолва — разумные TTL, без лишних цепочек CNAME. SSL через
        доверенные CA или Let&apos;s Encrypt; HSTS включайте после проверки редиректов
        HTTP→HTTPS.
      </p>

      <h2 id="hosting-tipuri">Shared, VPS, managed cloud</h2>
      <p>
        <strong>Shared</strong> — дёшево, соседи по серверу, для прототипов.{' '}
        <strong>VPS</strong> — больше контроля, нужны навыки администрирования.{' '}
        <strong>Managed / PaaS</strong> — дороже, меньше операционной нагрузки на малую
        команду.
      </p>
      <p>
        Для магазинов и чувствительных данных важны изоляция и автоматические бэкапы.
        Запросите RPO/RTO у провайдера письменно.
      </p>

      <h2 id="cwv-seo">Core Web Vitals и SEO</h2>
      <p>
        LCP — загрузка основного контента; INP — отклик на действия; CLS — стабильность
        вёрстки. Это не единственный фактор ранжирования, но улучшение обычно поднимает
        конверсию.
      </p>
      <p>
        Измеряйте в Search Console и Lighthouse с реалистичным throttling. Подбирайте
        размеры изображений (WebP/AVIF), настройте шрифты, резервируйте место под рекламу и
        виджеты против CLS.
      </p>

      <h2 id="optimizari">Быстрые улучшения</h2>
      <ul>
        <li>Адаптивные изображения и lazy-load ниже первого экрана.</li>
        <li>CDN для статики с контролируемой инвалидацией при деплое.</li>
        <li>Меньше начертаний шрифтов; сабсет под ваши языки.</li>
        <li>Меньше JS на критичных маршрутах; сплит по страницам.</li>
      </ul>

      <h2 id="legaturi-serie">Дальше по кластеру</h2>
      <ul>
        <li>
          <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Пилон: полный гид
          </Link>
        </li>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Стоимость сайтов
          </Link>
        </li>
        <li>
          <Link to="/blog/cms-vs-dezvoltare-custom-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            CMS vs кастомная разработка
          </Link>
        </li>
      </ul>
    </>
  );
}
