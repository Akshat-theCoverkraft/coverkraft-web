// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en.json'; // English translations
import translationHI from './hi.json'; // Hindi translations

// Configure i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      hi: {
        translation: translationHI,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // not needed for React
    },
  });
  export const changeLaguage = (languageKey) => {
    i18n.changeLanguage(languageKey, null) // -> returns a Promise
}
export const updateLang = (languageKey) => {
    return i18n.getDataByLanguage(languageKey, null) // -> returns a Promise
}

export default i18n;
