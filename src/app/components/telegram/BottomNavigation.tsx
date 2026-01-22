import { motion } from 'motion/react';
import { User, Phone, MessageCircle, Settings } from 'lucide-react';

type TabType = 'contacts' | 'calls' | 'chats' | 'settings';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  badges?: {
    contacts?: number;
    calls?: number;
    chats?: number;
    settings?: number;
  };
}

export function BottomNavigation({ activeTab, onTabChange, badges = {} }: BottomNavigationProps) {
  const tabs = [
    { id: 'contacts' as TabType, icon: User, label: 'Контакты' },
    { id: 'calls' as TabType, icon: Phone, label: 'Звонки' },
    { id: 'chats' as TabType, icon: MessageCircle, label: 'Чаты' },
    { id: 'settings' as TabType, icon: Settings, label: 'Настройки' },
  ];

  const formatBadge = (count: number) => {
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(32px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="grid grid-cols-4 h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = badges[tab.id];

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center gap-1 transition-colors duration-200"
            >
              {/* Active Tab Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-[1px] w-12 h-0.5 bg-white rounded-full"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}

              {/* Icon Container */}
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/50'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {/* Badge */}
                {badge && badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full"
                    style={{
                      background: 'linear-gradient(to bottom right, #ef4444, #dc2626)',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {formatBadge(badge)}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/50'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
