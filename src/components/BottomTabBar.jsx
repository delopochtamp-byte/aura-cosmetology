import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faHeart as faHeartSolid,
  faCalendarAlt,
  faNewspaper,
  faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from '../hooks/useTranslation';

const TABS = [
  { key: 'phone', icon: faPhone, label: 'site.bottom_tab_phone' },
  { key: 'favorites', icon: faHeartSolid, label: 'site.bottom_tab_favorites' },
  { key: 'schedule', icon: faCalendarAlt, label: 'site.bottom_tab_schedule' },
  { key: 'blog', icon: faNewspaper, label: 'site.bottom_tab_blog' },
];

export default function BottomTabBar({ activeTab, onTabChange, showFavorites }) {
  const { t } = useTranslation();

  return (
    <nav className="bottom-tab-bar">
      {TABS.map(({ key, icon, label }) => {
        // Для кнопки "избранное" переключаем иконку в зависимости от showFavorites
        const isFavActive = key === 'favorites' && showFavorites;
        const displayIcon = key === 'favorites'
          ? (showFavorites ? faHeartSolid : faHeartRegular)
          : icon;

        // Для кнопки "blog" — переключаем иконку и текст в зависимости от activeTab
        const isBlogActive = key === 'blog' && activeTab === 'blog';
        const blogIcon = isBlogActive ? faThLarge : faNewspaper;
        const blogLabel = isBlogActive ? 'site.bottom_tab_home' : 'site.bottom_tab_blog';

        return (
          <button
            key={key}
            className={`bottom-tab-item${activeTab === key ? ' active' : ''}${isFavActive ? ' favorites-active' : ''}`}
            onClick={() => onTabChange(key)}
            aria-label={t(key === 'blog' ? blogLabel : label)}
          >
            <span className="bottom-tab-icon">
              <FontAwesomeIcon icon={key === 'blog' ? blogIcon : displayIcon} />
            </span>
            <span className="bottom-tab-label">{t(key === 'blog' ? blogLabel : label)}</span>
          </button>
        );
      })}
    </nav>
  );
}
