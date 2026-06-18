import { useState, useCallback, useEffect, useRef } from 'react';

export default function PartnerModal({ t, onClose }) {
  const [step, setStep] = useState(1); // 1: info, 2: form, 3: thanks
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
    setStep(3);
  }, [name, phone]);

  // Закрытие по Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="partner-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="partner-modal">
        <button className="partner-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {step === 1 && (
          <div className="partner-content">
            <div className="partner-icon">🤝</div>
            <h2 className="partner-title">{t('site.partner_title')}</h2>
            <p className="partner-subtitle">{t('site.partner_subtitle')}</p>

            <div className="partner-steps">
              <div className="partner-step">
                <span className="partner-step-num">1</span>
                <span className="partner-step-text">{t('site.partner_step1')}</span>
              </div>
              <div className="partner-step">
                <span className="partner-step-num">2</span>
                <span className="partner-step-text">{t('site.partner_step2')}</span>
              </div>
              <div className="partner-step">
                <span className="partner-step-num">3</span>
                <span className="partner-step-text">{t('site.partner_step3')}</span>
              </div>
            </div>

            <button className="partner-next-btn" onClick={() => setStep(2)}>
              {t('site.partner_form_submit')} →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="partner-content">
            <div className="partner-icon">✍️</div>
            <h2 className="partner-title">{t('site.partner_title')}</h2>

            <form className="partner-form" onSubmit={handleSubmit}>
              <div className="partner-field">
                <label className="partner-label">{t('site.partner_form_name')}</label>
                <input
                  className="partner-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('site.partner_form_name')}
                  required
                />
              </div>
              <div className="partner-field">
                <label className="partner-label">{t('site.partner_form_phone')}</label>
                <input
                  className="partner-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>
              <button
                className="partner-submit-btn"
                type="submit"
                disabled={!name.trim() || !phone.trim()}
              >
                {t('site.partner_form_submit')}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="partner-content">
            <div className="partner-icon">🎉</div>
            <h2 className="partner-title">{t('site.partner_thanks')}</h2>
            <p className="partner-subtitle">{name}, мы свяжемся с вами в ближайшее время!</p>
            <button className="partner-next-btn" onClick={onClose}>
              {t('site.cancel')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
