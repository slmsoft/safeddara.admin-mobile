import { useState, useEffect } from 'react';
import { DesktopCategoryBar } from './components/DesktopCategoryBar';
import { LanguageProvider } from './contexts/LanguageContext';
import { ScrollPositionProvider } from './contexts/ScrollPositionContext';
import { AdminApp } from './components/admin/AdminApp';
import { HotelBookingPage, BookingData } from './components/HotelBookingPage';
import { HotelBookingConfirmPage } from './components/HotelBookingConfirmPage';
import { WebHotelBookingConfirmPage } from './components/WebHotelBookingConfirmPage';
import { MyBookingsPage, Booking } from './components/MyBookingsPage';
import { BookingDetailsPage } from './components/BookingDetailsPage';
import { WorkingHoursPage } from './components/WorkingHoursPage';
import { PurchaseHistoryPage, Order } from './components/PurchaseHistoryPage';
import { WebPurchaseHistoryPage } from './components/WebPurchaseHistoryPage';
import { PaymentMethodModal } from './components/PaymentMethodModal';
import { MilliCardPaymentModal } from './components/MilliCardPaymentModal';
import { WebMilliCardPaymentModal } from './components/WebMilliCardPaymentModal';
import { AktivbonkPaymentModal } from './components/AktivbonkPaymentModal';
import { MyTicketsPage } from './components/MyTicketsPage';
import { TicketWithBarcode } from './components/TicketWithBarcode';
import { ModernHeader } from './components/ModernHeader';
import { ModernBottomNav } from './components/ModernBottomNav';
import { WeatherPage } from './components/WeatherPage';
import { CamerasPage } from './components/CamerasPage';
import { HeroSlider } from './components/HeroSlider';
import { CategoryIcons } from './components/CategoryIcons';
import { RentalSection } from './components/RentalSection';
import { ServicesSection } from './components/ServicesSection';
import { HotelSection } from './components/HotelSection';
import { RestaurantSection } from './components/RestaurantSection';
import { NewsSection } from './components/NewsSection';
import { AppPromoSection } from './components/AppPromoSection';
import { MenuPage } from './components/MenuPage';
import { TariffsPage } from './components/TariffsPage';
import { CartPage } from './components/CartPage';
import { WebCartPage } from './components/WebCartPage';
import { ProfilePage } from './components/ProfilePage';
import { HotelsPage } from './components/HotelsPage';
import { NewsPage } from './components/NewsPage';
import { RestaurantMenuPage } from './components/RestaurantMenuPage';
import { EventsPage } from './components/EventsPage';
import { RulesPage } from './components/RulesPage';
import { PaymentMethodsPage } from './components/PaymentMethodsPage';
import { AddCardPage } from './components/AddCardPage';
import { FeedbackPage } from './components/FeedbackPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { WebFavoritesPage } from './components/WebFavoritesPage';
import { InsurancePage } from './components/InsurancePage';
import { AboutPage } from './components/AboutPage';
import { AddressPage } from './components/AddressPage';
import { EntertainmentPage } from './components/EntertainmentPage';
import { ComingSoonPage } from './components/ComingSoonPage';
import { WebHeader } from './components/WebHeader';
import { WebFooter } from './components/WebFooter';
import { IntroScreen } from './components/IntroScreen';
import { RegistrationFlow } from './components/RegistrationFlow';

type NavPage = 'home' | 'menu' | 'tariffs' | 'cart' | 'profile';

interface CartItem {
  id: string;
  category: string;
  name: string;
  description: string;
  date: string;
  price: number;
  quantity: number;
  image: string;
}

interface SavedCard {
  id: string;
  cardNumber: string;
  expiry: string;
  cardType: string;
}

function AppContent() {
  // Check if intro and registration are completed
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('introShown');
  });
  const [showRegistration, setShowRegistration] = useState(() => {
    return !localStorage.getItem('isRegistered');
  });
  
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [showWeather, setShowWeather] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [newsInitialId, setNewsInitialId] = useState<string | undefined>(undefined);
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  const [restaurantInitialCategory, setRestaurantInitialCategory] = useState<string | undefined>(undefined);
  const [showEvents, setShowEvents] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCameras, setShowCameras] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const [showTicketBarcode, setShowTicketBarcode] = useState(false);
  const [currentTicketOrder, setCurrentTicketOrder] = useState<Order | null>(null);
  
  // Other modal states
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showEntertainment, setShowEntertainment] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showKids, setShowKids] = useState(false);
  const [showSchool, setShowSchool] = useState(false);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showMilliCardModal, setShowMilliCardModal] = useState(false);
  const [showAktivbonkModal, setShowAktivbonkModal] = useState(false);
  const [comingSoonSource, setComingSoonSource] = useState<NavPage>('home');
  const [openMapDirectly, setOpenMapDirectly] = useState(false);
  
  // Data states
  const [pendingOrderItems, setPendingOrderItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingHotelBooking, setPendingHotelBooking] = useState<BookingData | null>(null);
  
  // Initial category for tariffs page
  const [tariffsInitialCategory, setTariffsInitialCategory] = useState<string | undefined>(undefined);
  
  // Initial tariff ID for opening specific tariff detail page
  const [tariffsInitialTariffId, setTariffsInitialTariffId] = useState<string | undefined>(undefined);
  
  // Initial tab for hotels page
  const [hotelsInitialTab, setHotelsInitialTab] = useState<'all' | 'safedara' | 'cottages' | 'hotel'>('all');
  
  // Hotel booking states
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showHotelBooking, setShowHotelBooking] = useState(false);
  const [showHotelBookingConfirm, setShowHotelBookingConfirm] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  
  // Favorites state
  const [favoriteHotels, setFavoriteHotels] = useState<string[]>([]);
  const [favoriteHotelData, setFavoriteHotelData] = useState<any[]>([]);
  
  // Function to close all modals
  const closeAllModals = () => {
    setShowWeather(false);
    setShowCameras(false);
    setShowNews(false);
    setShowHotels(false);
    setShowRestaurantMenu(false);
    setShowEvents(false);
    setShowRules(false);
    setShowMyBookings(false);
    setShowPurchaseHistory(false);
    setShowPaymentMethods(false);
    setShowAddCard(false);
    setShowFeedback(false);
    setShowNotifications(false);
    setShowSettings(false);
    setShowFavorites(false);
    setShowInsurance(false);
    setShowAbout(false);
    setShowAddress(false);
    setShowComingSoon(false);
    setShowMyTickets(false);
    setShowTicketBarcode(false);
    setShowWorkingHours(false);
    setShowBookingDetails(false);
    setShowHotelBooking(false);
    setShowHotelBookingConfirm(false);
    setShowPaymentMethodModal(false);
    setShowMilliCardModal(false);
    setShowAktivbonkModal(false);
    setShowKids(false);
    setShowSchool(false);
    setShowEntertainment(false);
    setSelectedRoom(null);
    setCurrentBooking(null);
    setSelectedBooking(null);
    setPendingHotelBooking(null);
  };
  
  // Handle logout - clear registration and return to intro
  const handleLogout = () => {
    // Clear all registration data
    localStorage.removeItem('introShown');
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userEmail');
    
    // Reset states to show intro and registration
    setShowIntro(true);
    setShowRegistration(true);
    
    // Close all modals and reset to home
    closeAllModals();
    setCurrentPage('home');
  };

  // Toggle favorite hotel
  const handleToggleFavorite = (itemId: string, item: any) => {
    if (favoriteHotels.includes(itemId)) {
      // Remove from favorites
      setFavoriteHotels(prev => prev.filter(id => id !== itemId));
      setFavoriteHotelData(prev => prev.filter(hotel => hotel.id !== itemId));
    } else {
      // Add to favorites
      setFavoriteHotels(prev => [...prev, itemId]);
      setFavoriteHotelData(prev => [...prev, item]);
    }
  };
  
  // Handle favorite item click - navigate to booking
  const handleFavoriteItemClick = (item: any) => {
    setSelectedRoom({
      id: item.id,
      name: item.title,
      category: 'Изранное',
      area: 45,
      beds: item.capacity,
      price: item.price,
      image: item.images[0]
    });
    setShowFavorites(false);
    setShowHotelBooking(true);
  };

  // Add to cart function - накапливает товары из разных разделов
  const handleAddToCart = (categoryName: string, tariff: any, options: any[], date: string) => {
    // Очищаем старые товары этого тарифа перед добавлением новых
    const filteredCart = cartItems.filter(item => 
      !(item.category === categoryName && item.description.includes(tariff.name))
    );
    
    // Создаем новые товары только для опций с quantity > 0
    const newItems: CartItem[] = options
      .filter(option => option.quantity > 0)
      .map((option) => ({
        id: `${tariff.id}-${option.id}-${Date.now()}`,
        category: categoryName,
        name: option.name,
        description: `${tariff.name}`,
        date: date,
        price: option.price,
        quantity: option.quantity,
        image: tariff.image || 'https://images.unsplash.com/photo-1551524559-8af4e6624178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
      }));
    
    // Обновляем корзину
    setCartItems([...filteredCart, ...newItems]);
  };

  // Navigate to cart
  const handleGoToCart = () => {
    setCurrentPage('cart');
  };

  // Add card function
  const handleAddCard = (cardNumber: string, expiry: string) => {
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      cardNumber: cardNumber,
      expiry: expiry,
      cardType: getCardType(cardNumber)
    };
    setSavedCards((prev) => [...prev, newCard]);
    setShowAddCard(false);
    if (showHotelBookingConfirm || currentBooking) {
      setShowHotelBookingConfirm(true);
    } else {
      setShowPaymentMethods(true);
    }
  };

  // Delete card function
  const handleDeleteCard = (cardId: string) => {
    setSavedCards((prev) => prev.filter(card => card.id !== cardId));
  };

  // Get card type based on number
  const getCardType = (cardNumber: string): string => {
    const num = cardNumber.replace(/\\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('2')) return 'Мир';
    return 'Card';
  };

  // Checkout - open payment modal
  const handleCheckout = () => {
    console.log('=== handleCheckout called ===');
    console.log('cartItems.length:', cartItems.length);
    console.log('cartItems:', cartItems);
    
    if (cartItems.length === 0) return;
    
    setPendingOrderItems(cartItems);
    console.log('Setting pendingOrderItems:', cartItems);
    console.log('Opening payment method modal...');
    setShowPaymentMethodModal(true);
  };

  // Create order after payment method selection
  const createOrderAndProceed = (paymentMethod: 'kaspi' | 'card') => {
    if (pendingOrderItems.length === 0) return;
    
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU');
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: pendingOrderItems.map(item => ({
        id: item.id,
        name: item.name,
        categoryName: item.category,
        price: item.price,
        quantity: item.quantity,
        date: item.date,
        image: item.image,
        description: item.description
      })),
      total: pendingOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'paid',  // Immediately mark as paid after payment
      createdAt: formattedDate
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setPendingOrderItems([]);
    setShowPaymentMethodModal(false);
    setCurrentPage('profile');
    setShowPurchaseHistory(true);
  };

  // Handle payment modal close (user cancelled)
  const handlePaymentModalClose = () => {
    if (pendingOrderItems.length === 0) {
      setShowPaymentMethodModal(false);
      return;
    }

    // Create order with pending status
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU');
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: pendingOrderItems.map(item => ({
        id: item.id,
        name: item.name,
        categoryName: item.category,
        price: item.price,
        quantity: item.quantity,
        date: item.date,
        image: item.image,
        description: item.description
      })),
      total: pendingOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: formattedDate
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setPendingOrderItems([]);
    setShowPaymentMethodModal(false);
    setCurrentPage('profile');
    setShowPurchaseHistory(true);
  };

  // Pay order - open payment modal
  const handlePayOrder = (orderId: string) => {
    // Find the order and show payment modal
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Store the order ID for payment completion
      setPendingOrderItems(order.items.map(item => ({
        id: item.id,
        category: item.categoryName,
        name: item.name,
        description: item.description,
        date: item.date,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })));
      setShowPaymentMethodModal(true);
      // Store order ID to update later
      (window as any).pendingPaymentOrderId = orderId;
    }
  };

  // Complete payment after method selection
  const completePayment = (paymentMethod: 'kaspi' | 'card') => {
    const orderId = (window as any).pendingPaymentOrderId;
    if (orderId) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'paid' as const } : order
        )
      );
      delete (window as any).pendingPaymentOrderId;
    }
    setPendingOrderItems([]);
    setShowPaymentMethodModal(false);
    setCurrentPage('profile');
    setShowPurchaseHistory(true);
  };

  // Handle payment for existing order or create new order
  const handlePaymentMethodSelect = (paymentMethod: 'kaspi' | 'card') => {
    if (paymentMethod === 'kaspi') {
      // Open Milli card modal
      setShowPaymentMethodModal(false);
      setShowMilliCardModal(true);
    } else {
      // Open АКТИВБОНК modal
      setShowPaymentMethodModal(false);
      setShowAktivbonkModal(true);
    }
  };

  // Handle saved card selection
  const handleSavedCardSelect = (cardId: string) => {
    setShowPaymentMethodModal(false);
    
    if ((window as any).pendingPaymentOrderId) {
      // Payment for existing order
      completePayment('kaspi');
    } else {
      // New order from cart
      createOrderAndProceed('kaspi');
    }
  };

  // Handle Milli card payment
  const handleMilliCardPay = (cardNumber: string, cvv: string, expiry: string) => {
    setShowMilliCardModal(false);
    
    if ((window as any).pendingPaymentOrderId) {
      // Payment for existing order
      completePayment('kaspi');
    } else if (pendingHotelBooking) {
      // Payment for hotel booking
      completeHotelBookingPayment();
    } else {
      // New order from cart
      createOrderAndProceed('kaspi');
    }
  };

  // Handle Aktivbonk payment
  const handleAktivbonkPay = (cardNumber: string, cvv: string, expiry: string) => {
    setShowAktivbonkModal(false);
    
    if ((window as any).pendingPaymentOrderId) {
      // Payment for existing order
      completePayment('card');
    } else if (pendingHotelBooking) {
      // Payment for hotel booking
      completeHotelBookingPayment();
    } else {
      // New order from cart
      createOrderAndProceed('card');
    }
  };

  // Complete hotel booking payment
  const completeHotelBookingPayment = () => {
    if (!pendingHotelBooking) return;
    
    // Create a new booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomName: pendingHotelBooking.room.name,
      roomImage: pendingHotelBooking.room.image,
      checkIn: pendingHotelBooking.checkIn.toISOString().split('T')[0],
      checkOut: pendingHotelBooking.checkOut.toISOString().split('T')[0],
      guests: pendingHotelBooking.guests,
      nights: pendingHotelBooking.nights,
      totalPrice: pendingHotelBooking.totalPrice,
      status: 'active',
      bookingDate: new Date().toISOString().split('T')[0]
    };
    
    // Add booking to the list
    setBookings((prev) => [newBooking, ...prev]);
    
    // Clear states and navigate to My Bookings
    setPendingHotelBooking(null);
    setShowHotelBookingConfirm(false);
    setShowPaymentMethodModal(false);
    setShowHotels(false);
    setCurrentBooking(null);
    setSelectedRoom(null);
    setCurrentPage('profile');
    setShowMyBookings(true);
  };

  // Cancel order
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      )
    );
  };

  // Show intro first if not shown yet
  if (showIntro) {
    return (
      <IntroScreen
        onComplete={() => {
          localStorage.setItem('introShown', 'true');
          setShowIntro(false);
        }}
      />
    );
  }

  // Show registration if not completed
  if (showRegistration) {
    return (
      <RegistrationFlow
        onComplete={() => {
          setShowRegistration(false);
        }}
      />
    );
  }

  // Main app (registration complete)
  return (
    <>
      {/* Web Header - Desktop only */}
      <WebHeader
        onWeatherClick={() => setShowWeather(true)}
        onLiveClick={() => setShowCameras(true)}
        onCartClick={() => {
          closeAllModals();
          setCurrentPage('cart');
        }}
        onProfileClick={() => {
          closeAllModals();
          setCurrentPage('profile');
        }}
        onMenuClick={() => {
          closeAllModals();
          setCurrentPage('menu');
        }}
        onAboutClick={() => setShowAbout(true)}
        onTariffsClick={() => {
          closeAllModals();
          setTariffsInitialCategory(undefined);
          setTariffsInitialTariffId(undefined);
          setCurrentPage('tariffs');
        }}
        onNewsClick={() => setShowNews(true)}
        onServicesClick={() => {
          closeAllModals();
          setTariffsInitialCategory(undefined);
          setTariffsInitialTariffId(undefined);
          setCurrentPage('tariffs');
        }}
        onFavoritesClick={() => {
          closeAllModals();
          setShowFavorites(true);
        }}
        favoritesCount={favoriteHotels.length}
        onLogoClick={() => {
          // Return to home
          closeAllModals();
          setCurrentPage('home');
        }}
        cartItemsCount={cartItems.length}
        currentPage={
          showNews ? 'news' : 
          showAbout ? 'about' : 
          currentPage === 'tariffs' ? 'tariffs' : 
          'home'
        }
      />

      {/* Main Content Area */}
      <div>
        {/* Payment Method Modal */}
        {showPaymentMethodModal && (
          <PaymentMethodModal
            isOpen={showPaymentMethodModal}
            onClose={handlePaymentModalClose}
            onSelectKaspi={() => handlePaymentMethodSelect('kaspi')}
            onSelectCard={() => handlePaymentMethodSelect('card')}
            savedCards={savedCards}
            onSelectSavedCard={handleSavedCardSelect}
          />
        )}

        {/* Milli Card Payment Modal */}
        {showMilliCardModal && (() => {
          const totalAmount = pendingOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemsCount = pendingOrderItems.reduce((sum, item) => sum + item.quantity, 0);
          
          return (
            <>
              {/* Mobile Version */}
              <div className="lg:hidden">
                <MilliCardPaymentModal
                  isOpen={showMilliCardModal}
                  onClose={() => setShowMilliCardModal(false)}
                  onPay={handleMilliCardPay}
                  totalAmount={totalAmount}
                  itemsCount={itemsCount}
                  productsAmount={totalAmount}
                  savedCards={savedCards}
                  onWeatherClick={() => setShowWeather(true)}
                  onLiveClick={() => setShowCameras(true)}
                />
              </div>
              
              {/* Desktop Version */}
              <div className="hidden lg:block">
                <WebMilliCardPaymentModal
                  isOpen={showMilliCardModal}
                  onClose={() => setShowMilliCardModal(false)}
                  onPay={handleMilliCardPay}
                  totalAmount={totalAmount}
                  itemsCount={itemsCount}
                  productsAmount={totalAmount}
                  savedCards={savedCards}
                />
              </div>
            </>
          );
        })()}

        {/* АКТИВБОНК Payment Modal */}
        {showAktivbonkModal && (() => {
          const totalAmount = pendingOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const itemsCount = pendingOrderItems.reduce((sum, item) => sum + item.quantity, 0);
          
          return (
            <AktivbonkPaymentModal
              isOpen={showAktivbonkModal}
              onClose={() => setShowAktivbonkModal(false)}
              onPay={handleAktivbonkPay}
              totalAmount={totalAmount}
              itemsCount={itemsCount}
              productsAmount={totalAmount}
              onWeatherClick={() => setShowWeather(true)}
              onLiveClick={() => setShowCameras(true)}
            />
          );
        })()}

        {/* Weather Overlay */}
        {showWeather ? (
          <WeatherPage onBack={() => setShowWeather(false)} />
        ) : showCameras ? (
          <CamerasPage 
            onBack={() => setShowCameras(false)} 
            onWeatherClick={() => setShowWeather(true)} 
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showNews ? (
          <NewsPage 
            onBack={() => {
              setShowNews(false);
              setNewsInitialId(undefined); // Reset news ID when going back
            }}
            initialNewsId={newsInitialId}
          />
        ) : showWorkingHours ? (
          <WorkingHoursPage 
            onBack={() => setShowWorkingHours(false)}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showHotelBookingConfirm && currentBooking ? (
          // Conditional rendering: mobile vs desktop
          <>
            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebHotelBookingConfirmPage
                booking={currentBooking}
                onBack={() => {
                  setShowHotelBookingConfirm(false);
                  setShowHotelBooking(true);
                }}
                onConfirmBooking={() => {
                  // Store booking data and open payment modal
                  setPendingHotelBooking(currentBooking);
                  setShowPaymentMethodModal(true);
                }}
                onWeatherClick={() => setShowWeather(true)}
                onLiveClick={() => setShowCameras(true)}
              />
            </div>
            
            {/* Mobile Version */}
            <div className="lg:hidden">
              <HotelBookingConfirmPage
                booking={currentBooking}
                savedCards={savedCards}
                onBack={() => {
                  setShowHotelBookingConfirm(false);
                  setShowHotelBooking(true);
                }}
                onConfirmBooking={() => {
                  // Store booking data and open payment modal
                  setPendingHotelBooking(currentBooking);
                  setShowPaymentMethodModal(true);
                }}
                onWeatherClick={() => setShowWeather(true)}
                onLiveClick={() => setShowCameras(true)}
              />
            </div>
          </>
        ) : showHotelBooking && selectedRoom ? (
          <HotelBookingPage
            room={selectedRoom}
            onBack={() => {
              setShowHotelBooking(false);
              setShowHotels(true);
            }}
            onContinue={(booking) => {
              setCurrentBooking(booking);
              setShowHotelBooking(false);
              setShowHotelBookingConfirm(true);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showHotels ? (
          <HotelsPage 
            onBack={() => {
              setShowHotels(false);
              setHotelsInitialTab('all'); // Reset to default when going back
              setCurrentPage('home');
            }}
            onRoomSelect={(room) => {
              setSelectedRoom(room);
              setShowHotels(false);
              setShowHotelBooking(true);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
            favorites={favoriteHotels}
            onToggleFavorite={handleToggleFavorite}
            initialTab={hotelsInitialTab}
          />
        ) : showRestaurantMenu ? (
          <RestaurantMenuPage 
            onBack={() => {
              setShowRestaurantMenu(false);
              setRestaurantInitialCategory(undefined); // Reset category when going back
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
            initialCategory={restaurantInitialCategory}
          />
        ) : showEvents ? (
          <EventsPage 
            onBack={() => setShowEvents(false)}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showRules ? (
          <RulesPage 
            onBack={() => setShowRules(false)}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showBookingDetails && selectedBooking ? (
          <BookingDetailsPage
            booking={selectedBooking}
            onBack={() => {
              setShowBookingDetails(false);
              setShowMyBookings(true);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showMyBookings ? (
          <MyBookingsPage
            bookings={bookings}
            onBack={() => {
              setShowMyBookings(false);
              setCurrentPage('profile');
            }}
            onBookingClick={(booking) => {
              setSelectedBooking(booking);
              setShowMyBookings(false);
              setShowBookingDetails(true);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showMyTickets ? (
          <MyTicketsPage
            orders={orders}
            onBack={() => {
              setShowMyTickets(false);
              setCurrentPage('profile');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showPurchaseHistory ? (
          <>
            {/* Mobile Version */}
            <div className="lg:hidden">
              <PurchaseHistoryPage
                orders={orders}
                onBack={() => {
                  setShowPurchaseHistory(false);
                  setCurrentPage('profile');
                }}
                onPayOrder={handlePayOrder}
                onCancelOrder={handleCancelOrder}
              />
            </div>

            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebPurchaseHistoryPage
                orders={orders}
                onBack={() => {
                  setShowPurchaseHistory(false);
                  setCurrentPage('profile');
                }}
                onPayOrder={handlePayOrder}
                onCancelOrder={handleCancelOrder}
              />
            </div>
          </>
        ) : showPaymentMethods ? (
          <PaymentMethodsPage
            savedCards={savedCards}
            onBack={() => {
              setShowPaymentMethods(false);
              setCurrentPage('profile');
            }}
            onAddCard={() => {
              setShowPaymentMethods(false);
              setShowAddCard(true);
            }}
            onDeleteCard={handleDeleteCard}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showAddCard ? (
          <AddCardPage
            onBack={() => {
              setShowAddCard(false);
              setShowPaymentMethods(true);
            }}
            onAddCard={handleAddCard}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showFeedback ? (
          <FeedbackPage
            onBack={() => {
              setShowFeedback(false);
              setCurrentPage('profile');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showNotifications ? (
          <NotificationsPage
            onBack={() => {
              setShowNotifications(false);
              setCurrentPage('profile');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showSettings ? (
          <SettingsPage
            onBack={() => {
              setShowSettings(false);
              setCurrentPage('profile');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showFavorites ? (
          <>
            {/* Mobile Version */}
            <div className="lg:hidden">
              <FavoritesPage
                favorites={favoriteHotelData}
                onBack={() => {
                  setShowFavorites(false);
                  setCurrentPage('profile');
                }}
                onItemClick={handleFavoriteItemClick}
                onRemoveFavorite={(itemId) => {
                  setFavoriteHotels(prev => prev.filter(id => id !== itemId));
                  setFavoriteHotelData(prev => prev.filter(hotel => hotel.id !== itemId));
                }}
              />
            </div>

            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebFavoritesPage
                favorites={favoriteHotelData}
                onBack={() => {
                  setShowFavorites(false);
                  setCurrentPage('profile');
                }}
                onItemClick={handleFavoriteItemClick}
                onRemoveFavorite={(itemId) => {
                  setFavoriteHotels(prev => prev.filter(id => id !== itemId));
                  setFavoriteHotelData(prev => prev.filter(hotel => hotel.id !== itemId));
                }}
              />
            </div>
          </>
        ) : showInsurance ? (
          <InsurancePage
            onBack={() => {
              setShowInsurance(false);
              setCurrentPage('profile');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showAbout ? (
          <AboutPage
            onBack={() => {
              setShowAbout(false);
              setCurrentPage('home');
            }}
            onRulesClick={() => {
              setShowAbout(false);
              setShowRules(true);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showAddress ? (
          <AddressPage
            onBack={() => {
              setShowAddress(false);
              setCurrentPage('home');
            }}
            openMapDirectly={openMapDirectly}
            onMapClose={() => setOpenMapDirectly(false)}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showEntertainment ? (
          <EntertainmentPage
            onBack={() => {
              setShowEntertainment(false);
              setShowComingSoon(false);
              setCurrentPage('home');
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : showComingSoon ? (
          <ComingSoonPage
            title={
              showKids ? 'Детям' :
              showSchool ? 'Школа' :
              'Coming Soon'
            }
            description={
              showKids ? 'Раздел для детей находится в разработке. Скоро здесь появятся специальные программы и мероприятия для маленьких гостей!' :
              showSchool ? 'Раздел школы находится в разработке. Скоро здесь появится информация об обучающих программах и курсах!' :
              'Этот раздел находится в разработке'
            }
            onBack={() => {
              setShowComingSoon(false);
              setShowKids(false);
              setShowSchool(false);
              setCurrentPage(comingSoonSource);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : currentPage === 'home' ? (
          <div className="min-h-screen bg-white max-w-[402px] lg:max-w-none mx-auto w-full overflow-x-hidden">
            {/* Mobile header - hide on desktop */}
            <div className="lg:hidden">
              <ModernHeader 
                onWeatherClick={() => setShowWeather(true)} 
                onLiveClick={() => setShowCameras(true)}
              />
            </div>
            
            <div className="lg:max-w-[1400px] lg:mx-auto lg:px-8">
              <HeroSlider />
              
              {/* Desktop Category Bar - Desktop only */}
              <DesktopCategoryBar
                onCategoryClick={(category) => {
                  closeAllModals();
                  if (category === 'services') {
                    setTariffsInitialCategory(undefined);
                    setTariffsInitialTariffId(undefined);
                    setCurrentPage('tariffs');
                  } else if (category === 'restaurant') {
                    setRestaurantInitialCategory(undefined);
                    setShowRestaurantMenu(true);
                  } else if (category === 'rental') {
                    setTariffsInitialCategory('rental');
                    setTariffsInitialTariffId(undefined);
                    setCurrentPage('tariffs');
                  } else if (category === 'hotels') {
                    setHotelsInitialTab('all');
                    setShowHotels(true);
                  } else if (category === 'about') {
                    setShowAbout(true);
                  } else if (category === 'address') {
                    setOpenMapDirectly(false);
                    setShowAddress(true);
                  } else if (category === 'entertainment') {
                    setComingSoonSource('home');
                    setShowComingSoon(true);
                    setShowEntertainment(true);
                  }
                }}
              />
              
              {/* Mobile Category Icons - Mobile only */}
              <div className="lg:hidden">
                <CategoryIcons
                  onCategoryClick={(category) => {
                    closeAllModals();
                    if (category === 'Услуги') {
                      setTariffsInitialCategory(undefined);
                      setTariffsInitialTariffId(undefined);
                      setCurrentPage('tariffs');
                    } else if (category === 'Ресторан') {
                      setRestaurantInitialCategory(undefined);
                      setShowRestaurantMenu(true);
                    } else if (category === 'Прокат') {
                      setTariffsInitialCategory('rental');
                      setTariffsInitialTariffId(undefined);
                      setCurrentPage('tariffs');
                    } else if (category === 'Гостиницы') {
                      setHotelsInitialTab('all');
                      setShowHotels(true);
                    } else if (category === 'Развлечение') {
                      setComingSoonSource('home');
                      setShowComingSoon(true);
                      setShowEntertainment(true);
                    } else if (category === 'О сафеддаре') {
                      closeAllModals();
                      setShowAbout(true);
                    } else if (category === 'Адрес') {
                      setOpenMapDirectly(false);
                      setShowAddress(true);
                    }
                  }}
                />
              </div>
              
              <RentalSection onViewAll={() => {
                closeAllModals();
                setTariffsInitialCategory('rental');
                setTariffsInitialTariffId(undefined);
                setCurrentPage('tariffs');
              }} onCardClick={(tariffId) => {
                closeAllModals();
                setTariffsInitialCategory('rental');
                setTariffsInitialTariffId(tariffId);
                setCurrentPage('tariffs');
              }} />
              <ServicesSection onViewAll={() => {
                closeAllModals();
                setTariffsInitialCategory(undefined);
                setCurrentPage('tariffs');
              }} onCardClick={(category) => {
                closeAllModals();
                setTariffsInitialCategory(category);
                setCurrentPage('tariffs');
              }} />
              <HotelSection onViewAll={() => {
                closeAllModals();
                setShowHotels(true);
              }} onCardClick={(tab) => {
                closeAllModals();
                setHotelsInitialTab(tab);
                setShowHotels(true);
              }} />
              <RestaurantSection onViewMenu={() => {
                closeAllModals();
                setRestaurantInitialCategory(undefined);
                setShowRestaurantMenu(true);
              }} onCardClick={(category) => {
                closeAllModals();
                setRestaurantInitialCategory(category);
                setShowRestaurantMenu(true);
              }} />
              <NewsSection onNewsClick={() => {
                closeAllModals();
                setNewsInitialId(undefined);
                setShowNews(true);
              }} onCardClick={(newsId) => {
                closeAllModals();
                setNewsInitialId(newsId);
                setShowNews(true);
              }} />
              <AppPromoSection />              
            </div>

            {/* Web Footer - Desktop only */}
            <WebFooter 
              onAboutClick={() => {
                closeAllModals();
                setShowAbout(true);
              }}
              onTariffsClick={() => {
                closeAllModals();
                setTariffsInitialCategory(undefined);
                setTariffsInitialTariffId(undefined);
                setCurrentPage('tariffs');
              }}
              onHotelsClick={() => {
                closeAllModals();
                setHotelsInitialTab('all');
                setShowHotels(true);
              }}
              onRestaurantClick={() => {
                closeAllModals();
                setRestaurantInitialCategory(undefined);
                setShowRestaurantMenu(true);
              }}
              onNewsClick={() => {
                closeAllModals();
                setNewsInitialId(undefined);
                setShowNews(true);
              }}
              onRentalClick={() => {
                closeAllModals();
                setTariffsInitialCategory('rental');
                setTariffsInitialTariffId(undefined);
                setCurrentPage('tariffs');
              }}
              onCableCarClick={() => {
                setTariffsInitialCategory('season-pass');
                setTariffsInitialTariffId(undefined);
                setCurrentPage('tariffs');
              }}
              onIceRinkClick={() => {
                setTariffsInitialCategory('season-pass');
                setTariffsInitialTariffId('season-1');
                setCurrentPage('tariffs');
              }}
              onSchoolClick={() => {
                setComingSoonSource('home');
                setShowComingSoon(true);
                setShowSchool(true);
              }}
              onEntertainmentClick={() => {
                setComingSoonSource('home');
                setShowComingSoon(false);
                setShowEntertainment(true);
              }}
            />
          </div>
        ) : currentPage === 'menu' ? (
          <MenuPage
            onHotelsClick={() => {
              closeAllModals();
              setHotelsInitialTab('all');
              setShowHotels(true);
            }}
            onRestaurantClick={() => {
              closeAllModals();
              setRestaurantInitialCategory(undefined);
              setShowRestaurantMenu(true);
            }}
            onEventsClick={() => {
              closeAllModals();
              setShowEvents(true);
            }}
            onRulesClick={() => {
              closeAllModals();
              setShowRules(true);
            }}
            onCamerasClick={() => {
              closeAllModals();
              setShowCameras(true);
            }}
            onNewsClick={() => {
              closeAllModals();
              setNewsInitialId(undefined);
              setShowNews(true);
            }}
            onWorkingHoursClick={() => {
              closeAllModals();
              setShowWorkingHours(true);
            }}
            onAboutClick={() => {
              closeAllModals();
              setShowAbout(true);
            }}
            onNavigate={(page) => {
              if (page === 'entertainment') {
                setComingSoonSource('menu');
                setShowComingSoon(true);
                setShowEntertainment(true);
              } else if (page === 'school') {
                setComingSoonSource('menu');
                setShowComingSoon(true);
                setShowSchool(true);
              } else if (page === 'kids') {
                setComingSoonSource('menu');
                setShowComingSoon(true);
                setShowKids(true);
              }
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        ) : currentPage === 'tariffs' ? (
          <TariffsPage
            onBack={() => setCurrentPage('home')}
            onAddToCart={handleAddToCart}
            onGoToCart={handleGoToCart}
            cartItemsCount={cartItems.length}
            cartTotal={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
            initialCategory={tariffsInitialCategory}
            initialTariffId={tariffsInitialTariffId}
          />
        ) : currentPage === 'cart' ? (
          <>
            {/* Mobile Version */}
            <div className="lg:hidden">
              <CartPage
                cartItems={cartItems}
                onUpdateCart={(items) => setCartItems(items)}
                onCheckout={handleCheckout}
                onWeatherClick={() => setShowWeather(true)}
                onLiveClick={() => setShowCameras(true)}
              />
            </div>

            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebCartPage
                cartItems={cartItems}
                onUpdateCart={(items) => setCartItems(items)}
                onCheckout={handleCheckout}
                onBack={() => setCurrentPage('home')}
              />
            </div>
          </>
        ) : (
          <ProfilePage
            onMyBookingsClick={() => {
              setCurrentPage('profile');
              setShowMyBookings(true);
            }}
            onMyTicketsClick={() => {
              setCurrentPage('profile');
              setShowMyTickets(true);
            }}
            onPurchaseHistoryClick={() => {
              setCurrentPage('profile');
              setShowPurchaseHistory(true);
            }}
            onPaymentMethodsClick={() => {
              setCurrentPage('profile');
              setShowPaymentMethods(true);
            }}
            onAddCardClick={() => {
              setCurrentPage('profile');
              setShowAddCard(true);
            }}
            onFeedbackClick={() => {
              setCurrentPage('profile');
              setShowFeedback(true);
            }}
            onNotificationsClick={() => {
              setCurrentPage('profile');
              setShowNotifications(true);
            }}
            onSettingsClick={() => {
              setCurrentPage('profile');
              setShowSettings(true);
            }}
            onFavoritesClick={() => {
              setCurrentPage('profile');
              setShowFavorites(true);
            }}
            onInsuranceClick={() => {
              setCurrentPage('profile');
              setShowInsurance(true);
            }}
            onAboutClick={() => {
              setCurrentPage('profile');
              setShowAbout(true);
            }}
            onRulesClick={() => {
              setCurrentPage('profile');
              setShowRules(true);
            }}
            onLogout={handleLogout}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
          />
        )}
      </div>

      {/* Bottom Navigation - only show on mobile screens and main pages */}
      {!hideBottomNav && 
       !showWeather && 
       !showHotels && 
       !showNews &&
       !showRestaurantMenu &&
       !showEvents &&
       !showRules &&
       !showCameras &&
       !showPaymentMethods &&
       !showAddCard &&
       !showPurchaseHistory &&
       !showFeedback &&
       !showNotifications &&
       !showSettings &&
       !showFavorites &&
       !showInsurance &&
       !showAbout &&
       !showAddress &&
       !showEntertainment &&
       !showComingSoon &&
       !showHotelBooking &&
       !showHotelBookingConfirm &&
       !showMyBookings &&
       !showBookingDetails &&
       !showWorkingHours &&
       !showPaymentMethodModal &&
       !showMilliCardModal &&
       !showAktivbonkModal && (
        <ModernBottomNav
          activeTab={currentPage}
          onTabChange={(tab) => setCurrentPage(tab)}
        />
      )}
    </>
  );
}

export default function App() {
  // Check URL for admin panel access - only via /admin path
  const [isAdminPanel, setIsAdminPanel] = useState(
    window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
  );
  
  // Listen for URL changes (both pathname and hash changes)
  useEffect(() => {
    const checkAdminRoute = () => {
      const isAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
      setIsAdminPanel(isAdmin);
    };
    
    // Check on popstate (back/forward navigation)
    window.addEventListener('popstate', checkAdminRoute);
    
    // Check on hash change (for hash-based routing)
    window.addEventListener('hashchange', checkAdminRoute);
    
    // Also check periodically in case of programmatic navigation
    const interval = setInterval(checkAdminRoute, 100);
    
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      clearInterval(interval);
    };
  }, []);
  
  // If accessing admin panel, show AdminApp
  if (isAdminPanel) {
    return <AdminApp />;
  }
  
  // Otherwise show main app
  return (
    <LanguageProvider>
      <ScrollPositionProvider>
        <AppContent />
      </ScrollPositionProvider>
    </LanguageProvider>
  );
}