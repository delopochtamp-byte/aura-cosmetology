import LangSwitcher from './LangSwitcher';
import LogoDropdown from './LogoDropdown';

export default function Header({ t, lang, onLangChange, onSearchToggle, onPartner, onReferral }) {
  return (
    <header className="header">
      <div className="header-left">
        <LogoDropdown
          t={t}
          onPartner={onPartner}
          onReferral={onReferral}
        />
      </div>
      <div className="header-center">
        <span className="header-logo">{t('site.slogan')}</span>
      </div>
      <div className="header-right">
        <button
          className="header-search-btn"
          onClick={onSearchToggle}
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <LangSwitcher currentLang={lang} onLangChange={onLangChange} />
      </div>
    </header>
  );
}
