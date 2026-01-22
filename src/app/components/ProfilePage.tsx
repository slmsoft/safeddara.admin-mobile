import { useState } from 'react';
import { User, Clock, Heart, Info, FileCheck, ChevronRight, Ticket, CreditCard, LogOut } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface ProfilePageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onMyBookingsClick?: () => void;
  onPurchaseHistoryClick?: () => void;
  onPaymentMethodsClick?: () => void;
  onAddCardClick?: () => void;
  onFeedbackClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onFavoritesClick?: () => void;
  onInsuranceClick?: () => void;
  onAboutClick?: () => void;
  onRulesClick?: () => void;
  onMyTicketsClick?: () => void;
  onLogout?: () => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: typeof User;
  onClick?: () => void;
  isActive?: boolean;
};

export function ProfilePage({ 
  onWeatherClick, 
  onLiveClick,
  onMyBookingsClick,
  onPurchaseHistoryClick,
  onPaymentMethodsClick,
  onSettingsClick,
  onFavoritesClick,
  onInsuranceClick,
  onAboutClick,
  onRulesClick,
  onMyTicketsClick,
  onLogout
}: ProfilePageProps) {
  const [activeMenuItem, setActiveMenuItem] = useState('profile');

  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'Профиль', icon: User, isActive: true },
    { id: 'tickets', label: 'Мои билеты', icon: Ticket, onClick: onMyTicketsClick },
    { id: 'history', label: 'История покупок', icon: Clock, onClick: onPurchaseHistoryClick },
    { id: 'bookings', label: 'Мои бронирования', icon: FileCheck, onClick: onMyBookingsClick },
    { id: 'payment', label: 'Способы оплаты', icon: CreditCard, onClick: onPaymentMethodsClick },
    { id: 'favorites', label: 'Избранное', icon: Heart, onClick: onFavoritesClick },
    { id: 'about', label: 'О Сафеддаре', icon: Info, onClick: onAboutClick },
    { id: 'rules', label: 'Правила FIS', icon: FileCheck, onClick: onRulesClick },
  ];

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenuItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      
      {/* Desktop container */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Профиль</h1>
        </div>

        {/* Content Grid */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
          {/* Main Content */}
          <div className="space-y-5">
            {/* User Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)'
                  }}
                >
                  <span className="text-3xl font-bold text-white">CW</span>
                </div>
                
                {/* User Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Contact World Contact World</h2>
                  <p className="text-sm text-gray-500">worldcontact68@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="lg:hidden space-y-3 pb-24">
              {menuItems.filter(item => !item.isActive).map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-base font-semibold text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
              
              {/* Logout Button */}
              <button
                onClick={() => onLogout && onLogout()}
                className="w-full bg-white border border-red-200 rounded-2xl p-4 hover:shadow-md transition-all flex items-center justify-between hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-base font-semibold text-red-600">Выйти</span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Sidebar Menu - Desktop Only */}
          <div className="hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-2xl p-3 sticky top-4">
              <nav className="space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = item.id === activeMenuItem;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      {item.label}
                    </button>
                  );
                })}
                
                {/* Logout Button */}
                <button
                  onClick={() => onLogout && onLogout()}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-red-50 text-red-600 mt-2 border-t border-gray-200 pt-2"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  Выйти
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}