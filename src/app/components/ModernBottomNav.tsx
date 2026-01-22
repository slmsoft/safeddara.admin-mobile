import { motion } from 'motion/react';
import { ServicesIcon } from './icons/ServicesIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CartIcon } from './icons/CartIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { HomeIcon } from './icons/HomeIcon';

type NavItem = 'home' | 'menu' | 'tariffs' | 'cart' | 'profile';

interface ModernBottomNavProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export function ModernBottomNav({ activeTab, onTabChange }: ModernBottomNavProps) {
  const navItems = [
    { id: 'home' as NavItem, icon: HomeIcon, label: 'Главная' },
    { id: 'tariffs' as NavItem, icon: ServicesIcon, label: 'Услуги' },
    { id: 'menu' as NavItem, icon: MenuIcon, label: 'Меню' },
    { id: 'cart' as NavItem, icon: CartIcon, label: 'Корзина' },
    { id: 'profile' as NavItem, icon: ProfileIcon, label: 'Профиль' },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        backdropFilter: 'blur(32px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="grid grid-cols-5 h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange && onTabChange(item.id)}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center gap-1 transition-colors duration-200"
              type="button"
            >
              {/* Icon Container */}
              <div className="w-6 h-6 flex items-center justify-center">
                <Icon
                  className={`w-6 h-6 transition-colors duration-200`}
                  style={{
                    stroke: isActive ? '#000000' : '#9ca3af',
                    strokeWidth: isActive ? 2 : 1.8,
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] transition-colors duration-200 ${
                  isActive ? 'text-black font-medium' : 'text-gray-400 font-normal'
                }`}
                style={{ 
                  fontFamily: 'Geologica, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}