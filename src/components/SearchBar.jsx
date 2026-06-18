import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ onSearch, onClose, t }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <div className="search-bar-input-wrap">
        <svg className="search-bar-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className="search-bar-input"
          type="text"
          placeholder={t('site.search_placeholder')}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button className="search-bar-clear" onClick={handleClear} aria-label="Clear search">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.3"/>
              <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
      <button className="search-bar-cancel" onClick={onClose}>
        {t('site.cancel')}
      </button>
    </div>
  );
}
