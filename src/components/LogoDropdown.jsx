import { useState, useRef, useEffect } from 'react';

export default function LogoDropdown({ t, onPartner, onReferral }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (action) => {
    setOpen(false);
    action();
  };

  return (
    <div className="logo-dropdown" ref={ref}>
      <img
        src="/logo.png"
        alt="AuraGroup"
        className="header-logo-img"
        onClick={() => setOpen(prev => !prev)}
      />
      {open && (
        <div className="logo-dropdown-menu">
          <button
            className="logo-dropdown-item"
            onClick={() => handleSelect(onPartner)}
          >
            <span className="logo-dropdown-icon">🤝</span>
            <span className="logo-dropdown-label">{t('site.partner_title')}</span>
          </button>
          <div className="logo-dropdown-divider" />
          <button
            className="logo-dropdown-item"
            onClick={() => handleSelect(onReferral)}
          >
            <span className="logo-dropdown-icon">💎</span>
            <span className="logo-dropdown-label">{t('site.referral_title')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
