import { useEffect, useRef } from 'react';

export default function BookingModal({ service, getLocalized, t, onClose }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)';
      }
    });
  }, []);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      currentY.current = delta;
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (currentY.current > 120) {
      onClose();
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  if (!service) return null;

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div
        ref={sheetRef}
        className="booking-sheet"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="booking-sheet-handle" />

        <div className="booking-sheet-content">
          <div className="booking-header">
            <h2 className="booking-title">{getLocalized(service.title)}</h2>
            <button className="booking-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="booking-price-row">
            <span className="booking-price">{service.price.toLocaleString()} ₽</span>
            <span className="booking-duration">{service.duration}</span>
          </div>

          <div className="booking-message">
            <div className="booking-message-icon">📅</div>
            <p>{t('site.booking_soon')}</p>
          </div>

          <button className="booking-submit-btn" disabled>
            {t('site.booking')}
          </button>
        </div>
      </div>
    </div>
  );
}
