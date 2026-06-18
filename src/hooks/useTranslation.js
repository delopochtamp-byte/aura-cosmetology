import { useState, useCallback } from 'react';
import translations from '../data/translations.json';

const STORAGE_LANG_KEY = 'aura-lang';

function getInitialLang() {
  try {
    return localStorage.getItem(STORAGE_LANG_KEY) || 'ru';
  } catch {
    return 'ru';
  }
}

export function useTranslation() {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
    } catch {}
  }, []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
    if (value && typeof value === 'object' && value[lang] !== undefined) {
      return value[lang];
    }
    return value || key;
  }, [lang]);

  const getLocalized = useCallback((obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['ru'] || '';
  }, [lang]);

  return { lang, setLang, t, getLocalized };
}
