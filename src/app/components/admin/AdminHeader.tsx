import { Bell, Search, Download, Menu, Plus, LogOut } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  username: string;
  userRole: 'superadmin' | 'admin' | 'accountant';
  onLogout: () => void;
  title?: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  onMenuClick?: () => void;
}

export function AdminHeader({ username, userRole, onLogout, title, subtitle, actionButton, onMenuClick }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 md:h-20 bg-[#0d1117] border-b border-[#1e2537] flex items-center justify-between px-4 md:px-8 gap-2">
      {/* Left: Menu button (mobile) + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -m-2 text-gray-400 hover:text-white rounded-lg flex-shrink-0"
            aria-label="Открыть меню"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-200 truncate">
          {title || `Добро пожаловать, ${username}`}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1 truncate hidden sm:block">{subtitle}</p>
        )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            className="w-80 bg-[#161b2e] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Export Button - hidden on mobile */}
        <button className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors text-sm">
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Экспорт</span>
        </button>

        {/* Action Button */}
        {actionButton && (
          <button 
            onClick={actionButton.onClick}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline truncate max-w-[100px] md:max-w-none">{actionButton.label}</span>
          </button>
        )}

        {/* Notifications - icon only on mobile */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 md:p-2.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    </header>
  );
}