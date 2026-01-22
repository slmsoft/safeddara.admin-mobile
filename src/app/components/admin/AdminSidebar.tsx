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
  User
} from 'lucide-react';
import { useState } from 'react';
import Logo2 from '../../../imports/Logo2';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: 'superadmin' | 'admin' | 'accountant';
  username: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: ('superadmin' | 'admin' | 'accountant')[];
}

const menuItems: MenuItem[] = [
  { 
    id: 'dashboard', 
    label: 'Главная', 
    icon: LayoutDashboard, 
    roles: ['superadmin', 'admin', 'accountant']
  },
  { 
    id: 'users', 
    label: 'Пользователи', 
    icon: Users, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'hotels', 
    label: 'Гостиницы', 
    icon: Hotel, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'bookings', 
    label: 'Бронирования', 
    icon: Calendar, 
    roles: ['superadmin', 'admin', 'accountant']
  },
  { 
    id: 'services', 
    label: 'Услуги', 
    icon: Briefcase, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'restaurant', 
    label: 'Ресторан', 
    icon: UtensilsCrossed, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'news', 
    label: 'Новости', 
    icon: Newspaper, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'events', 
    label: 'События', 
    icon: CalendarDays, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'orders', 
    label: 'Заказы', 
    icon: ShoppingCart, 
    roles: ['superadmin', 'admin', 'accountant']
  },
  { 
    id: 'transactions', 
    label: 'Транзакции', 
    icon: CreditCard, 
    roles: ['superadmin', 'accountant']
  },
  { 
    id: 'feedback', 
    label: 'Отзывы', 
    icon: MessageSquare, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'cameras', 
    label: 'Камеры LIVE', 
    icon: Camera, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'rules', 
    label: 'Правила FIS', 
    icon: FileText, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'about', 
    label: 'О Сафеддаре', 
    icon: Info, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'settings', 
    label: 'Настройки', 
    icon: Settings, 
    roles: ['superadmin']
  }
];

export function AdminSidebar({ currentPage, onNavigate, userRole, username }: AdminSidebarProps) {
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
    <aside className="w-[220px] bg-[#0d1117] fixed left-0 top-0 h-screen flex flex-col border-r border-[#1e2537]">
      {/* Logo */}
      <div className="p-6 border-b border-[#1e2537]">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16">
            <Logo2 />
          </div>
        </div>
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
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
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

      {/* User Profile */}
      <div className="p-4 border-t border-[#2a2f4a]">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-[#2a2f4a] rounded-lg p-2 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{username}</p>
            <p className={`text-xs ${roleInfo.color} truncate`}>{roleInfo.label}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </aside>
  );
}