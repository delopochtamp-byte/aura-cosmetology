import { useState } from 'react';

const CITIES = [
  { key: 'moscow', label: 'Москва' },
  { key: 'spb', label: 'Санкт-Петербург' },
  { key: 'kazan', label: 'Казань' },
  { key: 'sochi', label: 'Сочи' },
  { key: 'novosibirsk', label: 'Новосибирск' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00',
];

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

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

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export default function ScheduleModal({ t, onClose }) {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].key);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const now = new Date();
  const monthDays = getMonthDays();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      alert(`Запись на ${selectedDate}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} в ${selectedTime}, город: ${CITIES.find(c => c.key === selectedCity)?.label}`);
    }
  };

  return (
    <div className="schedule-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={e => e.stopPropagation()}>
        <h2>{t('site.schedule_title') || 'Запись на приём'}</h2>

        {/* Город */}
        <div className="schedule-section">
          <label>{t('site.schedule_city') || 'Город'}</label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            {CITIES.map(city => (
              <option key={city.key} value={city.key}>{city.label}</option>
            ))}
          </select>
        </div>

        {/* Календарь */}
        <div className="schedule-section">
          <label>{t('site.schedule_date') || 'Дата'}</label>
          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
            {monthLabel}
          </div>
          <div className="schedule-calendar">
            {DAY_NAMES.map(d => (
              <div key={d} className="day-header">{d}</div>
            ))}
            {monthDays.map((day, i) => (
              <div
                key={i}
                className={`day${day === null ? ' empty' : ''}${day === selectedDate ? ' selected' : ''}`}
                onClick={() => day !== null && setSelectedDate(day)}
              >
                {day || ''}
              </div>
            ))}
          </div>
        </div>

        {/* Время */}
        <div className="schedule-section">
          <label>{t('site.schedule_time') || 'Время'}</label>
          <div className="schedule-times">
            {TIME_SLOTS.map(time => (
              <button
                key={time}
                className={time === selectedTime ? 'selected' : ''}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопка записи */}
        <button
          className="schedule-book-btn"
          disabled={!selectedDate || !selectedTime}
          onClick={handleBook}
        >
          {t('site.schedule_book') || 'Записаться'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>
          {t('site.schedule_note') || 'Выберите город, дату и время для записи'}
        </p>
      </div>
    </div>
  );
}
