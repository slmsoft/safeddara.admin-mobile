import { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, CheckCircle, XCircle, Clock, Edit2, Plus, ChevronLeft, ChevronRight, CalendarDays, List } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi, type Accommodation } from '../../../api/backendApi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingRaw {
  id: string;
  guestName: string;
  guestEmail: string;
  accommodationId: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
}

export function BookingsManagement() {
  const [bookings, setBookings] = useState<BookingRaw[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<BookingRaw | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDayBooking, setSelectedDayBooking] = useState<BookingRaw | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, accRes] = await Promise.all([
        adminApi.bookings.list(),
        adminApi.accommodations.list().catch(() => ({ success: false, data: { accommodations: [] } })),
      ]);
      const accList = accRes.success && accRes.data?.accommodations ? accRes.data.accommodations : [];
      setAccommodations(accList);
      if (bookingsRes.success && bookingsRes.data?.bookings) {
        const byTitle = Object.fromEntries(accList.map((a: Accommodation) => [a.title.toLowerCase(), a.id]));
        setBookings(bookingsRes.data.bookings.map((b: any) => {
          const roomTitle = b.accommodation?.title || '—';
          const accId = b.accommodation?.id || b.accommodationId || byTitle[roomTitle.toLowerCase()] || '';
          return {
            id: b.id,
            guestName: b.guestName,
            guestEmail: b.guestEmail,
            accommodationId: accId,
            room: roomTitle,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            guests: b.guests || 0,
            total: b.totalPrice || 0,
            status: b.status || 'pending',
          };
        }));
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

  const formatDisplayDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('ru-RU');
    } catch {
      return d;
    }
  };

  const handleEditBooking = (b: BookingRaw) => {
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

  const isDayBooked = (day: Date, accId: string): BookingRaw | null => {
    const dayStart = startOfDay(day);
    for (const b of bookings) {
      if (b.accommodationId !== accId || b.status === 'cancelled') continue;
      try {
        const checkIn = startOfDay(new Date(b.checkIn));
        const checkOut = startOfDay(new Date(b.checkOut));
        if (isWithinInterval(dayStart, { start: checkIn, end: checkOut }) || isSameDay(dayStart, checkIn) || isSameDay(dayStart, checkOut)) {
          return b;
        }
      } catch {}
    }
    return null;
  };

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const statuses = ['all', ...Array.from(new Set(bookings.map(b => b.status)))];

  const addBookingInitial = {
    accommodationId: accommodations[0]?.id || '',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addMonths(new Date(), 0), 'yyyy-MM-dd'),
    guests: 1,
    guestName: '',
    guestEmail: '',
  };
  const [addForm, setAddForm] = useState(addBookingInitial);

  const handleAddBooking = async () => {
    if (!addForm.guestName.trim() || !addForm.guestEmail.trim()) {
      alert('Заполните имя и email гостя');
      return;
    }
    if (!addForm.accommodationId) {
      alert('Выберите номер');
      return;
    }
    setSaving(true);
    try {
      await adminApi.bookings.create({
        accommodationId: addForm.accommodationId,
        checkIn: addForm.checkIn,
        checkOut: addForm.checkOut,
        guests: addForm.guests,
        guestName: addForm.guestName.trim(),
        guestEmail: addForm.guestEmail.trim(),
      });
      await loadBookings();
      setIsAddModalOpen(false);
      setAddForm({ ...addBookingInitial, accommodationId: accommodations[0]?.id || '' });
    } catch (e) {
      alert((e as Error).message || 'Ошибка создания брони');
    } finally {
      setSaving(false);
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        <div className="p-4 sm:p-6 border-b border-[#1e2537]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${viewMode === 'calendar' ? 'bg-blue-500/30 text-blue-400' : 'text-gray-400 hover:bg-[#1e2537]'}`}
              >
                <CalendarDays className="w-4 h-4" /> Календарь
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${viewMode === 'table' ? 'bg-blue-500/30 text-blue-400' : 'text-gray-400 hover:bg-[#1e2537]'}`}
              >
                <List className="w-4 h-4" /> Таблица
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 sm:w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300" />
              </div>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300">
                <option value="all">Все статусы</option>
                {statuses.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{statusMap[s] || s}</option>
                ))}
              </select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalendarMonth(m => subMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h3 className="text-lg font-semibold text-gray-200 capitalize">
                {format(calendarMonth, 'LLLL yyyy', { locale: ru })}
              </h3>
              <button onClick={() => setCalendarMonth(m => addMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="overflow-x-auto min-w-0">
              <table className="w-full border-collapse" style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-semibold text-gray-400 uppercase w-32 sticky left-0 bg-[#161b2e] z-10 border-r border-[#1e2537]">Номер</th>
                    {days.map(d => (
                      <th key={d.toISOString()} className="p-2 text-center text-xs font-semibold text-gray-400 min-w-[44px]">
                        {format(d, 'd')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accommodations.length === 0 ? (
                    <tr><td colSpan={days.length + 1} className="p-8 text-center text-gray-400">Нет номеров</td></tr>
                  ) : (
                    accommodations.map(acc => (
                      <tr key={acc.id} className="border-t border-[#1e2537]">
                        <td className="p-2 text-sm text-gray-300 sticky left-0 bg-[#161b2e] z-10 border-r border-[#1e2537]">{acc.title}</td>
                        {days.map(day => {
                          const booking = isDayBooked(day, acc.id);
                          const isBooked = !!booking && booking.status !== 'cancelled';
                          return (
                            <td
                              key={day.toISOString()}
                              className={`p-1 min-w-[44px] ${isBooked ? 'bg-red-500/40 cursor-pointer hover:bg-red-500/60' : 'bg-[#0d1117]/50'} border border-[#1e2537]/50`}
                              onClick={() => isBooked && setSelectedDayBooking(booking)}
                            />
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedDayBooking && (
              <div className="mt-6 p-4 bg-[#0d1117] border border-[#1e2537] rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Бронирование на выбранный день</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gray-500">Гость:</span> <span className="text-gray-200">{selectedDayBooking.guestName}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="text-gray-200">{selectedDayBooking.guestEmail}</span></div>
                  <div><span className="text-gray-500">Номер:</span> <span className="text-gray-200">{selectedDayBooking.room}</span></div>
                  <div><span className="text-gray-500">Даты:</span> <span className="text-gray-200">{formatDisplayDate(selectedDayBooking.checkIn)} — {formatDisplayDate(selectedDayBooking.checkOut)}</span></div>
                  <div><span className="text-gray-500">Сумма:</span> <span className="text-gray-200">{selectedDayBooking.total} смн</span></div>
                  <div>
                    <button onClick={() => { handleEditBooking(selectedDayBooking); setSelectedDayBooking(null); }} className="text-blue-400 hover:underline">Редактировать</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <>
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
                        <td className="p-4"><span className="text-sm text-gray-300">{formatDisplayDate(b.checkIn)}</span></td>
                        <td className="p-4"><span className="text-sm text-gray-300">{formatDisplayDate(b.checkOut)}</span></td>
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
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBooking(null); }} title="Редактировать бронирование" size="lg">
        {editingBooking && (
          <div className="space-y-4">
            <div><p className="text-xs text-gray-400 mb-1">Гость</p><p className="text-gray-200">{editingBooking.guestName} ({editingBooking.guestEmail})</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Номер</p><p className="text-gray-200">{editingBooking.room}</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Даты</p><p className="text-gray-200">{formatDisplayDate(editingBooking.checkIn)} — {formatDisplayDate(editingBooking.checkOut)}</p></div>
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

      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setAddForm(addBookingInitial); }} title="Добавить бронирование" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Номер</label>
            <select value={addForm.accommodationId} onChange={(e) => setAddForm({ ...addForm, accommodationId: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200">
              <option value="">Выберите номер</option>
              {accommodations.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Заезд</label>
              <input type="date" value={addForm.checkIn} onChange={(e) => setAddForm({ ...addForm, checkIn: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Выезд</label>
              <input type="date" value={addForm.checkOut} onChange={(e) => setAddForm({ ...addForm, checkOut: e.target.value })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Имя гостя</label>
            <input type="text" value={addForm.guestName} onChange={(e) => setAddForm({ ...addForm, guestName: e.target.value })} placeholder="Иван Иванов" className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email гостя</label>
            <input type="email" value={addForm.guestEmail} onChange={(e) => setAddForm({ ...addForm, guestEmail: e.target.value })} placeholder="guest@example.com" className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Кол-во гостей</label>
            <input type="number" min={1} value={addForm.guests} onChange={(e) => setAddForm({ ...addForm, guests: parseInt(e.target.value) || 1 })} className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg">Отмена</button>
            <button onClick={handleAddBooking} disabled={saving} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50">Создать</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
