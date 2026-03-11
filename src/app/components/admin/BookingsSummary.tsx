import { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { adminApi } from '../../../api/backendApi';

interface BookingStat {
  id: string;
  room: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
}

export function BookingsSummary() {
  const [bookings, setBookings] = useState<BookingStat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.bookings.list();
      if (res.success && res.data?.bookings) {
        setBookings(res.data.bookings.map((b: any) => ({
          id: b.id,
          room: b.accommodation?.title || '—',
          guestName: b.guestName,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          total: b.totalPrice || 0,
          status: b.status || 'pending',
        })));
      }
    } catch (e) {
      console.error('Load bookings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU'); } catch { return d; }
  };

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const pending = bookings.filter(b => b.status === 'pending' || b.status === 'pending_payment');
  const totalRevenue = confirmed.reduce((s, b) => s + b.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-200">Бронирования — сводка</h2>
      <p className="text-gray-400 text-sm">Только цифры и статистика. Полное управление — у администратора.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <Calendar className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Всего</p>
          <p className="text-2xl font-bold text-gray-200">{bookings.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-green-500/30 rounded-xl p-4">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Подтверждено</p>
          <p className="text-2xl font-bold text-green-400">{confirmed.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-yellow-500/30 rounded-xl p-4">
          <Clock className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Ожидание</p>
          <p className="text-2xl font-bold text-yellow-400">{pending.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-gray-400 text-xs mb-1">Выручка (смн)</p>
          <p className="text-2xl font-bold text-emerald-400">{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1e2537]">
          <h3 className="text-lg font-semibold text-gray-200">Последние бронирования</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Номер</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Гость</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Даты</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Статус</th>
              </tr>
            </thead>
            <tbody>
              {[...bookings].sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()).slice(0, 20).map((b) => {
                const statusClass = b.status === 'confirmed' ? 'text-green-400' : b.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400';
                const statusLabel = b.status === 'confirmed' ? 'Подтверждено' : b.status === 'cancelled' ? 'Отменено' : 'Ожидание';
                return (
                  <tr key={b.id} className="border-b border-[#1e2537] hover:bg-[#0d1117]">
                    <td className="p-4 text-sm text-gray-300">{b.room}</td>
                    <td className="p-4 text-sm text-gray-300">{b.guestName}</td>
                    <td className="p-4 text-sm text-gray-400">{formatDate(b.checkIn)} — {formatDate(b.checkOut)}</td>
                    <td className="p-4 text-sm font-semibold text-gray-200">{b.total.toLocaleString()} смн</td>
                    <td className="p-4"><span className={statusClass}>{statusLabel}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && <p className="text-center text-gray-400 py-8">Нет бронирований</p>}
      </div>
    </div>
  );
}
