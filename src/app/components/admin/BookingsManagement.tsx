import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Plus, ChevronDown } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi, type Accommodation } from '../../../api/backendApi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, isSameDay, startOfWeek, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingRaw {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
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
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<BookingRaw | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRaw | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | 'all'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            guestPhone: (b as any).guestPhone || (b as any).user?.phone || '',
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

  useEffect(() => {
    const handler = () => { if (document.fullscreenElement) setIsFullscreen(true); else setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [dropdownOpen]);

  const getStatusBadge = (status: string) => {
    const s = status || 'pending';
    const badges: Record<string, { label: string; color: string }> = {
      confirmed: { label: 'Подтверждено', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Ожидание', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      pending_payment: { label: 'Ожидание оплаты', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      cancelled: { label: 'Отменено', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return badges[s] || badges.pending;
  };

  const formatDisplayDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ru-RU'); } catch { return d; }
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

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = addDays(calStart, 41);
  const calDays: (Date | null)[] = [];
  let d = calStart;
  while (d <= calEnd) {
    calDays.push(d >= monthStart && d <= monthEnd ? d : null);
    d = addDays(d, 1);
  }
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const allAccommodations = (() => {
    const fromApi = accommodations.slice(0, 50);
    const bookedIds = new Set(bookings.map(b => b.accommodationId));
    const missing = [...bookedIds].filter(id => !fromApi.some(a => a.id === id));
    if (missing.length === 0) return fromApi;
    const extra = missing.map(id => {
      const b = bookings.find(x => x.accommodationId === id);
      return { id, title: b?.room || id };
    });
    return [...fromApi, ...extra];
  })();

  const isDayBooked = (day: Date, accId?: string): BookingRaw | null => {
    const dayStart = startOfDay(day);
    const active = bookings.filter(b => b.status !== 'cancelled');
    for (const b of accId ? active.filter(x => x.accommodationId === accId) : active) {
      try {
        const checkIn = startOfDay(new Date(b.checkIn));
        const checkOut = startOfDay(new Date(b.checkOut));
        if (dayStart >= checkIn && dayStart <= checkOut) return b;
      } catch {}
    }
    return null;
  };

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

  const toggleFullscreen = () => {
    const el = document.getElementById('bookings-fullscreen');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div id="bookings-fullscreen" className={isFullscreen ? 'fixed inset-0 z-[9999] bg-[#0d1117] overflow-auto' : 'space-y-4'}>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#1e2537] bg-[#161b2e]">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Календарь бронирований</h2>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(o => !o); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#1e2537] text-white text-sm font-medium min-w-[200px] justify-between hover:border-[#374151]"
            >
              {selectedRoomId === 'all' ? 'Все категории' : allAccommodations.find(a => a.id === selectedRoomId)?.title || 'Все категории'}
              <ChevronDown className={`w-4 h-4 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-lg bg-[#0d1117] border border-[#1e2537] shadow-xl z-50 max-h-64 overflow-y-auto">
                <button onClick={(e) => { e.stopPropagation(); setSelectedRoomId('all'); setDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-white hover:bg-[#1e2537] text-sm">
                  Все категории
                </button>
                {allAccommodations.map(acc => (
                  <button key={acc.id} onClick={(e) => { e.stopPropagation(); setSelectedRoomId(acc.id); setDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-white hover:bg-[#1e2537] text-sm">
                    {acc.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-400">Подтв.: {confirmedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm">
            <Plus className="w-4 h-4" /> Добавить
          </button>
          <button onClick={toggleFullscreen} className="p-2 hover:bg-[#1e2537] rounded-lg text-gray-400 hover:text-gray-200" title={isFullscreen ? 'Выйти' : 'Полный экран'}>
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCalendarMonth(m => subMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h3 className="text-xl font-semibold text-white capitalize">
            {format(calendarMonth, 'LLLL yyyy', { locale: ru })}
          </h3>
          <button onClick={() => setCalendarMonth(m => addMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="rounded-xl border border-[#1e2537] bg-[#161b2e] overflow-hidden">
          <div className="grid grid-cols-7">
            {weekDays.map(w => (
              <div key={w} className="p-2 text-center text-xs font-semibold text-gray-400 border-b border-r border-[#1e2537] last:border-r-0">
                {w}
              </div>
            ))}
            {calDays.map((day, i) => {
              const isToday = day && isSameDay(day, new Date());
              const booking = day ? isDayBooked(day, selectedRoomId === 'all' ? undefined : selectedRoomId) : null;
              const isCurrentMonth = day && day >= monthStart && day <= monthEnd;
              return (
                <div
                  key={i}
                  className={`min-h-[72px] p-1.5 border-b border-r border-[#1e2537]/60 last:border-r-0 flex flex-col relative ${!isCurrentMonth ? 'bg-[#0d1117]/50' : ''}`}
                >
                  {day && (
                    <>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${isCurrentMonth ? 'text-white' : 'text-gray-500'}`}>{format(day, 'd')}</span>
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                      </div>
                      <div className="flex-1 flex items-center justify-center mt-1">
                        {!isCurrentMonth ? null : booking ? (
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className={`w-full py-1 px-1 rounded text-[10px] font-medium text-white truncate cursor-pointer ${
                              booking.status === 'confirmed' ? 'bg-green-600 hover:bg-green-500' :
                              booking.status === 'cancelled' ? 'bg-red-600 hover:bg-red-500' :
                              'bg-amber-500 hover:bg-amber-400'
                            }`}
                            title={`${booking.guestName} · ${formatDisplayDate(booking.checkIn)}–${formatDisplayDate(booking.checkOut)}`}
                          >
                            {booking.guestName}
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-600/80 text-white text-[10px] font-medium">
                            Доступно
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedBooking && (
        <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title={`Бронирование #${selectedBooking.id.slice(0, 8)}`} size="lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-gray-400 text-sm">{selectedBooking.room}</span>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedBooking.status).color}`}>
                {getStatusBadge(selectedBooking.status).label}
              </span>
              <span className="text-xl font-bold text-emerald-400">{selectedBooking.total?.toLocale?.() ?? selectedBooking.total} смн</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Гость:</span> <span className="text-gray-200 font-medium">{selectedBooking.guestName}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="text-gray-200">{selectedBooking.guestEmail}</span></div>
              <div><span className="text-gray-500">Телефон:</span> <span className="text-gray-200">{selectedBooking.guestPhone || '—'}</span></div>
              <div><span className="text-gray-500">Номер:</span> <span className="text-gray-200">{selectedBooking.room}</span></div>
              <div><span className="text-gray-500">Гостей:</span> <span className="text-gray-200">{selectedBooking.guests}</span></div>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <span className="text-gray-500 text-sm">Период: </span>
              <span className="text-amber-200 font-semibold">{formatDisplayDate(selectedBooking.checkIn)} — {formatDisplayDate(selectedBooking.checkOut)}</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 bg-[#161b2e] border border-[#1e2537] text-gray-300 rounded-lg hover:bg-[#1e2537]">Закрыть</button>
              <button onClick={() => { handleEditBooking(selectedBooking); setSelectedBooking(null); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Редактировать</button>
            </div>
          </div>
        </Modal>
      )}

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
