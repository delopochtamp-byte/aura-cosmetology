import { useState, useMemo } from 'react';
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

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function getMonthDays() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
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
  const [showCalendar, setShowCalendar] = useState(false);

  const now = new Date();
  const monthDays = getMonthDays();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  // Детерминированный статус для каждого слота на основе города + даты + времени
  const slotStatuses = useMemo(() => {
    const dateStr = selectedDate
      ? `${selectedDate}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
      : 'today';
    return TIME_SLOTS.map(time => {
      const seed = hashString(`${selectedCity}_${dateStr}_${time}`);
      const isOccupied = seed % 3 === 0; // ~33% занято
      return { time, occupied: isOccupied };
    });
  }, [selectedCity, selectedDate, now]);

  const handleBook = () => {
    if (selectedCity && selectedDate && selectedTime) {
      window.location.href = 'tel:+79883877957';
    }
  };

  const formatDate = (day) => {
    if (!day) return '';
    return `${String(day).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-page-header">
        <button className="schedule-page-back" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>
        <h1>{t('site.schedule_title') || 'Расписание'}</h1>
      </div>

      {/* Filters Row: город + дата на одной строке */}
      <div className="schedule-filters-row">
        {/* City Select */}
        <select
          className="schedule-city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {CITIES.map(city => (
            <option key={city.key} value={city.key}>
              {city.label}
            </option>
          ))}
        </select>

        {/* Date Selector */}
        <div className="date-selector">
          <button
            className="date-selector-btn"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className="date-selector-icon">✈</span>
            <span className="date-selector-text">
              {selectedDate
                ? `${formatDate(selectedDate)}.${now.getFullYear()}`
                : (t('site.schedule_date') || 'Выберите дату')}
            </span>
            <span className={`date-selector-arrow${showCalendar ? ' open' : ''}`}>▾</span>
          </button>

          {showCalendar && (
            <div className="date-calendar">
              <div className="date-calendar-header">{monthLabel}</div>
              <div className="date-calendar-grid">
                {DAY_NAMES.map(d => (
                  <div key={d} className="date-calendar-day-header">{d}</div>
                ))}
                {monthDays.map((day, i) => (
                  <div
                    key={i}
                    className={`date-calendar-day${day === null ? ' empty' : ''}${day === selectedDate ? ' selected' : ''}`}
                    onClick={() => {
                      if (day !== null) {
                        setSelectedDate(day);
                        setShowCalendar(false);
                      }
                    }}
                  >
                    {day || ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Table — простая читаемая таблица */}
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="table-col-time">{t('site.schedule_board_time') || 'ВРЕМЯ'}</th>
              <th className="table-col-status">{t('site.schedule_board_status') || 'СТАТУС'}</th>
              <th className="table-col-icon"></th>
            </tr>
          </thead>
          <tbody>
            {slotStatuses.map(({ time, occupied }) => {
              const isSelected = selectedTime === time;
              return (
                <tr
                  key={time}
                  className={`schedule-table-row${occupied ? ' occupied' : ' free'}${isSelected ? ' selected' : ''}`}
                  onClick={() => {
                    if (!occupied) {
                      setSelectedTime(isSelected ? null : time);
                    }
                  }}
                >
                  <td className="table-col-time">{time}</td>
                  <td className="table-col-status">
                    {occupied
                      ? (t('site.schedule_occupied') || 'ЗАНЯТО')
                      : (t('site.schedule_free') || 'СВОБОДНО')}
                  </td>
                  <td className="table-col-icon">
                    {occupied ? '✗' : '✓'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Book Button */}
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
