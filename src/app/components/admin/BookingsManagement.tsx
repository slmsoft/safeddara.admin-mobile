import { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, CheckCircle, XCircle, Clock, Edit2 } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi } from '../../../api/backendApi';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
}

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.bookings.list();
      if (res.success && res.data?.bookings) {
        setBookings(res.data.bookings.map((b: any) => ({
          id: b.id,
          guestName: b.guestName,
          guestEmail: b.guestEmail,
          room: b.accommodation?.title || '—',
          checkIn: b.checkIn ? new Date(b.checkIn).toLocaleDateString('ru-RU') : '',
          checkOut: b.checkOut ? new Date(b.checkOut).toLocaleDateString('ru-RU') : '',
          guests: b.guests || 0,
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

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const statusMap: Record<string, string> = {
    pending: 'Ожидание',
    pending_payment: 'Ожидание оплаты',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
  };

  const getStatusBadge = (status: string) => {
    const s = status || 'pending';
    const badges: Record<string, { label: string; color: string }> = {
      confirmed: { label: 'Подтверждено', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Ожидание', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      pending_payment: { label: 'Ожидание оплаты', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      cancelled: { label: 'Отменено', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return badges[s] || badges.pending;
  };

  const handleEditBooking = (b: Booking) => {
    setEditingBooking({ ...b });
    setIsModalOpen(true);
  };

  const handleSaveBooking = async () => {
    if (!editingBooking) return;
    setSaving(true);
    try {
      await adminApi.bookings.update(editingBooking.id, { status: editingBooking.status });
      await loadBookings();
      setIsModalOpen(false);
    } catch (e) {
      alert((e as Error).message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const statuses = ['all', ...Array.from(new Set(bookings.map(b => b.status)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-blue-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Всего</p>
          <p className="text-2xl font-bold text-gray-200">{bookings.length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Подтверждено</p>
          <p className="text-2xl font-bold text-green-400">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-yellow-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Ожидание</p>
          <p className="text-2xl font-bold text-yellow-400">{bookings.filter(b => ['pending', 'pending_payment'].includes(b.status)).length}</p>
        </div>
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><XCircle className="w-5 h-5 text-red-400" /></div>
          <p className="text-gray-400 text-xs mb-1">Отменено</p>
          <p className="text-2xl font-bold text-red-400">{bookings.filter(b => b.status === 'cancelled').length}</p>
        </div>
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">Бронирования</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
              </div>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все статусы</option>
                {statuses.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{statusMap[s] || s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase">Гость</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Номер</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Заезд</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Выезд</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Гостей</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Статус</th>
                <th className="text-right p-4 pr-6 text-xs font-semibold text-gray-400 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const badge = getStatusBadge(b.status);
                return (
                  <tr key={b.id} className="border-b border-[#1e2537] hover:bg-[#0d1117]">
                    <td className="p-4 pl-6">
                      <div>
                        <p className="text-sm font-medium text-gray-200">{b.guestName}</p>
                        <p className="text-xs text-gray-400">{b.guestEmail}</p>
                      </div>
                    </td>
                    <td className="p-4"><span className="text-sm text-gray-300">{b.room}</span></td>
                    <td className="p-4"><span className="text-sm text-gray-300">{b.checkIn}</span></td>
                    <td className="p-4"><span className="text-sm text-gray-300">{b.checkOut}</span></td>
                    <td className="p-4"><span className="text-sm text-gray-300">{b.guests}</span></td>
                    <td className="p-4"><span className="text-sm font-semibold text-gray-200">{b.total.toLocaleString()} смн</span></td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>{badge.label}</span>
                    </td>
                    <td className="p-4 pr-6">
                      <button onClick={() => handleEditBooking(b)} className="p-2 hover:bg-[#1e2537] rounded-lg"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && <p className="text-center text-gray-400 py-8">Нет бронирований</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBooking(null); }} title="Редактировать бронирование" size="lg">
        {editingBooking && (
          <div className="space-y-4">
            <div><p className="text-xs text-gray-400 mb-1">Гость</p><p className="text-gray-200">{editingBooking.guestName} ({editingBooking.guestEmail})</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Номер</p><p className="text-gray-200">{editingBooking.room}</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Даты</p><p className="text-gray-200">{editingBooking.checkIn} — {editingBooking.checkOut}</p></div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
              <select value={editingBooking.status} onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200">
                <option value="pending">Ожидание</option>
                <option value="pending_payment">Ожидание оплаты</option>
                <option value="confirmed">Подтверждено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg">Отмена</button>
              <button onClick={handleSaveBooking} disabled={saving} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50">Сохранить</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
