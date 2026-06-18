import { useState } from 'react';
import LikeButton from './LikeButton';

export default function ServiceCard({
  service,
  getLocalized,
  t,
  isLiked,
  getCount,
  onToggleLike,
  onBooking
}) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(prev => !prev);
  };

  const handleBooking = (e) => {
    e.stopPropagation();
    onBooking(service);
  };

  return (
    <div className="service-card">
      <div
        className={`flip-card ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          {/* ---------- Передняя сторона ---------- */}
          <div className="flip-card-front">
            <div className="card-media">
              <div
                className="card-media-placeholder"
                style={{ backgroundColor: `hsl(${service.id * 37}, 60%, 85%)` }}
              >
                <span className="media-emoji">✨</span>
              </div>

              {/* Градиентный overlay */}
              <div className="card-overlay" />

              {/* Информация поверх */}
              <div className="card-info">
                <h2 className="card-title">{getLocalized(service.title)}</h2>
                <div className="card-meta">
                  <span className="card-price">{service.price.toLocaleString()} ₽</span>
                  <span className="card-duration">{service.duration}</span>
                </div>
              </div>

              {/* Like button */}
              <div className="card-actions-top">
                <LikeButton
                  isLiked={isLiked(service.id)}
                  count={getCount(service.id, service.likes)}
                  onToggle={() => onToggleLike(service.id)}
                />
              </div>

              {/* Подсказка */}
              <div className="card-swipe-hint">
                <span className="card-swipe-hint-text">{t('site.tap_for_details')}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ---------- Задняя сторона ---------- */}
          <div className="flip-card-back">
            <div className="flip-card-back-content">
              <h2 className="back-title">{getLocalized(service.title)}</h2>

              <div className="back-price-row">
                <span className="back-price">{service.price.toLocaleString()} ₽</span>
                <span className="back-duration">{service.duration}</span>
              </div>

              <div className="back-section">
                <h3 className="back-section-title">{t('site.description')}</h3>
                <p className="back-text">{getLocalized(service.description)}</p>
              </div>

              <div className="back-section">
                <h3 className="back-section-title">{t('site.benefits')}</h3>
                <p className="back-text">{getLocalized(service.benefits)}</p>
              </div>

              <button className="back-book-btn" onClick={handleBooking}>
                {t('site.booking')}
              </button>

              <div className="back-hint">{t('site.tap_to_return')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
