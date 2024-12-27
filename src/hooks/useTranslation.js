// src/hooks/useTranslation.js
import { useCallback } from 'react';
import { translations } from '../translations';
import { useUser } from '../contexts/UserContext';

export function useTranslation() {
  const { state } = useUser();
  const language = state.preferences?.language || 'en';

  const t = useCallback((key, params = {}) => {
    // Split the key into parts (e.g., 'shopping.title' -> ['shopping', 'title'])
    const keys = key.split('.');

    // Get the translation object for current language
    let translation = translations[language];

    // Navigate through the keys
    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        // Fallback to English
        translation = getEnglishTranslation(key);
        break;
      }
    }

    // If still no translation found, return the key
    if (!translation) return key;

    // Replace parameters in the translation string
    return replaceParams(translation, params);
  }, [language]);

  return { t, language };
}

// Helper function to get English translation as fallback
function getEnglishTranslation(key) {
  const keys = key.split('.');
  let translation = translations.en;

  for (const k of keys) {
    translation = translation?.[k];
    if (!translation) break;
  }

  return translation;
}

// Helper function to replace parameters in translation strings
function replaceParams(text, params) {
  if (typeof text !== 'string') return text;

  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    text
  );
}