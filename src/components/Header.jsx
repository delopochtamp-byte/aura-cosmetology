import LangSwitcher from './LangSwitcher';
import LogoDropdown from './LogoDropdown';

export default function Header({ t, lang, onLangChange }) {
  return (
    <header className="header">
      <div className="header-left">
        <LogoDropdown t={t} />
      </div>
      <div className="header-center">
        <span className="header-logo">{t('site.slogan')}</span>
      </div>
      <div className="header-right">
        <LangSwitcher currentLang={lang} onLangChange={onLangChange} />
      </div>
    </header>
  );
}
