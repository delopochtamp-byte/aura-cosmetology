import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faHeart as faHeartSolid,
  faCalendarAlt,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../hooks/useTranslation';

const TABS = [
  { key: 'phone', icon: faPhone, label: 'site.bottom_tab_phone' },
  { key: 'favorites', icon: faHeartSolid, label: 'site.bottom_tab_favorites' },
  { key: 'schedule', icon: faCalendarAlt, label: 'site.bottom_tab_schedule' },
  { key: 'blog', icon: faNewspaper, label: 'site.bottom_tab_blog' },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  const { t } = useTranslation();

  return (
    <nav className="bottom-tab-bar">
      {TABS.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`bottom-tab-item${activeTab === key ? ' active' : ''}`}
          onClick={() => onTabChange(key)}
          aria-label={t(label)}
        >
          <span className="bottom-tab-icon">
            <FontAwesomeIcon icon={icon} />
          </span>
          <span className="bottom-tab-label">{t(label)}</span>
        </button>
      ))}
    </nav>
  );
}
