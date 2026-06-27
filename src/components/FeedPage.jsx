import { useState, useMemo } from 'react';
import services from '../data/services.json';
import ServiceCard from './ServiceCard';
import SearchBar from './SearchBar';
import PwaInstallBanner from './PwaInstallBanner';

export default function FeedPage({
  getLocalized, t, isLiked, getCount,
  onToggleLike, onBooking, lang,
  searchActive, onSearchClose, category,
  showFavorites
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = services;

    // Фильтр по категории
    if (category && category !== 'all') {
      result = result.filter(s => s.category === category);
    }

    // Фильтр по избранному
    if (showFavorites) {
      result = result.filter(s => isLiked(s.id));
    }

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => {
        const title = (s.title[lang] || s.title.ru || '').toLowerCase();
        return title.includes(q);
      });
    }

    return result;
  }, [searchQuery, lang, category, showFavorites, isLiked]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="feed-page">
      {searchActive && (
        <SearchBar onSearch={handleSearch} onClose={onSearchClose} t={t} />
      )}

      <div className="feed-scroll-container hide-scrollbar">
        {filtered.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-icon">🔍</div>
            <p className="feed-empty-text">{t('site.nothing_found')}</p>
          </div>
        ) : (
          filtered.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              getLocalized={getLocalized}
              t={t}
              isLiked={isLiked}
              getCount={getCount}
              onToggleLike={onToggleLike}
              onBooking={onBooking}
            />
          ))
        )}
        <PwaInstallBanner t={t} />
      </div>
    </div>
  );
}
