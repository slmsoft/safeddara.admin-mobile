import { useState, useEffect, useCallback } from 'react';
import { Search, CreditCard, TrendingUp, Download, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { adminApi } from '../../../api/backendApi';

interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  referenceType: string;
  referenceId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  source?: 'hotel' | 'safeddara';
}

function normalizeStatus(s: string): string {
  if (s === 'payment_paid') return 'paid';
  if (s === 'payment_pending' || s === 'payment_created') return 'pending';
  if (s === 'payment_failed') return 'failed';
  return s;
}

function getServiceLabel(refType: string, source?: string): string {
  if (refType === 'hotel_booking' || source === 'hotel') return 'Отель';
  if (refType === 'ski_order' || source === 'safeddara') return 'Ски-услуги';
  if (refType?.toLowerCase().includes('restaurant')) return 'Ресторан';
  return refType || 'Прочее';
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function TransactionsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const merged: Payment[] = [];
      const [backendRes, safeddaraRes] = await Promise.all([
        adminApi.payments.list(),
        adminApi.safeddara.payments().catch(() => ({ success: false, data: { payments: [] } })),
      ]);
      if (backendRes.success && backendRes.data?.payments) {
        merged.push(...backendRes.data.payments.map((p: any) => ({
          id: p.id,
          userId: p.userId,
          bookingId: p.bookingId,
          referenceType: p.referenceType || 'hotel_booking',
          referenceId: p.referenceId,
          amount: p.amount || 0,
          currency: p.currency || 'TJS',
          status: p.status || 'pending',
          createdAt: p.createdAt,
          source: 'hotel' as const,
        })));
      }
      if (safeddaraRes.success && safeddaraRes.data?.payments) {
        merged.push(...safeddaraRes.data.payments.map((p: any) => ({
          id: `safeddara-${p.id}`,
          userId: p.userId,
          referenceType: 'ski_order',
          referenceId: p.orderId,
          amount: p.totalAmount || 0,
          currency: 'TJS',
          status: normalizeStatus(p.status || 'pending'),
          createdAt: p.createdAt,
          source: 'safeddara' as const,
        })));
      }
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPayments(merged);
    } catch (e) {
      console.error('Load payments:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const filteredPayments = payments.filter(p => {
    const matchSearch = p.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const serviceLabel = getServiceLabel(p.referenceType, p.source);
    const matchService = selectedService === 'all' || serviceLabel === selectedService;
    return matchSearch && matchStatus && matchService;
  });

  const totalAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const paidCount = payments.filter(p => p.status === 'paid').length;

  const serviceTotals = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => {
      const label = getServiceLabel(p.referenceType, p.source);
      acc[label] = (acc[label] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieByService = Object.entries(serviceTotals).map(([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] }));

  const monthlyData = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => {
      try {
        const d = new Date(p.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + p.amount;
        return acc;
      } catch { return acc; }
    }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([name, value]) => ({ name: name.replace('-', ' '), value }));

  const dailyData = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => {
      try {
        const d = new Date(p.createdAt);
        const key = d.toLocaleDateString('ru-RU', { weekday: 'short' });
        acc[key] = (acc[key] || 0) + p.amount;
        return acc;
      } catch { return acc; }
    }, {} as Record<string, number>);

  const pieByDay = Object.entries(dailyData)
    .map(([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const uniqueServices = Array.from(new Set(payments.map(p => getServiceLabel(p.referenceType, p.source)))).sort();

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      paid: { label: 'Оплачено', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Ожидание', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      failed: { label: 'Ошибка', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  const exportToExcel = () => {
    const rows = filteredPayments.map(p => ({
      ID: p.id,
      'Тип услуги': getServiceLabel(p.referenceType, p.source),
      'ID заказа': p.referenceId,
      'User ID': p.userId,
      Сумма: p.amount,
      Валюта: p.currency,
      Статус: getStatusBadge(p.status).label,
      Дата: formatDate(p.createdAt),
      'Дата (ISO)': p.createdAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Транзакции');
    XLSX.writeFile(wb, `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-200">Бухгалтерия</h2>
        <button
          onClick={exportToExcel}
          disabled={filteredPayments.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Экспорт Excel
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <CreditCard className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Всего платежей</p>
          <p className="text-2xl font-bold text-gray-200">{payments.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Оплачено</p>
          <p className="text-2xl font-bold text-green-400">{paidCount}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <PieChartIcon className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Выручка (смн)</p>
          <p className="text-2xl font-bold text-emerald-400">{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4 flex items-center justify-center">
          <button onClick={exportToExcel} disabled={filteredPayments.length === 0} className="flex flex-col items-center gap-1 disabled:opacity-50">
            <Download className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-gray-400">Excel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pieByService.length > 0 && (
          <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-200 mb-4">Выручка по услугам</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieByService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieByService.map((_, i) => <Cell key={i} fill={pieByService[i].fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2537' }} formatter={(v: number) => [`${v.toLocaleString()} смн`, 'Сумма']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {monthlyChartData.length > 0 && (
          <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-200 mb-4">Выручка по месяцам</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2537' }} />
                  <Bar dataKey="value" fill="#10b981" name="Смн" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pieByDay.length > 0 && (
          <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
            <h3 className="text-base font-semibold text-gray-200 mb-4">Выручка по дням недели</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieByDay} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70}>
                    {pieByDay.map((_, i) => <Cell key={i} fill={pieByDay[i].fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2537' }} formatter={(v: number) => [`${v.toLocaleString()} смн`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <h3 className="text-base font-semibold text-gray-200 mb-4">Мониторинг транзакций</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {filteredPayments.slice(0, 10).map(p => {
              const badge = getStatusBadge(p.status);
              return (
                <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-[#0d1117]/50 rounded-lg border border-[#1e2537]/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{getServiceLabel(p.referenceType, p.source)}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${badge.color}`}>{badge.label}</span>
                  <span className="ml-2 text-sm font-semibold text-gray-200">{p.amount.toLocaleString()} смн</span>
                </div>
              );
            })}
            {filteredPayments.length === 0 && <p className="text-center text-gray-500 py-4">Нет транзакций</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1e2537]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-200">Таблица транзакций</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 lg:w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
              </div>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все услуги</option>
                {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все статусы</option>
                <option value="paid">Оплачено</option>
                <option value="pending">Ожидание</option>
                <option value="failed">Ошибка</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase">Услуга</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">ID</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Статус</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Дата</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => {
                const badge = getStatusBadge(p.status);
                return (
                  <tr key={p.id} className="border-b border-[#1e2537] hover:bg-[#0d1117]">
                    <td className="p-4 pl-6"><span className="text-sm text-gray-300">{getServiceLabel(p.referenceType, p.source)}</span></td>
                    <td className="p-4"><p className="text-sm font-mono text-gray-400">{p.id.slice(0, 12)}...</p></td>
                    <td className="p-4"><span className="text-sm font-semibold text-gray-200">{p.amount.toLocaleString()} {p.currency}</span></td>
                    <td className="p-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>{badge.label}</span></td>
                    <td className="p-4"><span className="text-sm text-gray-400">{formatDate(p.createdAt)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && <p className="text-center text-gray-400 py-8">Нет платежей</p>}
      </div>
    </div>
  );
}
