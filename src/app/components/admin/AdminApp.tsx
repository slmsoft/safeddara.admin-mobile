import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';
import { UsersManagement } from './UsersManagement';
import { HotelsManagement } from './HotelsManagement';
import { BookingsManagement } from './BookingsManagement';
import { ServicesManagement } from './ServicesManagement';
import { RestaurantManagement } from './RestaurantManagement';
import { NewsManagement } from './NewsManagement';
import { EventsManagement } from './EventsManagement';
import { OrdersManagement } from './OrdersManagement';
import { TransactionsManagement } from './TransactionsManagement';
import { FeedbackManagement } from './FeedbackManagement';
import { CamerasManagement } from './CamerasManagement';
import { RulesManagement } from './RulesManagement';
import { AboutManagement } from './AboutManagement';
import { SettingsManagement } from './SettingsManagement';

type UserRole = 'superadmin' | 'admin' | 'accountant';

interface AdminUser {
  username: string;
  role: UserRole;
}

// Mock authentication - в реальном приложении это будет через API
const authenticateUser = (username: string, password: string): AdminUser | null => {
  const users = {
    'admin@safedara.tj': { username: 'admin@safedara.tj', role: 'superadmin' as UserRole },
    'manager@safedara.tj': { username: 'manager@safedara.tj', role: 'admin' as UserRole },
    'accountant@safedara.tj': { username: 'accountant@safedara.tj', role: 'accountant' as UserRole }
  };

  const validPasswords = {
    'admin@safedara.tj': 'admin123',
    'manager@safedara.tj': 'manager123',
    'accountant@safedara.tj': 'accountant123'
  };

  if (validPasswords[username as keyof typeof validPasswords] === password) {
    return users[username as keyof typeof users];
  }

  return null;
};

export function AdminApp() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (username: string, password: string) => {
    console.log('Попытка входа с:', { username, password });
    const user = authenticateUser(username, password);
    console.log('Результат аутентификации:', user);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
      console.log('Вход выполнен успешно! Пользователь:', user);
    } else {
      console.error('Неудачная попытка входа');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard userRole={currentUser.role} />;
      case 'users':
        return <UsersManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'transactions':
        return <TransactionsManagement />;
      case 'hotels':
        return <HotelsManagement />;
      case 'news':
        return <NewsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'events':
        return <EventsManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'restaurant':
        return <RestaurantManagement />;
      case 'cameras':
        return <CamerasManagement />;
      case 'settings':
        return <SettingsManagement />;
      case 'rules':
        return <RulesManagement />;
      case 'about':
        return <AboutManagement />;
      default:
        return <AdminDashboard userRole={currentUser.role} />;
    }
  };

  // Get page title and action button
  const getPageConfig = () => {
    const configs: Record<string, { title?: string; subtitle?: string; action?: { label: string; onClick: () => void } }> = {
      dashboard: {
        title: `Добро пожаловать, ${currentUser.username.split('@')[0]}`,
        subtitle: 'Отслеживайте статистику и управляйте курортом.'
      },
      users: {
        title: 'Пользователи',
        subtitle: 'Управление пользователями и их правами доступа.',
        action: { 
          label: 'Добавить пользователя', 
          onClick: () => {
            const handler = (window as any).__usersAddHandler;
            if (handler) handler();
          }
        }
      },
      hotels: {
        title: 'Гостиницы и номера',
        subtitle: 'Управление размещением и доступностью номеров.',
        action: { 
          label: 'Добавить номер', 
          onClick: () => {
            const handler = (window as any).__hotelsAddHandler;
            if (handler) handler();
          }
        }
      },
      bookings: {
        title: 'Бронирования',
        subtitle: 'Просмотр и управление всеми бронированиями.'
      },
      services: {
        title: 'Услуги',
        subtitle: 'Управление арендой оборудования и дополнительными услугами.',
        action: { 
          label: 'Добавить услугу', 
          onClick: () => {
            const handler = (window as any).__servicesAddHandler;
            if (handler) handler();
          }
        }
      },
      transactions: {
        title: 'Транзакции',
        subtitle: 'Отслеживание всех финансовых транзакций и платежей.'
      },
      news: {
        title: 'Новости',
        subtitle: 'Публикация и управление новостными статьями.',
        action: { 
          label: 'Создать новость', 
          onClick: () => {
            const handler = (window as any).__newsAddHandler;
            if (handler) handler();
          }
        }
      },
      events: {
        title: 'События',
        subtitle: 'Управление предстоящими событиями и мероприятиями.',
        action: { 
          label: 'Создать событие', 
          onClick: () => {
            const handler = (window as any).__eventsAddHandler;
            if (handler) handler();
          }
        }
      },
      cameras: {
        title: 'Камеры LIVE',
        subtitle: 'Мониторинг и управление видеотрансляциями.',
        action: { 
          label: 'Добавить камеру', 
          onClick: () => {
            const handler = (window as any).__camerasAddHandler;
            if (handler) handler();
          }
        }
      },
      restaurant: {
        title: 'Ресторан',
        subtitle: 'Управление меню и заказами ресторана.',
        action: { 
          label: 'Добавить блюдо', 
          onClick: () => {
            const handler = (window as any).__restaurantAddHandler;
            if (handler) handler();
          }
        }
      },
      orders: {
        title: 'Заказы',
        subtitle: 'Просмотр всех заказов услуг и оборудования.'
      },
      feedback: {
        title: 'Отзывы',
        subtitle: 'Обратная связь от гостей курорта.'
      },
      rules: {
        title: 'Правила FIS',
        subtitle: 'Управление правилами безопасности на склонах.',
        action: { 
          label: 'Добавить правило', 
          onClick: () => {
            const handler = (window as any).__rulesAddHandler;
            if (handler) handler();
          }
        }
      },
      about: {
        title: 'О Сафеддаре',
        subtitle: 'Информация о курорте и его истории.'
      },
      settings: {
        title: 'Настройки',
        subtitle: 'Системные настройки и конфигурация.'
      }
    };
    return configs[currentPage] || {};
  };

  const pageConfig = getPageConfig();

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      userRole={currentUser.role}
      username={currentUser.username}
      onLogout={handleLogout}
      headerTitle={pageConfig.title}
      headerSubtitle={pageConfig.subtitle}
      headerAction={pageConfig.action}
    >
      {renderPageContent()}
    </AdminLayout>
  );
}