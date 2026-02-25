import { 
  LayoutDashboard, 
  Users, 
  Hotel, 
  Calendar, 
  Briefcase, 
  UtensilsCrossed,
  Newspaper,
  CalendarDays,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Camera,
  FileText,
  Info,
  Settings,
  ChevronRight,
  User,
  Shield,
  LogOut,
  X
} from 'lucide-react';
import { useState } from 'react';
import { SafeddaraLogo } from '../registration/SafeddaraLogo';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: 'superadmin' | 'admin' | 'accountant';
  username: string;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: ('superadmin' | 'admin' | 'accountant')[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Главная', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'accountant'] },
  { id: 'admins', label: 'Управление', icon: Shield, roles: ['superadmin'] },
  { id: 'users', label: 'Пользователи', icon: Users, roles: ['superadmin', 'admin'] },
  { id: 'hotels', label: 'Гостиницы', icon: Hotel, roles: ['superadmin', 'admin'] },
  { id: 'bookings', label: 'Бронирования', icon: Calendar, roles: ['superadmin', 'admin', 'accountant'] },
  { id: 'services', label: 'Услуги', icon: Briefcase, roles: ['superadmin', 'admin'] },
  { id: 'restaurant', label: 'Ресторан', icon: UtensilsCrossed, roles: ['superadmin', 'admin'] },
  { id: 'news', label: 'Новости', icon: Newspaper, roles: ['superadmin', 'admin'] },
  { id: 'events', label: 'События', icon: CalendarDays, roles: ['superadmin', 'admin'] },
  { id: 'orders', label: 'Заказы', icon: ShoppingCart, roles: ['superadmin', 'admin', 'accountant'] },
  { id: 'transactions', label: 'Транзакции', icon: CreditCard, roles: ['superadmin', 'accountant'] },
  { id: 'feedback', label: 'Отзывы', icon: MessageSquare, roles: ['superadmin', 'admin'] },
  { id: 'cameras', label: 'Камеры LIVE', icon: Camera, roles: ['superadmin', 'admin'] },
  { id: 'rules', label: 'Правила FIS', icon: FileText, roles: ['superadmin', 'admin'] },
  { id: 'about', label: 'О Сафеддаре', icon: Info, roles: ['superadmin', 'admin'] },
  { id: 'settings', label: 'Настройки', icon: Settings, roles: ['superadmin'] }
];

export function AdminSidebar({ currentPage, onNavigate, userRole, username, onLogout, isOpen = false, onClose }: AdminSidebarProps) {
  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  const getRoleInfo = () => {
    if (userRole === 'superadmin') return { 
      label: 'Суперадмин',
      color: 'text-purple-400'
    };
    if (userRole === 'admin') return { 
      label: 'Администратор',
      color: 'text-blue-400'
    };
    return { 
      label: 'Бухгалтер',
      color: 'text-green-400'
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`w-[220px] max-w-[85vw] bg-[#0d1117] fixed left-0 top-0 h-screen flex flex-col border-r border-[#1e2537] z-50 transition-transform duration-300 ease-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
      {/* Logo + close on mobile */}
      <div className="p-6 border-b border-[#1e2537] flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <div className="w-20 h-20">
            <SafeddaraLogo />
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 -m-2 text-gray-400 hover:text-white rounded-lg"
            aria-label="Закрыть меню"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm ${
                isActive
                  ? 'bg-[#6366f1] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2f4a]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-[#2a2f4a] space-y-2">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{username}</p>
            <p className={`text-xs ${roleInfo.color} truncate`}>{roleInfo.label}</p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Выйти</span>
          </button>
        )}
      </div>
    </aside>
    </>
  );
}