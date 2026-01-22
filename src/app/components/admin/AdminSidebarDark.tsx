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
  Bell,
  Camera,
  FileText,
  Info,
  Settings,
  DollarSign,
  UserCog
} from 'lucide-react';
import Logo2 from '../../../imports/Logo2';

interface AdminSidebarDarkProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: 'superadmin' | 'admin' | 'accountant';
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
    icon: UserCog, 
    roles: ['superadmin', 'admin']
  },
  { 
    id: 'hotels', 
    label: 'Номеров', 
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
    label: 'Обратная связь', 
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

export function AdminSidebarDark({ currentPage, onNavigate, userRole }: AdminSidebarDarkProps) {
  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  const getRoleInfo = () => {
    if (userRole === 'superadmin') return { 
      label: 'Суперадмин', 
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30'
    };
    if (userRole === 'admin') return { 
      label: 'Администратор', 
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30'
    };
    return { 
      label: 'Бухгалтер', 
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-300',
      borderColor: 'border-green-500/30'
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <aside className="w-[280px] bg-[#1a1d2e] fixed left-0 top-0 h-screen overflow-y-auto shadow-2xl border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <Logo2 />
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className={`${roleInfo.bgColor} ${roleInfo.borderColor} border rounded-lg px-4 py-2.5`}>
          <p className={`text-center font-bold text-xs ${roleInfo.textColor}`}>
            {roleInfo.label}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1 pb-24">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-[#71bcf0] text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-[#1a1d2e]">
        <p className="text-xs text-gray-500 text-center">
          © 2026 Safedara Resort
        </p>
        <p className="text-xs text-gray-600 text-center mt-1">
          Admin Panel v1.0
        </p>
      </div>
    </aside>
  );
}
