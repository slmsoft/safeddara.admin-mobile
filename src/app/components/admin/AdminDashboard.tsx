import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Users, Calendar, MoreVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../../../api/backendApi';

interface AdminDashboardProps {
  userRole: 'superadmin' | 'admin' | 'accountant';
}

function formatRevenue(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatTimeAgo(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (sec < 60) return 'только что';
    if (sec < 3600) return `${Math.floor(sec / 60)} мин назад`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} ч назад`;
    if (sec < 604800) return `${Math.floor(sec / 86400)} дн назад`;
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [stats, setStats] = useState<{
    pageviews: number;
    monthlyUsers: number;
    newSignups: number;
    bookingsCount: number;
    totalRevenue: number;
    recentActivity: Array<{ type: string; user: string; action: string; time: string }>;
    revenueData?: Array<{ month: string; revenue: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .stats()
      .then((res) => {
        if (res.success && res.data) setStats(res.data);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const revenueData = stats?.revenueData || [];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <p className="text-red-400">Ошибка загрузки: {error}</p>
      </div>
    );
  }

  const s = stats || {
    pageviews: 0,
    monthlyUsers: 0,
    newSignups: 0,
    bookingsCount: 0,
    totalRevenue: 0,
    recentActivity: [],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Просмотры</span>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-200">{formatRevenue(s.pageviews)}</h3>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Месячные пользователи</span>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-200">{s.monthlyUsers.toLocaleString('ru-RU')}</h3>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Новые регистрации</span>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-200">{s.newSignups.toLocaleString('ru-RU')}</h3>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Бронирования / заказы</span>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-200">{s.bookingsCount.toLocaleString('ru-RU')}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-1">Общий доход</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-200">{s.totalRevenue.toLocaleString('ru-RU')} смн</span>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
              </span>
            </div>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #1e2537',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">Нет данных за год</div>
          )}
          <div className="text-sm text-gray-400 text-center mt-4">Доход по месяцам (текущий год)</div>
        </div>

        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Последняя активность</h3>
          <div className="space-y-4">
            {s.recentActivity.length > 0 ? (
              s.recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 font-medium">{a.user}</p>
                    <p className="text-xs text-gray-400">{a.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(a.time)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Нет недавней активности</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}