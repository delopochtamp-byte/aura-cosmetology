import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import { useLikes } from './hooks/useLikes';
import Header from './components/Header';
import FeedPage from './components/FeedPage';
import BottomTabBar from './components/BottomTabBar';
import BookingModal from './components/BookingModal';
import PartnerModal from './components/PartnerModal';
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
  const [partnerOpen, setPartnerOpen] = useState(false);

  const handleBooking = useCallback((service) => {
    setBookingService(service);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingService(null);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setSearchActive(prev => !prev);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchActive(false);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
  }, []);

  const handleOpenPartner = useCallback(() => {
    setPartnerOpen(true);
  }, []);

  const handleClosePartner = useCallback(() => {
    setPartnerOpen(false);
  }, []);

  const handleGoReferral = useCallback(() => {
    navigate('/referral');
  }, [navigate]);

  return (
    <>
      <Header
        lang={lang}
        onLangChange={setLang}
        t={t}
        onSearchToggle={handleSearchToggle}
        onPartner={handleOpenPartner}
        onReferral={handleGoReferral}
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
        />
      </main>

      <BottomTabBar
        currentCategory={category}
        onCategoryChange={handleCategoryChange}
        getLocalized={getLocalized}
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

      {partnerOpen && (
        <PartnerModal
          t={t}
          onClose={handleClosePartner}
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
      </Routes>
    </div>
  );
}

export default App;
