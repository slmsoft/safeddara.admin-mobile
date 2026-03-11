import { useState, useEffect, useCallback } from 'react';
import { Search, CreditCard, TrendingUp, Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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

  const chartData = Object.entries(serviceTotals).map(([name, value]) => ({ name, value }));

  const monthlyData = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => {
      try {
        const d = new Date(p.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + p.amount;
        return acc;
      } catch {
        return acc;
      }
    }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([name, value]) => ({
      name: name.replace('-', ' '),
      value,
    }));

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
    try {
      return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CreditCard className="w-5 h-5 text-blue-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Всего платежей</p>
          <p className="text-2xl font-bold text-gray-200">{payments.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-green-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Оплачено</p>
          <p className="text-2xl font-bold text-green-400">{paidCount}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-5 h-5 text-emerald-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Сумма (смн)</p>
          <p className="text-2xl font-bold text-emerald-400">{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-1">Экспорт</p>
            <p className="text-sm text-gray-300">Excel</p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={filteredPayments.length === 0}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 text-blue-400" />
          </button>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Выручка по услугам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2537' }} />
                <Bar dataKey="value" fill="#3b82f6" name="Сумма (смн)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {monthlyChartData.length > 0 && (
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Выручка по месяцам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}`} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2537' }} />
                <Bar dataKey="value" fill="#10b981" name="Сумма (смн)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-200">Платежи по услугам</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 lg:w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
              </div>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все услуги</option>
                {uniqueServices.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все статусы</option>
                <option value="paid">Оплачено</option>
                <option value="pending">Ожидание</option>
                <option value="failed">Ошибка</option>
              </select>
              <button
                onClick={exportToExcel}
                disabled={filteredPayments.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Экспорт Excel
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase">ID</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Услуга</th>
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
                    <td className="p-4 pl-6">
                      <p className="text-sm font-mono text-gray-300">{p.id.slice(0, 12)}...</p>
                      <p className="text-xs text-gray-500">{p.referenceId}</p>
                    </td>
                    <td className="p-4"><span className="text-sm text-gray-300">{getServiceLabel(p.referenceType, p.source)}</span></td>
                    <td className="p-4"><span className="text-sm font-semibold text-gray-200">{p.amount.toLocaleString()} {p.currency}</span></td>
                    <td className="p-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>{badge.label}</span></td>
                    <td className="p-4"><span className="text-sm text-gray-300">{formatDate(p.createdAt)}</span></td>
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
