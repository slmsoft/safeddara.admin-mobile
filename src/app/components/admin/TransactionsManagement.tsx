import { useState, useEffect, useCallback } from 'react';
import { Search, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
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

export function TransactionsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
    return matchSearch && matchStatus;
  });

  const totalAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CreditCard className="w-5 h-5 text-blue-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Всего платежей</p>
          <p className="text-2xl font-bold text-gray-200">{payments.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-green-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Оплачено (смн)</p>
          <p className="text-2xl font-bold text-green-400">{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">Платежи</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
              </div>
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
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase">ID</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Тип</th>
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
                      <p className="text-sm font-mono text-gray-300">{p.id.slice(0, 8)}...</p>
                      <p className="text-xs text-gray-500">{p.referenceId}</p>
                    </td>
                    <td className="p-4"><span className="text-sm text-gray-300">{p.referenceType}</span></td>
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
