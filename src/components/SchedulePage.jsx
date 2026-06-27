import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CITIES = [
  { key: 'moscow', label: 'Москва' },
  { key: 'spb', label: 'Санкт-Петербург' },
  { key: 'magnitogorsk', label: 'Магнитогорск' },
  { key: 'krasnodar', label: 'Краснодар' },
];

const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00',
];

const DAY_NAMES_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function getNextDays(count = 14) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

// Простая хеш-функция для детерминированного статуса
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Иконка города (SVG)
function CityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Иконка календаря
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// Иконка часов
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Иконка телефона
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function SchedulePage({ t }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(CITIES[0].key);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = useMemo(() => getNextDays(14), []);
  const now = new Date();

  // Детерминированный статус для каждого слота на основе города + даты + времени
  const slotStatuses = useMemo(() => {
    const dateStr = selectedDate
      ? `${selectedDate.getDate()}.${String(selectedDate.getMonth() + 1).padStart(2, '0')}.${selectedDate.getFullYear()}`
      : 'today';
    return TIME_SLOTS.map(time => {
      const seed = hashString(`${selectedCity}_${dateStr}_${time}`);
      const isOccupied = seed % 3 === 0; // ~33% занято
      return { time, occupied: isOccupied };
    });
  }, [selectedCity, selectedDate]);

  const handleBook = () => {
    if (selectedCity && selectedDate && selectedTime) {
      window.location.href = 'tel:+79883877957';
    }
  };

  const formatDayLabel = (date) => {
    const day = date.getDate();
    const month = MONTH_NAMES_GENITIVE[date.getMonth()];
    const dayName = DAY_NAMES_SHORT[date.getDay()];
    return { day, month, dayName };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-page-header">
        <button className="schedule-page-back" onClick={() => navigate('/')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1>{t('site.schedule_title') || 'Расписание'}</h1>
      </div>

      {/* Город — горизонтальные чипсы */}
      <div className="schedule-section">
        <label className="schedule-section-label">
          <CityIcon />
          {t('site.schedule_city') || 'Город'}
        </label>
        <div className="schedule-chips-row">
          {CITIES.map(city => (
            <button
              key={city.key}
              className={`schedule-chip${selectedCity === city.key ? ' active' : ''}`}
              onClick={() => setSelectedCity(city.key)}
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>

      {/* Дата — горизонтальный ряд дней */}
      <div className="schedule-section">
        <label className="schedule-section-label">
          <CalendarIcon />
          {t('site.schedule_date') || 'Дата'}
        </label>
        <div className="schedule-days-scroll">
          {days.map((date, idx) => {
            const { day, month, dayName } = formatDayLabel(date);
            const isActive = selectedDate ? isSameDay(date, selectedDate) : isToday(date);
            const todayFlag = isToday(date);
            return (
              <button
                key={idx}
                className={`schedule-day-chip${isActive ? ' active' : ''}${todayFlag ? ' today' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="schedule-day-chip-name">{dayName}</span>
                <span className="schedule-day-chip-number">{day}</span>
                <span className="schedule-day-chip-month">{month}</span>
                {todayFlag && <span className="schedule-day-chip-badge">Сегодня</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Сетка слотов — 2 колонки */}
      <div className="schedule-section schedule-slots-section">
        <label className="schedule-section-label">
          <ClockIcon />
          {t('site.schedule_time') || 'Время'}
        </label>
        <div className="schedule-slots-grid">
          {slotStatuses.map(({ time, occupied }) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                className={`schedule-slot-card${occupied ? ' occupied' : ' free'}${isSelected ? ' selected' : ''}`}
                onClick={() => {
                  if (!occupied) {
                    setSelectedTime(isSelected ? null : time);
                  }
                }}
                disabled={occupied}
              >
                <span className="schedule-slot-time">{time}</span>
                <span className="schedule-slot-status">
                  {occupied
                    ? (t('site.schedule_occupied') || 'ЗАНЯТО')
                    : (t('site.schedule_free') || 'СВОБОДНО')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Кнопка записи */}
      <button
        className="schedule-page-book-btn"
        disabled={!selectedCity || !selectedDate || !selectedTime}
        onClick={handleBook}
      >
        <PhoneIcon />
        {selectedTime
          ? ((t('site.schedule_book_btn') || 'Записаться на {time}').replace('{time}', selectedTime))
          : (t('site.schedule_book') || 'Записаться')}
      </button>
    </div>
  );
}
