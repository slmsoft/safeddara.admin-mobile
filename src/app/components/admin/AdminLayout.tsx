import { ReactNode, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: 'superadmin' | 'admin' | 'accountant';
  username: string;
  onLogout: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
  headerAction?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  userRole, 
  username,
  onLogout,
  headerTitle,
  headerSubtitle,
  headerAction
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={userRole}
        username={username}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[220px]">
        {/* Header */}
        <AdminHeader
          username={username}
          userRole={userRole}
          onLogout={onLogout}
          title={headerTitle}
          subtitle={headerSubtitle}
          actionButton={headerAction}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}