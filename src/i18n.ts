import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ro', 'ru'],
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(process.cwd(), 'src', 'locales', '{{lng}}', '{{ns}}.json'),
    },
    detection: {
      order: ['header', 'querystring'],
      lookupQuerystring: 'lang',
      caches: false,
    },
  });

export const i18nMiddleware = middleware.handle(i18next);
export default i18next;
