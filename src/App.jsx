import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import { useLikes } from './hooks/useLikes';
import Header from './components/Header';
import FeedPage from './components/FeedPage';
import BottomTabBar from './components/BottomTabBar';
import BookingModal from './components/BookingModal';
import BlogPage from './components/BlogPage';
import ReferralPage from './components/ReferralPage';
import SchedulePage from './components/SchedulePage';
import Footer from './components/Footer';
import servicesData from './data/services.json';
import './App.css';

function CatalogLayout({ showFavorites, onToggleFavorites }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t, getLocalized } = useTranslation();
  const { isLiked, getCount, toggleLike } = useLikes();
  const [bookingService, setBookingService] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [category, setCategory] = useState('all');

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

      <Footer t={t} />

      {bookingService && (
        <BookingModal
          service={bookingService}
          getLocalized={getLocalized}
          t={t}
          onClose={handleCloseBooking}
        />
      )}
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isLiked, getCount, toggleLike } = useLikes();
  const [bookingService, setBookingService] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const getActiveTab = (pathname) => {
    if (pathname === '/') return 'home';
    if (pathname === '/blog') return 'blog';
    if (pathname === '/schedule') return 'schedule';
    return 'home';
  };

  const handleTabChange = useCallback((tabKey) => {
    switch (tabKey) {
      case 'home':
        navigate('/');
        break;
      case 'phone':
        window.location.href = 'tel:+79883877957';
        break;
      case 'favorites':
        setShowFavorites(prev => !prev);
        break;
      case 'schedule':
        navigate('/schedule');
        break;
      case 'blog':
        navigate(location.pathname === '/blog' ? '/' : '/blog');
        break;
    }
  }, [navigate, location.pathname]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CatalogLayout showFavorites={showFavorites} />} />
        <Route path="/referral" element={<ReferralPage t={t} />} />
        <Route path="/blog" element={<BlogPage showFavorites={showFavorites} />} />
        <Route path="/schedule" element={<SchedulePage t={t} />} />
      </Routes>

      <BottomTabBar
        activeTab={getActiveTab(location.pathname)}
        onTabChange={handleTabChange}
        showFavorites={showFavorites}
      />
    </div>
  );
}

export default App;
