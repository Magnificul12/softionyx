import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/common.json';
import ro from './locales/ro/common.json';
import ru from './locales/ru/common.json';

import enServices from './locales/en/services.json';
import roServices from './locales/ro/services.json';
import ruServices from './locales/ru/services.json';

// Separate namespaces keep `common.json` lean. The heavy per-service content
// lives in `services.json` where its size can't slow down the chrome bundle.
const resources = {
  en: { common: en, services: enServices },
  ro: { common: ro, services: roServices },
  ru: { common: ru, services: ruServices },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common', 'services'],
    defaultNS: 'common',
    detection: {
      // Prefer language prefix in URL: /ro/... /en/... /ru/...
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

export default i18n;
