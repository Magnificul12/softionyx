import { LangLink as Link } from '../../../../i18n/routing';

export default function Article() {
  return (
    <>
      <h2 id="intro-decizie">Почему выбор платформы — отдельное решение</h2>
      <p>
        Стек влияет на срок запуска, долгую стоимость, безопасность и найм в Европе или
        удалённо. Неверный выбор часто «лечится» дорогой миграцией — лучше заранее
        зафиксировать критерии.
      </p>
      <p>
        Читайте вместе с{' '}
        <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          пилоном о веб-разработке
        </Link>{' '}
        и{' '}
        <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
          гидом по бюджетам
        </Link>
        .
      </p>

      <h2 id="cms-headless">Классический и headless CMS</h2>
      <p>
        <strong>Классический CMS</strong> ускоряет контентные сайты и MVP, когда маркетинг
        хочет правки без разработчика. <strong>Headless CMS</strong> отделяет контент от
        UI: фронт (например React) берёт данные по API — удобно для нескольких каналов.
      </p>
      <p>
        Риск — хаос расширений и полей без дисциплины: страдают скорость и безопасность.
        Любой CMS ведите как продукт: версии, бэкапы, роли, регулярный аудит.
      </p>

      <h2 id="saas-magazin">SaaS-платформа для магазина</h2>
      <p>
        <strong>Облачная SaaS-коммерция</strong> сокращает путь к первой оплате: чекаут и
        базовые доставки уже заложены в продукт. Подходит при умеренном каталоге и
        стандартном B2C.
      </p>
      <p>
        Ограничения — сложный B2B-прайсинг, нестандартный каталог, жёсткие требования к
        данным и инфраструктуре. Тогда кастом или кастомный фронт к API выгоднее в долгую.
      </p>

      <h2 id="custom-cand">Кастомная разработка</h2>
      <p>
        В SoftIonyx мы в основном делаем <strong>кастомные приложения и сайты</strong>{' '}
        (современный стек, API, интеграции). Это уместно, когда продукт <em>и есть</em>
        софт: SaaS, порталы с ролями, внутренние процессы.
      </p>
      <p>
        Заложите сопровождение: зависимости, безопасность, развитие — как для ПО, а не
        разовой визитки.
      </p>

      <h2 id="tabel-comparativ">Сравнение</h2>
      <ul>
        <li>
          <strong>MVP</strong>: обычно SaaS быстрее аккуратного CMS, кастом — по сложности.
        </li>
        <li>
          <strong>TCO за 3 года</strong>: подписки, часы разработки, контент.
        </li>
        <li>
          <strong>Риски</strong>: кастом — DevOps и тесты; CMS — дисциплина расширений; SaaS
          — границы платформы.
        </li>
      </ul>

      <h2 id="legaturi-serie">Дальше по серии</h2>
      <ul>
        <li>
          <Link to="/blog/ghid-complet-dezvoltare-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Пилон
          </Link>
        </li>
        <li>
          <Link to="/blog/cat-costa-site-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Цены и бюджеты
          </Link>
        </li>
        <li>
          <Link to="/blog/hosting-performance-web-moldova-2026" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
            Хостинг и производительность
          </Link>
        </li>
      </ul>
    </>
  );
}
