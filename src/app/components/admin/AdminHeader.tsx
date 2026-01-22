import { Bell, Search, Download, Menu, Plus } from 'lucide-react';
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
}

export function AdminHeader({ username, userRole, onLogout, title, subtitle, actionButton }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-[#0d1117] border-b border-[#1e2537] flex items-center justify-between px-8">
      {/* Left: Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-200">
          {title || `Добро пожаловать, ${username}`}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            className="w-80 bg-[#161b2e] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Export Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors text-sm">
          <Download className="w-4 h-4" />
          Экспорт
        </button>

        {/* Action Button */}
        {actionButton && (
          <button 
            onClick={actionButton.onClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {actionButton.label}
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}