import { useState } from 'react';
import categories from '../data/categories.json';

const TAB_ICONS = {
  all: '🏠',
  face: '👤',
  injections: '💉',
  body: '🧘',
  hardware: '⚙️',
  hair: '💇',
  laser: '🔦',
  massage: '💆',
  peeling: '✨',
  care: '🧴',
  surgery: '🔪',
};

export default function BottomTabBar({ currentCategory, onCategoryChange }) {
  const [open, setOpen] = useState(false);
  const allTabs = Object.keys(categories);

  const handleSelect = (key) => {
    onCategoryChange(key);
    setOpen(false);
  };

  const menuLetters = [
    { char: 'М', angle: 0 },
    { char: 'Е', angle: 90 },
    { char: 'Н', angle: 180 },
    { char: 'Ю', angle: 270 },
  ];

  return (
    <div className="side-bubbles-wrap">
      <div className="sun-toggle-wrap">
        {/* Круговой текст "МЕНЮ" — 4 буквы по кругу через SVG rotate */}
        <svg className="sun-ring" width="80" height="80" viewBox="0 0 80 80" fill="none">
          {menuLetters.map((item) => (
            <text
              key={item.angle}
              fontSize="13"
              fontWeight="700"
              fill="currentColor"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${item.angle}, 40, 40) translate(0, -34)`}
            >
              {item.char}
            </text>
          ))}
        </svg>

        <button
          className={`side-bubbles-toggle ${open ? 'active' : ''}`}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Меню"
        >
          {/* Солнце + голубой глаз */}
          <svg className="sun-eye-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Лучи солнца */}
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="12" y1="1.5" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22.5" />
              <line x1="1.5" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22.5" y2="12" />
              <line x1="4.5" y1="4.5" x2="6.3" y2="6.3" />
              <line x1="17.7" y1="17.7" x2="19.5" y2="19.5" />
              <line x1="4.5" y1="19.5" x2="6.3" y2="17.7" />
              <line x1="17.7" y1="6.3" x2="19.5" y2="4.5" />
            </g>
            {/* Контур глаза (белый овал) */}
            <ellipse cx="12" cy="12" rx="5.5" ry="4" fill="white" stroke="currentColor" strokeWidth="1.2" />
            {/* Голубая радужка */}
            <ellipse cx="12" cy="12" rx="3.5" ry="2.8" fill="#4da6ff" />
            {/* Зрачок */}
            <circle cx="12" cy="12" r="1.8" fill="#111" />
            {/* Блик */}
            <circle cx="13.5" cy="10.8" r="0.8" fill="white" opacity="0.8" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="side-bubbles">
          {allTabs.map((key) => (
            <button
              key={key}
              className={`side-bubble ${currentCategory === key ? 'active' : ''}`}
              onClick={() => handleSelect(key)}
              title={key}
            >
              {TAB_ICONS[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
