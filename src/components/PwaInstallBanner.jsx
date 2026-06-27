import { useState, useEffect } from 'react';

const LS_KEY = 'pwa_install_dismissed';

export default function PwaInstallBanner({ t }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, не закрыли ли баннер ранее
    if (localStorage.getItem(LS_KEY)) return;

    // Если уже установлено как PWA — не показываем
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setShow(false);
      setDeferredPrompt(null);
      localStorage.setItem(LS_KEY, '1');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShow(false);
    localStorage.setItem(LS_KEY, '1');
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(LS_KEY, '1');
  };

  if (!show) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="10" />
          <polyline points="8,14 12,10 16,14" />
        </svg>
      </div>
      <div className="pwa-install-content">
        <div className="pwa-install-title">
          {(t && t('site.pwa_install_title')) || 'Установите приложение'}
        </div>
        <div className="pwa-install-desc">
          {(t && t('site.pwa_install_desc')) || 'Быстрый доступ с главного экрана'}
        </div>
      </div>
      <div className="pwa-install-actions">
        <button className="pwa-install-btn" onClick={handleInstall}>
          {(t && t('site.pwa_install_btn')) || 'Установить'}
        </button>
        <button className="pwa-install-later" onClick={handleDismiss}>
          {(t && t('site.pwa_install_later')) || 'Позже'}
        </button>
      </div>
    </div>
  );
}
