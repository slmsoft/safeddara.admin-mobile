import { useState, useEffect } from 'react';
import { DesktopCategoryBar } from './components/DesktopCategoryBar';
import { LanguageProvider } from './contexts/LanguageContext';
import { ScrollPositionProvider } from './contexts/ScrollPositionContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminApp } from './components/admin/AdminApp';
import type { Order as ApiOrder, OrderProduct } from '../api/types';
import { HotelBookingPage, BookingData } from './components/HotelBookingPage';
import { HotelBookingConfirmPage } from './components/HotelBookingConfirmPage';
import { WebHotelBookingConfirmPage } from './components/WebHotelBookingConfirmPage';
import { MyBookingsPage, Booking } from './components/MyBookingsPage';
import { BookingDetailsPage } from './components/BookingDetailsPage';
import { WorkingHoursPage } from './components/WorkingHoursPage';
import { PurchaseHistoryPage, Order } from './components/PurchaseHistoryPage';
import { WebPurchaseHistoryPage } from './components/WebPurchaseHistoryPage';
import { PaymentMethodModal } from './components/PaymentMethodModal';
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
import { PaymentWebViewPage } from './components/PaymentWebViewPage';
import { PaymentReturnPage } from './components/PaymentReturnPage';
import { EntertainmentPage } from './components/EntertainmentPage';
import { ComingSoonPage } from './components/ComingSoonPage';
import { WebHeader } from './components/WebHeader';
import { WebFooter } from './components/WebFooter';
import { RegistrationFlow } from './components/RegistrationFlow';
import { LoginPage } from './components/LoginPage';

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
  productId: number; // Real productId from API
  categoryId: number; // Real categoryId from API
}

interface SavedCard {
  id: string;
  cardNumber: string;
  expiry: string;
  cardType: string;
}

function formatTicketNumber(rawId: string | number): string {
  const s = String(rawId);
  return s.length > 12 ? s.replace(/-/g, '').slice(-6).toUpperCase() : s;
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  
  // Check if registration is completed (intro removed - show registration directly)
  const [showRegistration, setShowRegistration] = useState(() => {
    // Show registration if not registered AND not authenticated
    // Use localStorage check directly to avoid hook dependency in initializer
    try {
      const isRegistered = localStorage.getItem('isRegistered');
      const hasSession = localStorage.getItem('safeddara_session');
      return !isRegistered && !hasSession;
    } catch {
      return true; // Show registration if localStorage is not available
    }
  });
  
  // Login page state
  const [showLogin, setShowLogin] = useState(false);
  const [loginFromMainApp, setLoginFromMainApp] = useState(false);
  
  // Update registration state when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      setShowRegistration(false);
    } else {
      // Re-check registration state if auth changes
      const isRegistered = localStorage.getItem('isRegistered');
      const hasSession = localStorage.getItem('safeddara_session');
      setShowRegistration(!isRegistered && !hasSession);
    }
  }, [isAuthenticated]);

  // Load payments from API — GET /payments/all (Swagger)
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  
  const loadPayments = async () => {
    if (!isAuthenticated) return;
    setPaymentsLoading(true);
    try {
      const { paymentsApi } = await import('../api/payments');
      const response = await paymentsApi.getAllPayments();
      if (response.success && response.data && typeof response.data === 'object') {
        const userPayments = (response.data as any).userPayments;
        if (Array.isArray(userPayments)) {
          const mappedOrders: Order[] = userPayments.map((payment: any) => {
            const total = payment.totalPrice ?? payment.totalAmount ?? payment.amount ?? payment.total ?? 0;
            const orderType = payment.orderType || 'Услуга';
            const items = payment.items && Array.isArray(payment.items) && payment.items.length > 0
              ? payment.items.map((item: any) => ({
                  id: String(item.productId ?? item.id ?? ''),
                  name: item.name || item.title || 'Товар',
                  categoryName: item.categoryName || payment.categoryName || orderType,
                  price: item.price ?? total,
                  quantity: item.quantity ?? 1,
                  date: payment.date ? new Date(payment.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
                  image: item.image || '',
                  description: item.description || '',
                }))
              : [{ id: '1', name: orderType, categoryName: orderType, price: total, quantity: 1, date: '', image: '', description: '' }];
            const statusMap: Record<string, Order['status']> = {
              payment_paid: 'paid', payment_failed: 'cancelled', payment_pending: 'pending',
              paid: 'paid', cancelled: 'cancelled',
            };
            const rawId = payment.orderId || payment.id || `order-${Date.now()}`;
            return {
              id: rawId,
              orderNumber: formatTicketNumber(rawId),
              items,
              total: Number(total),
              status: statusMap[payment.status] ?? 'pending',
              createdAt: payment.date ? new Date(payment.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            };
          });
          setOrders(mappedOrders);
        }
      }
    } catch (err: any) {
      console.error('Error loading payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Не загружаем платежи при старте — только при открытии «История покупок» или после оплаты
  
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

  // Загружаем платежи только при открытии «Мои билеты». История покупок — только по pull-to-refresh (меньше нагрузка на сервер)
  useEffect(() => {
    if (showMyTickets && isAuthenticated) {
      loadPayments();
    }
  }, [showMyTickets]);

  // Загружаем бронирования отеля при открытии «Мои бронирования»
  const loadBookings = async () => {
    if (!isAuthenticated) return;
    setBookingsLoading(true);
    try {
      const { backendApi } = await import('../api/backendApi');
      // Как safeddara-api: сначала GET /payments/all (CheckPaymentStatus, обновление статусов)
      await backendApi.getAllPayments();
      const res = await backendApi.getBookings();
      if (res.success && res.data?.bookings && Array.isArray(res.data.bookings)) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const mapped: Booking[] = (res.data.bookings as any[]).map((b) => {
          const acc = b.accommodation || {};
          const checkInRaw = typeof b.checkIn === 'string' ? b.checkIn : new Date(b.checkIn).toISOString();
          const checkOutRaw = typeof b.checkOut === 'string' ? b.checkOut : new Date(b.checkOut).toISOString();
          const checkOutDate = new Date(checkOutRaw);
          checkOutDate.setHours(0, 0, 0, 0);
          // Логика статуса: pending/cancelled из API; confirmed → active если впереди, completed если уже прошло
          let status: Booking['status'];
          if (b.status === 'cancelled') {
            status = 'cancelled';
          } else if (b.status === 'pending' || b.status === 'pending_payment') {
            status = 'pending';
          } else if (b.status === 'confirmed' || b.status === 'completed') {
            status = checkOutDate < todayStart ? 'completed' : 'active';
          } else {
            status = 'active';
          }
          return {
            id: b.id,
            roomName: acc.title || 'Номер',
            roomImage: acc.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            checkIn: checkInRaw.split('T')[0],
            checkOut: checkOutRaw.split('T')[0],
            checkInFull: checkInRaw,
            checkOutFull: checkOutRaw,
            guests: b.guests ?? 1,
            nights: b.nights ?? 1,
            totalPrice: b.totalPrice ?? 0,
            status,
            bookingDate: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          };
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error('Load bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (showMyBookings && isAuthenticated) {
      loadBookings();
    }
  }, [showMyBookings, isAuthenticated]);
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
  const [addCardFromPaymentModal, setAddCardFromPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentUrlLoading, setPaymentUrlLoading] = useState(false);
  const [paymentSource, setPaymentSource] = useState<'products' | 'hotel'>('products');
  const [comingSoonSource, setComingSoonSource] = useState<NavPage>('home');
  const [openMapDirectly, setOpenMapDirectly] = useState(false);
  
  // Data states
  const [pendingOrderItems, setPendingOrderItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
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
  const [favoriteRestaurantItems, setFavoriteRestaurantItems] = useState<Array<{ id: string; name: string; price: number; image: string; category: string }>>([]);
  
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
    setShowKids(false);
    setShowSchool(false);
    setShowEntertainment(false);
    setSelectedRoom(null);
    setCurrentBooking(null);
    setSelectedBooking(null);
    setPendingHotelBooking(null);
  };
  
  // Handle logout - clear session only, keep profile data for re-login
  const handleLogout = () => {
    logout(); // Clear session (AuthContext)
    // Keep userName, userEmail, userPhone — so after re-login profile shows correctly
    localStorage.removeItem('isRegistered');
    
    setShowRegistration(true);
    closeAllModals();
    setCurrentPage('home');
  };

  // Слушаем postMessage от iframe с Commerzbank — после оплаты закрываем WebView и переходим в «Мои брони»
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'payment_complete') {
        setShowPaymentWebView(false);
        setPaymentUrl(null);
        setCurrentPage('profile');
        if (paymentSource === 'hotel') {
          setShowMyBookings(true);
          import('../api/backendApi').then(({ backendApi }) => {
            backendApi.getAllPayments().then(() =>
              backendApi.getBookings()
            ).then((res) => {
              if (res.success && res.data?.bookings) {
                const mapped = (res.data.bookings as any[]).map((b: any) => {
                  const checkInRaw = b.checkIn ? (typeof b.checkIn === 'string' ? b.checkIn : new Date(b.checkIn).toISOString()) : '';
                  const checkOutRaw = b.checkOut ? (typeof b.checkOut === 'string' ? b.checkOut : new Date(b.checkOut).toISOString()) : '';
                  return {
                  id: b.id,
                  roomName: b.accommodation?.title || '—',
                  roomImage: b.accommodation?.images?.[0] || '',
                  checkIn: checkInRaw ? checkInRaw.split('T')[0] : '',
                  checkOut: checkOutRaw ? checkOutRaw.split('T')[0] : '',
                  checkInFull: checkInRaw || undefined,
                  checkOutFull: checkOutRaw || undefined,
                  guests: b.guests || 0,
                  nights: b.nights || 0,
                  totalPrice: b.totalPrice || 0,
                  status: (b.status === 'confirmed') ? 'active' : (b.status === 'cancelled') ? 'cancelled' : (b.status === 'pending_payment') ? 'pending' : 'active',
                  bookingDate: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '',
                };
                });
                setBookings(mapped);
              }
            }).catch(console.error);
          });
        } else {
          setShowPurchaseHistory(true);
        }
        import('../api/payments').then(({ paymentsApi }) => {
          paymentsApi.getAllPayments().then((payResponse) => {
            if (payResponse.success && payResponse.data && typeof payResponse.data === 'object') {
              const userPayments = (payResponse.data as any).userPayments;
              if (Array.isArray(userPayments)) {
                setOrders(userPayments.map((p: any) => {
                  const rawId = p.orderId || p.id || `order-${Date.now()}`;
                  return {
                    id: rawId,
                    orderNumber: formatTicketNumber(rawId),
                    items: [{ id: '1', name: p.orderType || 'Услуга', categoryName: 'Услуга', price: p.totalPrice ?? p.totalAmount ?? 0, quantity: 1, date: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '', image: '', description: '' }],
                    total: p.totalPrice ?? p.totalAmount ?? 0,
                    status: (p.status === 'payment_paid' || p.status === 'paid') ? 'paid' : p.status === 'canceled' ? 'cancelled' : 'pending',
                    createdAt: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                  };
                }));
              }
            }
          }).catch(console.error);
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [paymentSource]);

  // Toggle favorite hotel
  const handleToggleFavorite = (itemId: string, item: any) => {
    if (favoriteHotels.includes(itemId)) {
      setFavoriteHotels(prev => prev.filter(id => id !== itemId));
      setFavoriteHotelData(prev => prev.filter(hotel => hotel.id !== itemId));
    } else {
      setFavoriteHotels(prev => [...prev, itemId]);
      setFavoriteHotelData(prev => [...prev, item]);
    }
  };

  // Toggle favorite restaurant item
  const handleToggleRestaurantFavorite = (item: { id: string; name: string; price: number; image: string; category: string }) => {
    const exists = favoriteRestaurantItems.some((f) => f.id === item.id);
    if (exists) {
      setFavoriteRestaurantItems((prev) => prev.filter((f) => f.id !== item.id));
    } else {
      setFavoriteRestaurantItems((prev) => [...prev, item]);
    }
  };
  
  // Handle favorite item click - hotel: booking, restaurant: open menu
  const handleFavoriteItemClick = (item: any) => {
    if (item.type === 'restaurant') {
      setShowFavorites(false);
      setRestaurantInitialCategory(item.category);
      setShowRestaurantMenu(true);
    } else {
      setSelectedRoom({
        id: item.id,
        name: item.title,
        category: 'Избранное',
        area: 45,
        beds: item.capacity,
        price: item.price,
        image: item.images[0]
      });
      setShowFavorites(false);
      setShowHotelBooking(true);
    }
  };

  // Add to cart function - накапливает товары из разных разделов
  // Now uses real productId and categoryId from API
  const handleAddToCart = (categoryName: string, tariff: any, options: any[], date: string) => {
    // Очищаем старые товары этого тарифа перед добавлением новых
    const filteredCart = cartItems.filter(item => 
      !(item.category === categoryName && item.description.includes(tariff.name))
    );
    
    // Создаем новые товары только для опций с quantity > 0
    // tariff now contains productId and categoryId from API
    const newItems: CartItem[] = options
      .filter(option => option.quantity > 0)
      .map((option) => ({
        id: `${tariff.productId || tariff.id}-${option.id}-${Date.now()}`,
        category: categoryName,
        name: option.name,
        description: `${tariff.name}`,
        date: date,
        price: option.price,
        quantity: option.quantity,
        image: tariff.image || 'https://images.unsplash.com/photo-1551524559-8af4e6624178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        productId: tariff.productId || 0, // Real productId from API
        categoryId: tariff.categoryId || 0, // Real categoryId from API
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

  // Load saved cards from API when opening payment
  // Swagger: userCards: [{ cardId, cardMasked, exp, cardBrand }]
  const loadSavedCardsFromApi = async () => {
    try {
      const { cardsApi } = await import('../api/cards');
      const response = await cardsApi.getAllCards();
      if (response.success && response.data && typeof response.data === 'object') {
        const userCards = (response.data as any).userCards;
        if (Array.isArray(userCards) && userCards.length > 0) {
          const cards: SavedCard[] = userCards.map((uc: any) => {
            const cardId = uc.cardId ?? uc.id ?? 0;
            // Поддержка разных форматов API: cardMasked, pun, card_number, masked
            const masked = (uc.cardMasked ?? uc.pun ?? uc.card_number ?? uc.masked ?? '').toString();
            // Извлекаем последние 4 цифры из любой маски (****1234, 5058****0662 и т.д.)
            const digits = masked.replace(/\D/g, '');
            const last4 = digits.length >= 4 ? digits.slice(-4) : (masked.length >= 4 ? masked.slice(-4) : '');
            const exp = (uc.exp ?? uc.expiry ?? (uc.expMonth != null && uc.expYear != null ? `${uc.expMonth}/${uc.expYear}` : '')).toString();
            const derivedType = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Milli';
            return {
              id: `card-${cardId}`,
              cardNumber: last4 ? `****${last4}` : masked || '••••',
              expiry: exp,
              cardType: uc.cardBrand ?? uc.cardType ?? derivedType,
            };
          });
          setSavedCards(cards);
        }
      }
    } catch (err) {
      console.error('Error loading cards:', err);
    }
  };

  // Checkout - open payment modal
  const handleCheckout = async () => {
    console.log('=== handleCheckout called ===');
    console.log('cartItems.length:', cartItems.length);
    
    if (cartItems.length === 0) return;
    
    setPendingOrderItems(cartItems);
    await loadSavedCardsFromApi();
    setShowPaymentMethodModal(true);
  };

  // Create order — Swagger: POST /orders/products/create
  const createOrderAndProceed = async (cardId: number) => {
    if (pendingOrderItems.length === 0 || !isAuthenticated) return;
    if (!cardId || cardId === 0) throw new Error('Выберите карту для оплаты');

    try {
      const { ordersApi } = await import('../api/orders');

      // Parse date from first item (assuming all items have same date)
      const dateStr = pendingOrderItems[0]?.date || new Date().toISOString().split('T')[0];
      const [day, month, year] = dateStr.split('.');
      const startDate = year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : dateStr;
      const endDate = startDate; // Assuming single day orders for now

      // Map cart items to order products using real productId from API
      const orderProducts: OrderProduct[] = pendingOrderItems.map(item => {
        // Use real productId from CartItem (now stored when adding to cart)
        const productId = item.productId || 0;
        
        if (productId === 0) {
          console.warn('[CreateOrder] Cart item missing productId:', item);
        }
        
        return {
          productId: productId,
          quantity: item.quantity,
        };
      });

      // Use real categoryId from first item (all items in order should have same categoryId)
      const categoryId = pendingOrderItems[0]?.categoryId || 0;
      
      if (categoryId === 0) {
        console.error('[CreateOrder] No categoryId found in cart items');
        throw new Error('Не удалось определить категорию заказа');
      }

      const apiOrder: ApiOrder = {
        cardId,
        categoryId,
        startDate,
        endDate,
        products: orderProducts,
      };

      const response = await ordersApi.createOrder(apiOrder);
      
      if (response.success) {
        setCartItems([]);
        setPendingOrderItems([]);
        setShowPaymentMethodModal(false);
        // По Swagger: после создания заказа API даёт ссылку на оплату (orderURL в GET /payments/all)
        // Оплата создаётся асинхронно — опрашиваем API до появления orderURL
        setPaymentUrlLoading(true);
        const { paymentsApi } = await import('../api/payments');
        const pollInterval = 2000;
        const maxAttempts = 20; // ~40 сек
        let attempts = 0;
        const pollForPaymentUrl = async (): Promise<string | null> => {
          const payResponse = await paymentsApi.getAllPayments();
          if (payResponse.success && payResponse.data && typeof payResponse.data === 'object') {
            const userPayments = (payResponse.data as any).userPayments;
            if (Array.isArray(userPayments) && userPayments.length > 0) {
              const first = userPayments[0];
              const url = first.orderURL ?? first.orderUrl ?? first.order_url;
              if (url && typeof url === 'string' && url.startsWith('http')) {
                return url;
              }
            }
          }
          return null;
        };
        let url: string | null = null;
        while (attempts < maxAttempts) {
          url = await pollForPaymentUrl();
          if (url) break;
          await new Promise(r => setTimeout(r, pollInterval));
          attempts++;
        }
        setPaymentUrlLoading(false);
        if (url) {
          setPaymentSource('products');
          setPaymentUrl(url);
          setShowPaymentWebView(true);
        } else {
          setCurrentPage('profile');
          setShowPurchaseHistory(true);
          try {
            const payResponse = await paymentsApi.getAllPayments();
            if (payResponse.success && payResponse.data && typeof payResponse.data === 'object') {
              const userPayments = (payResponse.data as any).userPayments;
              if (Array.isArray(userPayments)) {
                const mapped = userPayments.map((p: any) => {
                  const total = p.totalPrice ?? p.totalAmount ?? 0;
                  const statusMap: Record<string, Order['status']> = {
                    payment_paid: 'paid', payment_failed: 'cancelled', payment_pending: 'pending',
                    paid: 'paid', cancelled: 'cancelled', canceled: 'cancelled',
                  };
                  const rawId = p.orderId || p.id || `order-${Date.now()}`;
                  return {
                    id: rawId,
                    orderNumber: formatTicketNumber(rawId),
                    items: [{ id: '1', name: p.orderType || 'Услуга', categoryName: 'Услуга', price: total, quantity: 1, date: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '', image: '', description: '' }],
                    total: Number(total),
                    status: statusMap[p.status] ?? 'pending',
                    createdAt: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                  };
                });
                setOrders(mapped);
              }
            }
          } catch (e) {
            console.error('Reload payments:', e);
          }
        }
      } else {
        alert('Ошибка создания заказа: ' + (response.message || 'Неизвестная ошибка'));
      }
    } catch (error: any) {
      setPaymentUrlLoading(false);
      console.error('Error creating order:', error);
      alert('Ошибка создания заказа: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  // Handle payment modal close (user cancelled) — по Swagger: только закрыть, без моков
  const handlePaymentModalClose = () => {
    setPendingOrderItems([]);
    setShowPaymentMethodModal(false);
  };

  // Hotel booking via backend-api — логика как Safeddara API: POST → poll payments → WebView
  const createHotelBookingAndPay = async (cardId: number) => {
    const data = currentBooking;
    if (!data || !isAuthenticated) return;
    if (!data.guestName || !data.guestEmail) throw new Error('Укажите имя и email гостя');

    const { backendApi } = await import('../api/backendApi');
    const res = await backendApi.createBooking({
      accommodationId: data.room.id,
      checkIn: data.checkIn.toISOString().split('T')[0],
      checkOut: data.checkOut.toISOString().split('T')[0],
      guests: data.guests,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      cardId,
    });

    if (!res.success || !res.data) {
      throw new Error((res as any).message || 'Ошибка бронирования');
    }

    let orderURL = res.data.orderURL ?? res.data.orderUrl ?? res.data.order_url;
    const bookingId = res.data.booking?.id;

    // Как Safeddara API: если orderURL нет в ответе — опрашиваем GET /payments/all
    if (!orderURL || !orderURL.startsWith('http')) {
      setPaymentUrlLoading(true);
      try {
        const pollInterval = 2000;
        const maxAttempts = 20; // ~40 сек
        let attempts = 0;
        const pollForPaymentUrl = async (): Promise<string | null> => {
          const payRes = await backendApi.getAllPayments();
          if (payRes.success && payRes.data?.userPayments && Array.isArray(payRes.data.userPayments)) {
            const match =
              payRes.data.userPayments.find(
                (p: any) =>
                  (p.orderId === bookingId || p.orderId === (res.data?.booking as any)?.id) &&
                  (p.orderURL || p.orderUrl)
              ) || payRes.data.userPayments.find((p: any) => (p.orderURL || p.orderUrl)?.startsWith('http'));
            const url = match?.orderURL ?? match?.orderUrl;
            if (url && typeof url === 'string' && url.startsWith('http')) return url;
          }
          return null;
        };
        while (attempts < maxAttempts) {
          orderURL = await pollForPaymentUrl();
          if (orderURL) break;
          await new Promise((r) => setTimeout(r, pollInterval));
          attempts++;
        }
        if (!orderURL) {
          console.error('[createHotelBookingAndPay] No orderURL after polling', res.data);
          throw new Error(
            (res.data as any)?.message ||
              'Не удалось создать ссылку на оплату. Попробуйте другую карту или повторите позже.'
          );
        }
      } finally {
        setPaymentUrlLoading(false);
      }
    }

    const newBooking: Booking = {
      id: bookingId || `booking-${Date.now()}`,
      roomName: data.room.name,
      roomImage: data.room.image,
      checkIn: data.checkIn.toISOString().split('T')[0],
      checkOut: data.checkOut.toISOString().split('T')[0],
      guests: data.guests,
      nights: data.nights,
      totalPrice: data.totalPrice,
      status: 'pending',
      bookingDate: new Date().toISOString().split('T')[0],
    };
    setBookings((prev) => [newBooking, ...prev]);

    setShowHotelBookingConfirm(false);
    setShowPaymentMethodModal(false);
    setShowHotels(false);
    setCurrentBooking(null);
    setSelectedRoom(null);

    setPaymentSource('hotel');
    setPaymentUrl(orderURL);
    setShowPaymentWebView(true);
  };

  // Open payment modal for hotel (select card → createHotelBookingAndPay)
  const handleHotelConfirmPayment = async () => {
    if (!isAuthenticated) {
      setLoginFromMainApp(true);
      setShowLogin(true);
      return;
    }
    await loadSavedCardsFromApi();
    setShowPaymentMethodModal(true);
  };

  // Show registration if not completed (intro removed)
  // Show login page if requested
  if (showLogin) {
    return (
      <LoginPage
        message={currentBooking ? 'Войдите, чтобы продолжить оплату бронирования' : undefined}
        onBack={() => {
          setShowLogin(false);
          if (!loginFromMainApp) setShowRegistration(true);
          setLoginFromMainApp(false);
        }}
        onSuccess={() => {
          setShowLogin(false);
          setShowRegistration(false);
          setLoginFromMainApp(false);
        }}
      />
    );
  }

  // Show registration flow if not registered
  if (showRegistration) {
    return (
      <RegistrationFlow
        onComplete={() => {
          setShowRegistration(false);
        }}
        onSwitchToLogin={() => {
          setShowRegistration(false);
          setLoginFromMainApp(false);
          setShowLogin(true);
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
        favoritesCount={favoriteHotels.length + favoriteRestaurantItems.length}
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
        {/* Loading: ожидание ссылки на оплату от API */}
        {paymentUrlLoading && (
          <div className="fixed inset-0 z-50 bg-white/95 flex flex-col items-center justify-center">
            <div className="animate-spin w-10 h-10 border-2 border-[#71bcf0] border-t-transparent rounded-full" />
            <p className="mt-4 text-gray-600 font-medium">Ожидание ссылки на оплату...</p>
          </div>
        )}
        {/* Payment WebView — ссылка на оплату из API (orderURL) */}
        {showPaymentWebView && paymentUrl && (
          <PaymentWebViewPage
            paymentUrl={paymentUrl}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
            onBack={async () => {
              setShowPaymentWebView(false);
              setPaymentUrl(null);
              setCurrentPage('profile');
              if (paymentSource === 'hotel') {
                setShowMyBookings(true);
              } else {
                setShowPurchaseHistory(true);
              }
              try {
                const { paymentsApi } = await import('../api/payments');
                const payResponse = await paymentsApi.getAllPayments();
                if (payResponse.success && payResponse.data && typeof payResponse.data === 'object') {
                  const userPayments = (payResponse.data as any).userPayments;
                  if (Array.isArray(userPayments)) {
                    const mapped = userPayments.map((p: any) => {
                      const rawId = p.orderId || p.id || `order-${Date.now()}`;
                      return {
                        id: rawId,
                        orderNumber: formatTicketNumber(rawId),
                        items: [{ id: '1', name: p.orderType || 'Услуга', categoryName: 'Услуга', price: p.totalPrice ?? p.totalAmount ?? 0, quantity: 1, date: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '', image: '', description: '' }],
                        total: p.totalPrice ?? p.totalAmount ?? 0,
                        status: (p.status === 'payment_paid' || p.status === 'paid') ? 'paid' : p.status === 'canceled' ? 'cancelled' : 'pending',
                        createdAt: p.date ? new Date(p.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                      };
                    });
                    setOrders(mapped);
                  }
                }
              } catch (e) {
                console.error('Reload payments:', e);
              }
            }}
          />
        )}

        {showPaymentMethodModal && (
          <PaymentMethodModal
            isOpen={showPaymentMethodModal}
            onClose={handlePaymentModalClose}
            savedCards={savedCards}
            onCreateOrder={async (cardId: number) => {
              try {
                if (currentBooking) {
                  await createHotelBookingAndPay(cardId);
                } else {
                  await createOrderAndProceed(cardId);
                }
              } catch (e: any) {
                const msg = e?.message || 'Ошибка оплаты';
                if (msg.includes('Сессия истекла') || msg.includes('авторизац')) {
                  setShowPaymentMethodModal(false);
                  // НЕ сбрасываем showHotelBookingConfirm и currentBooking — после входа вернёмся к оплате
                  setLoginFromMainApp(true);
                  setShowLogin(true);
                  return;
                }
                throw e;
              }
            }}
            onAddCard={() => {
              setShowPaymentMethodModal(false);
              setAddCardFromPaymentModal(true);
              setShowAddCard(true);
            }}
          />
        )}

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
                onConfirmBooking={handleHotelConfirmPayment}
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
                onConfirmBooking={handleHotelConfirmPayment}
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
              setRestaurantInitialCategory(undefined);
            }}
            onWeatherClick={() => setShowWeather(true)}
            onLiveClick={() => setShowCameras(true)}
            initialCategory={restaurantInitialCategory}
            favoriteIds={favoriteRestaurantItems.map((f) => f.id)}
            onToggleFavorite={handleToggleRestaurantFavorite}
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
            onRefresh={loadBookings}
            isLoading={bookingsLoading}
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
                isLoading={paymentsLoading}
                onRefresh={loadPayments}
                onBack={() => {
                  setShowPurchaseHistory(false);
                  setCurrentPage('profile');
                }}
                onPayOrder={undefined}
              />
            </div>

            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebPurchaseHistoryPage
                orders={orders}
                isLoading={paymentsLoading}
                onRefresh={loadPayments}
                onBack={() => {
                  setShowPurchaseHistory(false);
                  setCurrentPage('profile');
                }}
                onPayOrder={undefined}
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
              if (addCardFromPaymentModal) {
                setAddCardFromPaymentModal(false);
                setShowPaymentMethodModal(true);
              } else {
                setShowPaymentMethods(true);
              }
            }}
            onAddCard={handleAddCard}
            savedCards={savedCards}
            onNeedLogin={() => {
              setShowAddCard(false);
              setShowPaymentMethods(false);
              setAddCardFromPaymentModal(false);
              setLoginFromMainApp(true);
              setShowLogin(true);
            }}
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
                favorites={[
                  ...favoriteHotelData.map((h) => ({ type: 'hotel' as const, id: h.id, title: h.title, capacity: h.capacity, price: h.price, images: h.images })),
                  ...favoriteRestaurantItems.map((r) => ({ type: 'restaurant' as const, id: r.id, title: r.name, price: r.price, images: [r.image], category: r.category })),
                ]}
                onBack={() => {
                  setShowFavorites(false);
                  setCurrentPage('profile');
                }}
                onItemClick={handleFavoriteItemClick}
                onRemoveFavorite={(itemId, itemType) => {
                  if (itemType === 'hotel') {
                    setFavoriteHotels((prev) => prev.filter((id) => id !== itemId));
                    setFavoriteHotelData((prev) => prev.filter((h) => h.id !== itemId));
                  } else {
                    setFavoriteRestaurantItems((prev) => prev.filter((f) => f.id !== itemId));
                  }
                }}
              />
            </div>

            {/* Desktop Version */}
            <div className="hidden lg:block">
              <WebFavoritesPage
                favorites={[
                  ...favoriteHotelData.map((h) => ({ type: 'hotel' as const, id: h.id, title: h.title, capacity: String(h.capacity), price: h.price, images: h.images })),
                  ...favoriteRestaurantItems.map((r) => ({ type: 'restaurant' as const, id: r.id, title: r.name, price: r.price, images: [r.image], category: r.category })),
                ]}
                onBack={() => {
                  setShowFavorites(false);
                  setCurrentPage('profile');
                }}
                onItemClick={handleFavoriteItemClick}
                onRemoveFavorite={(itemId) => {
                  if (favoriteHotelData.some((h) => h.id === itemId)) {
                    setFavoriteHotels((prev) => prev.filter((id) => id !== itemId));
                    setFavoriteHotelData((prev) => prev.filter((h) => h.id !== itemId));
                  } else {
                    setFavoriteRestaurantItems((prev) => prev.filter((f) => f.id !== itemId));
                  }
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
       !showPaymentWebView &&
       !paymentUrlLoading &&
       !showRegistration && (
        <ModernBottomNav
          activeTab={currentPage}
          onTabChange={(tab) => {
            closeAllModals();
            setCurrentPage(tab);
            if (tab === 'tariffs') {
              setTariffsInitialCategory(undefined);
              setTariffsInitialTariffId(undefined);
            }
          }}
        />
      )}
    </>
  );
}

export default function App() {
  // Страница возврата после оплаты Commerzbank (в iframe)
  if (typeof window !== 'undefined' && window.location.pathname === '/payment-return') {
    return <PaymentReturnPage />;
  }

  // Check URL for admin panel access - /admin or /admin-mobile (deployed at safeddara.tj/admin-mobile)
  const [isAdminPanel, setIsAdminPanel] = useState(() => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname;
    return p === '/admin' || p.startsWith('/admin/') || p === '/admin-mobile' || p === '/admin-mobile/' || p.startsWith('/admin-mobile/');
  });
  
  // Listen for URL changes (both pathname and hash changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkAdminRoute = () => {
      const p = window.location.pathname;
      const isAdmin = p === '/admin' || p.startsWith('/admin/') || p === '/admin-mobile' || p === '/admin-mobile/' || p.startsWith('/admin-mobile/');
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ScrollPositionProvider>
    </LanguageProvider>
  );
}