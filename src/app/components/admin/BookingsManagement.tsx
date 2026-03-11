import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Maximize2, Minimize2, Plus, ListFilter } from 'lucide-react';
import { Modal } from './Modal';
import { adminApi, type Accommodation } from '../../../api/backendApi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, isSameDay } from 'date-fns';
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
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [showRoomPanel, setShowRoomPanel] = useState(false);

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

  const getBookingsForAcc = (accId: string): BookingRaw[] =>
    bookings.filter(b => b.accommodationId === accId);

  const getBarPosition = (b: BookingRaw) => {
    try {
      const checkIn = startOfDay(new Date(b.checkIn));
      const checkOut = startOfDay(new Date(b.checkOut));
      const totalMs = monthEnd.getTime() - monthStart.getTime() + 86400000;
      let left = (checkIn.getTime() - monthStart.getTime()) / totalMs * 100;
      let right = (checkOut.getTime() - monthStart.getTime() + 86400000) / totalMs * 100;
      if (left < 0) left = 0;
      if (right > 100) right = 100;
      return { left: Math.max(0, left), width: Math.min(100, right) - Math.max(0, left) };
    } catch { return { left: 0, width: 0 }; }
  };

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const todayIndex = days.findIndex(d => isSameDay(d, new Date()));

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

  const displayAccommodations = selectedRoomIds.size > 0
    ? allAccommodations.filter(a => selectedRoomIds.has(a.id))
    : allAccommodations;

  const toggleRoomSelection = (id: string) => {
    setSelectedRoomIds(prev => {
      const next = new Set(prev.size === 0 ? allAccommodations.map(a => a.id) : prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next.size === 0 ? new Set() : next;
    });
  };

  const selectAllRooms = () => setSelectedRoomIds(new Set());

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
          <h2 className="text-xl font-bold text-gray-200">Календарь бронирований</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Всего:</span>
            <span className="font-semibold text-gray-200">{bookings.length}</span>
            <span className="text-green-400 font-medium">Подтв.: {confirmedCount}</span>
          </div>
          <button
            onClick={() => setShowRoomPanel(p => !p)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${showRoomPanel ? 'bg-[#1e2537] text-gray-200' : 'bg-[#0d1117] text-gray-400 hover:text-gray-200'}`}
            title="Выбрать номера для отображения"
          >
            <ListFilter className="w-4 h-4" /> Номера
          </button>
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

      {showRoomPanel && (
        <div className="p-4 bg-[#161b2e] border-b border-[#1e2537] max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Выберите номера для календаря (пусто = все)</span>
            <button onClick={selectAllRooms} className="text-xs text-blue-400 hover:underline">Показать все</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allAccommodations.map(acc => {
              const isChecked = selectedRoomIds.size === 0 || selectedRoomIds.has(acc.id);
              return (
                <label key={acc.id} className="flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded bg-[#0d1117] hover:bg-[#1e2537]">
                  <input type="checkbox" checked={isChecked} onChange={() => toggleRoomSelection(acc.id)} className="rounded border-gray-500" />
                  <span className="text-sm text-gray-300">{acc.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCalendarMonth(m => subMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <h3 className="text-xl font-semibold text-gray-200 capitalize">
            {format(calendarMonth, 'LLLL yyyy', { locale: ru })}
          </h3>
          <button onClick={() => setCalendarMonth(m => addMonths(m, 1))} className="p-2 hover:bg-[#1e2537] rounded-lg">
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1e2537] bg-[#161b2e]" style={{ minWidth: Math.max(800, days.length * 40) }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs font-semibold text-gray-400 uppercase w-28 sticky left-0 bg-[#0d1117] z-20 border-r border-b border-[#1e2537]">Номера</th>
                <th className="border-b border-[#1e2537] p-0">
                  <div className="flex" style={{ width: days.length * 40 }}>
                    {days.map(d => (
                      <div key={d.toISOString()} className="flex-1 min-w-[40px] p-1 text-center text-[10px] font-semibold text-gray-400 border-r border-[#1e2537]/60">
                        <div>{format(d, 'EEE', { locale: ru })}</div>
                        <div className="text-gray-300">{format(d, 'd')}</div>
                      </div>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayAccommodations.length === 0 ? (
                <tr><td colSpan={2} className="p-12 text-center text-gray-400">Нет номеров</td></tr>
              ) : (
                displayAccommodations.map((acc) => {
                  const accBookings = getBookingsForAcc(acc.id).filter(b => {
                    try {
                      const cOut = new Date(b.checkOut);
                      return cOut >= monthStart;
                    } catch { return true; }
                  });
                  return (
                    <tr key={acc.id} className="border-t border-[#1e2537]">
                      <td className="py-1.5 px-3 text-sm text-gray-300 sticky left-0 bg-[#161b2e] z-10 border-r border-[#1e2537] font-medium">{acc.title}</td>
                      <td className="p-0 align-middle">
                        <div className="relative h-9" style={{ width: days.length * 40 }}>
                          <div className="absolute inset-0 flex bg-[#0d1117]/20">
                            {days.map(d => (
                              <div key={d.toISOString()} className="flex-1 min-w-[40px] border-r border-[#1e2537]/30" />
                            ))}
                          </div>
                          {todayIndex >= 0 && (
                            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none" style={{ left: `${((todayIndex + 0.5) / days.length) * 100}%`, marginLeft: -1 }} />
                          )}
                          {accBookings.map((b) => {
                            const pos = getBarPosition(b);
                            if (pos.width <= 0) return null;
                            const statusColors: Record<string, string> = {
                              confirmed: 'bg-green-600 hover:bg-green-500',
                              cancelled: 'bg-red-600 hover:bg-red-500',
                              pending: 'bg-amber-500 hover:bg-amber-400',
                              pending_payment: 'bg-amber-500 hover:bg-amber-400',
                            };
                            const color = statusColors[b.status] || 'bg-amber-500 hover:bg-amber-400';
                            const tooltip = `${b.guestName}${b.guestPhone ? ` · ${b.guestPhone}` : ''} · ${formatDisplayDate(b.checkIn)}–${formatDisplayDate(b.checkOut)}`;
                            return (
                              <div
                                key={b.id}
                                className={`absolute top-0.5 bottom-0.5 rounded cursor-pointer ${color} flex items-center px-1 min-w-0 overflow-hidden text-white text-[10px] font-medium transition-colors`}
                                style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
                                onClick={() => setSelectedBooking(b)}
                                title={tooltip}
                              >
                                <span className="truncate">{b.guestName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {accommodations.length > 30 && (
            <p className="p-3 text-center text-sm text-gray-500">Показано до 30 номеров</p>
          )}
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
