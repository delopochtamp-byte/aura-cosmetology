import { useState } from 'react';
import LikeButton from './LikeButton';

// Эмодзи для placeholder'ов — рандомно выбираем по id поста
const EMOJIS = ['📝', '✨', '💫', '🌟', '🌸', '💖', '🌺', '🦋', '🌈', '💎', '🌿', '☀️', '🕊️', '🎀', '💫'];

export default function BlogCard({ post, isLiked, getCount, onToggleLike, t }) {
  const [flipped, setFlipped] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleFlip = () => {
    setFlipped(prev => !prev);
  };

  const openFullscreen = (e) => {
    e.stopPropagation();
    setFullscreen(true);
  };

  const closeFullscreen = (e) => {
    e.stopPropagation();
    setFullscreen(false);
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
    <>
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

                {/* Кнопка открыть на весь экран */}
                <button className="back-fullscreen-btn" onClick={openFullscreen}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                  {(t && t('site.read_full') || 'Читать полностью')}
                </button>

                <div className="back-hint">
                  {(t && t('site.tap_to_return')) || 'Нажмите, чтобы вернуться'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Fullscreen Overlay ---------- */}
      {fullscreen && (
        <div className="blog-fullscreen-overlay" onClick={closeFullscreen}>
          <div className="blog-fullscreen-header">
            <h2>{post.title}</h2>
            <button className="blog-fullscreen-close" onClick={closeFullscreen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="blog-fullscreen-body" onClick={(e) => e.stopPropagation()}>
            <div className="blog-fullscreen-date">{formatDate(post.date)}</div>
            <div className="blog-fullscreen-text">{post.text}</div>
          </div>
        </div>
      )}
    </>
  );
}
