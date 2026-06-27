import { useNavigate } from 'react-router-dom';
import LangSwitcher from './LangSwitcher';

export default function Header({ t, lang, onLangChange, currentPath }) {
  const navigate = useNavigate();
  const isBlog = currentPath === '/blog';

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-nav-toggle"
          onClick={() => navigate(isBlog ? '/' : '/blog')}
        >
          {isBlog ? t('site.bottom_tab_home') || 'Каталог' : t('site.bottom_tab_blog') || 'Блог'}
        </button>
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
