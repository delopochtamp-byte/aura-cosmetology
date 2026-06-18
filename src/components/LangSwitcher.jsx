import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'ru', flag: '🇷🇺' },
  { code: 'uk', flag: '🇺🇦' },
  { code: 'be', flag: '🇧🇾' },
  { code: 'kk', flag: '🇰🇿' },
  { code: 'uz', flag: '🇺🇿' },
  { code: 'ky', flag: '🇰🇬' },
  { code: 'tg', flag: '🇹🇯' },
  { code: 'hy', flag: '🇦🇲' },
  { code: 'az', flag: '🇦🇿' },
  { code: 'ro', flag: '🇷🇴' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'tr', flag: '🇹🇷' },
  { code: 'ar', flag: '🇸🇦' },
  { code: 'zh', flag: '🇨🇳' },
];

export default function LangSwitcher({ currentLang, onLangChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="lang-trigger-flag">{current.flag}</span>
        <svg
          className={`lang-trigger-arrow ${open ? 'open' : ''}`}
          width="10" height="6" viewBox="0 0 10 6" fill="none"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="lang-menu">
          <div className="lang-grid">
            {LANGUAGES.map(({ code, flag }) => (
              <button
                key={code}
                className={`lang-grid-btn ${currentLang === code ? 'active' : ''}`}
                onClick={() => {
                  onLangChange(code);
                  setOpen(false);
                }}
                title={code.toUpperCase()}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
