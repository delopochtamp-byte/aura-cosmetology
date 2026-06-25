import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import { useLikes } from './hooks/useLikes';
import Header from './components/Header';
import FeedPage from './components/FeedPage';
import BottomTabBar from './components/BottomTabBar';
import BookingModal from './components/BookingModal';
import ScheduleModal from './components/ScheduleModal';
import BlogPage from './components/BlogPage';
import ReferralPage from './components/ReferralPage';
import Footer from './components/Footer';
import servicesData from './data/services.json';
import './App.css';

function CatalogLayout() {
  const navigate = useNavigate();
  const { lang, setLang, t, getLocalized } = useTranslation();
  const { isLiked, getCount, toggleLike } = useLikes();
  const [bookingService, setBookingService] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [category, setCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [showFavorites, setShowFavorites] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const handleBooking = useCallback((service) => {
    setBookingService(service);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingService(null);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchActive(false);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
  }, []);

  const handleCloseSchedule = useCallback(() => {
    setScheduleOpen(false);
  }, []);

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    switch (tabKey) {
      case 'home':
        setCategory('all');
        setSearchActive(false);
        setShowFavorites(false);
        break;
      case 'phone':
        window.location.href = 'tel:+79883877957';
        break;
      case 'favorites':
        setShowFavorites(prev => !prev);
        setCategory('all');
        setSearchActive(false);
        break;
      case 'schedule':
        setScheduleOpen(true);
        break;
      case 'blog':
        navigate('/blog');
        break;
    }
  }, [navigate]);

  return (
    <>
      <Header
        lang={lang}
        onLangChange={setLang}
        t={t}
      />

      <main className="main-content">
        <FeedPage
          services={servicesData}
          getLocalized={getLocalized}
          t={t}
          isLiked={isLiked}
          getCount={getCount}
          onToggleLike={toggleLike}
          onBooking={handleBooking}
          lang={lang}
          searchActive={searchActive}
          onSearchClose={handleSearchClose}
          category={category}
          showFavorites={showFavorites}
        />
      </main>

      <BottomTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <Footer t={t} />

      {bookingService && (
        <BookingModal
          service={bookingService}
          getLocalized={getLocalized}
          t={t}
          onClose={handleCloseBooking}
        />
      )}

      {scheduleOpen && (
        <ScheduleModal
          t={t}
          onClose={handleCloseSchedule}
        />
      )}
    </>
  );
}

function App() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CatalogLayout />} />
        <Route path="/referral" element={<ReferralPage t={t} />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </div>
  );
}

export default App;
