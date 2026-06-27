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
        <label className="schedule-section-label">{t('site.schedule_city') || 'Город'}</label>
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
        <label className="schedule-section-label">{t('site.schedule_date') || 'Дата'}</label>
        <div className="schedule-days-scroll">
          {days.map((date, idx) => {
            const { day, month, dayName } = formatDayLabel(date);
            const isActive = selectedDate ? isSameDay(date, selectedDate) : isToday(date);
            return (
              <button
                key={idx}
                className={`schedule-day-chip${isActive ? ' active' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="schedule-day-chip-name">{dayName}</span>
                <span className="schedule-day-chip-number">{day}</span>
                <span className="schedule-day-chip-month">{month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Сетка слотов — 2 колонки */}
      <div className="schedule-section schedule-slots-section">
        <label className="schedule-section-label">{t('site.schedule_time') || 'Время'}</label>
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
        {selectedTime
          ? ((t('site.schedule_book_btn') || 'Записаться на {time}').replace('{time}', selectedTime))
          : (t('site.schedule_book') || 'Записаться')}
      </button>
    </div>
  );
}
