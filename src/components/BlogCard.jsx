import { useState } from 'react';
import LikeButton from './LikeButton';

// Эмодзи для placeholder'ов — рандомно выбираем по id поста
const EMOJIS = ['📝', '✨', '💫', '🌟', '🌸', '💖', '🌺', '🦋', '🌈', '💎', '🌿', '☀️', '🕊️', '🎀', '💫'];

export default function BlogCard({ post, isLiked, getCount, onToggleLike, t }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(prev => !prev);
  };

  const emoji = EMOJIS[post.id % EMOJIS.length];
  const hue = (post.id * 47) % 360;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return '';
    }
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
                style={{ backgroundColor: `hsl(${hue}, 60%, 85%)` }}
              >
                <span className="media-emoji">{emoji}</span>
              </div>

              {/* Градиентный overlay */}
              <div className="card-overlay" />

              {/* Информация поверх */}
              <div className="card-info">
                <h2 className="card-title">{post.title}</h2>
                <div className="card-meta">
                  <span className="card-price">{formatDate(post.date)}</span>
                </div>
              </div>

              {/* Like button */}
              <div className="card-actions-top">
                <LikeButton
                  isLiked={isLiked(post.id)}
                  count={getCount(post.id)}
                  onToggle={() => onToggleLike(post.id)}
                />
              </div>

              {/* Подсказка */}
              <div className="card-swipe-hint">
                <span className="card-swipe-hint-text">
                  {(t && t('site.tap_for_details')) || 'Нажмите для чтения'}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ---------- Задняя сторона ---------- */}
          <div className="flip-card-back">
            <div className="flip-card-back-content">
              <h2 className="back-title">{post.title}</h2>

              <div className="back-price-row">
                <span className="back-price">{formatDate(post.date)}</span>
              </div>

              <div className="back-section">
                <p className="back-text">{post.text}</p>
              </div>

              <div className="back-hint">
                {(t && t('site.tap_to_return')) || 'Нажмите, чтобы вернуться'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
