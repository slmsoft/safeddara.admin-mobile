import { ReactNode } from 'react';
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
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        userRole={userRole}
        username={username}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[220px]">
        {/* Header */}
        <AdminHeader
          username={username}
          userRole={userRole}
          onLogout={onLogout}
          title={headerTitle}
          subtitle={headerSubtitle}
          actionButton={headerAction}
        />

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}