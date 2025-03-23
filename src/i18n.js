import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    // lng: Localization.locale.split('-')[0], // e.g. 'en-US' → 'en'
    lng: Localization.locale.split('-')[1], // e.g. 'en-US' → 'en'
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
