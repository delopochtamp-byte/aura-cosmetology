import { useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function ReferralPage({ t }) {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || t('site.referral_default_name');
  const refCode = searchParams.get('ref') || 'guest';
  const years = searchParams.get('years') || '1';

  const referralLink = `https://aura-group.ru/ref/${refCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — выделяем текст
      const input = document.getElementById('referral-link-input');
      if (input) { input.select(); }
    }
  }, [referralLink]);

  const yearWord = years === '1'
    ? t('site.referral_year_1')
    : (years >= 2 && years <= 4)
      ? t('site.referral_year_2')
      : t('site.referral_year_5');

  return (
    <div className="referral-page">
      {/* Шапка с кнопкой назад */}
      <div className="referral-header">
        <Link to="/" className="referral-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('site.referral_back')}
        </Link>
      </div>

      {/* Герой */}
      <div className="referral-hero">
        <div className="referral-icon">💎</div>
        <h1 className="referral-title">{t('site.referral_title')}</h1>
        <p className="referral-greeting">
          {t('site.referral_greeting').replace('{name}', name)}
        </p>
        <p className="referral-with-us">
          {t('site.referral_with_us')
            .replace('{years}', years)
            .replace('{year_word}', yearWord)}
        </p>
      </div>

      {/* Блок со ссылкой */}
      <div className="referral-link-box">
        <p className="referral-link-label">{t('site.referral_your_link')}</p>
        <div className="referral-link-row">
          <input
            id="referral-link-input"
            className="referral-link-input"
            value={referralLink}
            readOnly
          />
          <button
            className={`referral-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✅' : '📋'}
            <span>{copied ? t('site.referral_copied') : t('site.referral_copy')}</span>
          </button>
        </div>
      </div>

      {/* Как это работает */}
      <div className="referral-section">
        <h2 className="referral-section-title">{t('site.referral_how_it_works')}</h2>
        <div className="referral-steps">
          <div className="referral-step">
            <span className="referral-step-num">1</span>
            <span className="referral-step-text">{t('site.referral_step1')}</span>
          </div>
          <div className="referral-step">
            <span className="referral-step-num">2</span>
            <span className="referral-step-text">{t('site.referral_step2')}</span>
          </div>
          <div className="referral-step">
            <span className="referral-step-num">3</span>
            <span className="referral-step-text">{t('site.referral_step3')}</span>
          </div>
          <div className="referral-step">
            <span className="referral-step-num step-bonus">🎉</span>
            <span className="referral-step-text">{t('site.referral_step4')}</span>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="referral-section">
        <h2 className="referral-section-title">{t('site.referral_stats_title')}</h2>
        <div className="referral-stats">
          <div className="referral-stat-item">
            <span className="referral-stat-value">0</span>
            <span className="referral-stat-label">{t('site.referral_invited')}</span>
          </div>
          <div className="referral-stat-divider" />
          <div className="referral-stat-item">
            <span className="referral-stat-value">0</span>
            <span className="referral-stat-label">{t('site.referral_booked')}</span>
          </div>
          <div className="referral-stat-divider" />
          <div className="referral-stat-item">
            <span className="referral-stat-value">0 ₽</span>
            <span className="referral-stat-label">{t('site.referral_bonus')}</span>
          </div>
        </div>
      </div>

      {/* Кнопка в каталог */}
      <Link to="/" className="referral-to-catalog">
        {t('site.referral_to_catalog')}
      </Link>
    </div>
  );
}
