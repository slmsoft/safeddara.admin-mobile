import { useState, useEffect } from 'react';
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
import { AdminsManagement } from './AdminsManagement';
import { getAdminToken, clearAdminToken, adminMe } from '../../../api/adminAuth';

type UserRole = 'superadmin' | 'admin' | 'accountant';

interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
}

export function AdminApp() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setAuthChecking(false);
      return;
    }
    adminMe()
      .then((res) => {
        if (res.success && res.data?.admin) {
          const a = res.data.admin;
          setCurrentUser({
            id: a.id,
            username: a.email,
            role: a.role as UserRole,
          });
        } else {
          clearAdminToken();
        }
      })
      .catch(() => {
        clearAdminToken();
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  const handleLogin = (admin: { id: string; email: string; role: string }) => {
    setCurrentUser({
      id: admin.id,
      username: admin.email,
      role: admin.role as UserRole,
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    clearAdminToken();
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard userRole={currentUser.role} />;
      case 'admins':
        return <AdminsManagement />;
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

  const getPageConfig = () => {
    const configs: Record<string, { title?: string; subtitle?: string; action?: { label: string; onClick: () => void } }> = {
      dashboard: {
        title: `Добро пожаловать, ${currentUser.username.split('@')[0]}`,
        subtitle: 'Отслеживайте статистику и управляйте курортом.'
      },
      admins: {
        title: 'Управление',
        subtitle: 'Создание и управление учётными записями администраторов.',
        action: { label: 'Добавить админа', onClick: () => { const h = (window as any).__adminsAddHandler; if (h) h(); } }
      },
      users: {
        title: 'Пользователи',
        subtitle: 'Управление пользователями и их правами доступа.',
        action: { label: 'Добавить пользователя', onClick: () => { const h = (window as any).__usersAddHandler; if (h) h(); } }
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
      events: {
        title: 'События',
        subtitle: 'Управление предстоящими событиями и мероприятиями.',
        action: { label: 'Создать событие', onClick: () => { const h = (window as any).__eventsAddHandler; if (h) h(); } }
      },
      cameras: {
        title: 'Камеры LIVE',
        subtitle: 'Мониторинг и управление видеотрансляциями.',
        action: { label: 'Добавить камеру', onClick: () => { const h = (window as any).__camerasAddHandler; if (h) h(); } }
      },
      orders: { title: 'Заказы', subtitle: 'Просмотр всех заказов услуг и оборудования.' },
      feedback: { title: 'Отзывы', subtitle: 'Обратная связь от гостей курорта.' },
      rules: {
        title: 'Правила FIS',
        subtitle: 'Управление правилами безопасности на склонах.',
        action: { label: 'Добавить правило', onClick: () => { const h = (window as any).__rulesAddHandler; if (h) h(); } }
      },
      about: { title: 'О Сафеддаре', subtitle: 'Информация о курорте и его истории.' },
      settings: { title: 'Настройки', subtitle: 'Системные настройки и конфигурация.' }
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
