import { motion } from 'motion/react';

type NavItem = 'home' | 'about' | 'tariffs' | 'news' | 'services' | 'menu';

interface WebNavigationProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export function WebNavigation({ activeTab, onTabChange }: WebNavigationProps) {
  const navItems = [
    { id: 'about' as NavItem, label: 'О сафеддаре' },
    { id: 'tariffs' as NavItem, label: 'Тарифы' },
    { id: 'news' as NavItem, label: 'Новости' },
    { id: 'services' as NavItem, label: 'Услуги' },
  ];

  return (
    <nav className="hidden lg:block bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                whileHover={{ y: -2 }}
                className={`relative py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#2d3e50]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d3e50]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}