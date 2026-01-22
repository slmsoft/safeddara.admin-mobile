import { useState } from 'react';
import { Search, CreditCard, TrendingUp, TrendingDown, DollarSign, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Modal } from './Modal';

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  avatar: string;
}

export function TransactionsManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', customerName: 'Иван Петров', customerEmail: 'ivan@mail.ru', type: 'income', category: 'Бронирование', amount: 160000, date: '12 янв 2026', method: 'Карта', status: 'completed', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '2', customerName: 'Мария Сидорова', customerEmail: 'maria@gmail.com', type: 'income', category: 'Аренда', amount: 6000, date: '12 янв 2026', method: 'Наличные', status: 'completed', avatar: 'https://i.pravatar.cc/150?img=45' },
    { id: '3', customerName: 'Алексей Морозов', customerEmail: 'alexey@inbox.ru', type: 'income', category: 'Ski-pass', amount: 8000, date: '11 янв 2026', method: 'Карта', status: 'pending', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: '4', customerName: 'Ольга Николаева', customerEmail: 'olga@mail.com', type: 'expense', category: 'Закупка', amount: 25000, date: '11 янв 2026', method: 'Перевод', status: 'completed', avatar: 'https://i.pravatar.cc/150?img=20' },
    { id: '5', customerName: 'Дмитрий Козлов', customerEmail: 'dmitry@yandex.ru', type: 'income', category: 'Ресторан', amount: 4500, date: '10 янв 2026', method: 'Карта', status: 'completed', avatar: 'https://i.pravatar.cc/150?img=56' },
    { id: '6', customerName: 'Елена Смирнова', customerEmail: 'elena@gmail.com', type: 'income', category: 'СПА', amount: 12000, date: '10 янв 2026', method: 'Карта', status: 'failed', avatar: 'https://i.pravatar.cc/150?img=47' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const stats = [
    { label: 'Всего транзакций', value: transactions.length.toString(), icon: CreditCard, color: 'bg-blue-500' },
    { label: 'Доход', value: `${(totalIncome / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Расход', value: `${(totalExpense / 1000).toFixed(0)}K`, icon: TrendingDown, color: 'bg-red-500' },
    { label: 'Прибыль', value: `${(profit / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-purple-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { label: 'Выполнен', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Ожидание', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      failed: { label: 'Неуспешно', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      customerName: '',
      customerEmail: '',
      type: 'income',
      category: '',
      amount: 0,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      method: 'Карта',
      status: 'pending',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    setEditingTransaction(newTransaction);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({ ...transaction });
    setIsModalOpen(true);
  };

  const handleSaveTransaction = () => {
    if (!editingTransaction) return;
    
    if (!editingTransaction.customerName || !editingTransaction.category || editingTransaction.amount <= 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingTransaction.id && transactions.find(t => t.id === editingTransaction.id)) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? editingTransaction : t));
    } else {
      setTransactions([...transactions, editingTransaction]);
    }
    
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-200">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2537]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-200">Все транзакции</h2>
              <p className="text-sm text-gray-400 mt-1">1 - {filteredTransactions.length} из {transactions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-[#0d1117] border border-[#1e2537] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                <option value="all">Все типы</option>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить транзакцию
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2537] bg-[#0d1117]">
                <th className="text-left p-4 pl-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Клиент</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Категория</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Сумма</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Способ</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="text-right p-4 pr-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const statusBadge = getStatusBadge(transaction.status);
                return (
                  <tr key={transaction.id} className="border-b border-[#1e2537] hover:bg-[#0d1117] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img src={transaction.avatar} alt={transaction.customerName} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-gray-200">{transaction.customerName}</p>
                          <p className="text-xs text-gray-400">{transaction.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {transaction.type === 'income' ? 'Доход' : 'Расход'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{transaction.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} смн
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{transaction.method}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-300">{transaction.date}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-2 hover:bg-[#1e2537] rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1e2537] flex items-center justify-between bg-[#0d1117]">
          <p className="text-sm text-gray-400">Показано {filteredTransactions.length} из {transactions.length}</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Назад</button>
            <button disabled className="px-3 py-1.5 bg-[#161b2e] border border-[#1e2537] text-gray-500 rounded-lg text-sm cursor-not-allowed">Далее</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction?.id && transactions.find(t => t.id === editingTransaction.id) ? 'Редактировать транзакцию' : 'Добавить транзакцию'}
        size="lg"
      >
        {editingTransaction && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя клиента *
              </label>
              <input
                type="text"
                value={editingTransaction.customerName}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, customerName: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="Введите имя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editingTransaction.customerEmail}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, customerEmail: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип *
                </label>
                <select
                  value={editingTransaction.type}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.target.value as Transaction['type'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Категория *
                </label>
                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="Бронирование, Аренда и т.д."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сумма (смн) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Способ оплаты
                </label>
                <select
                  value={editingTransaction.method}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, method: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Карта">Карта</option>
                  <option value="Наличные">Наличные</option>
                  <option value="Перевод">Перевод</option>
                  <option value="Kaspi">Kaspi</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дата
                </label>
                <input
                  type="text"
                  value={editingTransaction.date}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="12 янв 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Статус
                </label>
                <select
                  value={editingTransaction.status}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, status: e.target.value as Transaction['status'] })}
                  className="w-full bg-[#0d1117] border border-[#1e2537] rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Ожидание</option>
                  <option value="completed">Выполнен</option>
                  <option value="failed">Неуспешно</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2537]">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTransaction(null);
                }}
                className="px-4 py-2 bg-[#161b2e] hover:bg-[#1e2537] border border-[#1e2537] text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
              <button
                onClick={handleSaveTransaction}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
