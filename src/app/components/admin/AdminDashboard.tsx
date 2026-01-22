import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  Users,
  Calendar,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AdminDashboardProps {
  userRole: 'superadmin' | 'admin' | 'accountant';
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  // Mock data for charts
  const revenueData = [
    { month: 'Янв', revenue: 120000, expenses: 75000 },
    { month: 'Фев', revenue: 145000, expenses: 82000 },
    { month: 'Мар', revenue: 185000, expenses: 95000 },
    { month: 'Апр', revenue: 165000, expenses: 88000 },
    { month: 'Май', revenue: 195000, expenses: 98000 },
    { month: 'Июн', revenue: 210000, expenses: 102000 },
    { month: 'Июл', revenue: 190000, expenses: 96000 },
    { month: 'Авг', revenue: 215000, expenses: 105000 },
    { month: 'Сен', revenue: 235000, expenses: 110000 },
    { month: 'Окт', revenue: 255000, expenses: 115000 },
    { month: 'Ноя', revenue: 245000, expenses: 112000 },
    { month: 'Дек', revenue: 270000, expenses: 120000 }
  ];

  const profitData = [
    { time: '00:00', value: 120 },
    { time: '03:00', value: 180 },
    { time: '06:00', value: 250 },
    { time: '09:00', value: 320 },
    { time: '12:00', value: 280 },
    { time: '15:00', value: 380 },
    { time: '18:00', value: 420 },
    { time: '21:00', value: 350 }
  ];

  const sessionsData = [
    { time: '00:00', sessions: 80 },
    { time: '03:00', sessions: 120 },
    { time: '06:00', sessions: 200 },
    { time: '09:00', sessions: 280 },
    { time: '12:00', sessions: 350 },
    { time: '15:00', sessions: 320 },
    { time: '18:00', sessions: 380 },
    { time: '21:00', sessions: 280 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pageviews */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Просмотры</span>
            </div>
            <button className="text-gray-400 hover:text-gray-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-200">50.8K</h3>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.2%
            </span>
          </div>
        </div>

        {/* Monthly Users */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Месячные пользователи</span>
            </div>
            <button className="text-gray-400 hover:text-gray-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-200">23.6K</h3>
            <span className="text-sm text-red-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -3.1%
            </span>
          </div>
        </div>

        {/* New Sign Ups */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Новые регистрации</span>
            </div>
            <button className="text-gray-400 hover:text-gray-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-200">756</h3>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15.3%
            </span>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Бронирования</span>
            </div>
            <button className="text-gray-400 hover:text-gray-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-200">2.3K</h3>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +6.5%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="lg:col-span-2 bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">Общий доход</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-200">1,247,500 смн</span>
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +24.5%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-400">Доход</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-gray-400">Расходы</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #1e2537',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#6366f1" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Total Profit */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">Общая прибыль</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-200">844,600 смн</span>
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18%
                </span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" vertical={false} />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #1e2537',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }} 
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-400 text-center mt-4">
            За последние 12 месяцев
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Sessions */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-1">Активные сессии</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-200">400</span>
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.3%
                </span>
              </div>
            </div>
            <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
              Подробнее
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2537" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1117', 
                  border: '1px solid #1e2537',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }} 
              />
              <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e2537]">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm">+21.8%</span>
              <span className="text-gray-400 text-sm">10k посетителей</span>
            </div>
            <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
              Подробнее
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Последняя активность</h3>
            <button className="text-blue-400 text-sm font-medium hover:text-blue-300">
              Все
            </button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Иван Петров', action: 'Создал новое бронирование', time: '2 мин назад', color: 'bg-blue-500' },
              { user: 'Софья Морозова', action: 'Платеж получен', time: '5 мин назад', color: 'bg-green-500' },
              { user: 'Алексей Криминов', action: 'Отменил заказ', time: '12 мин назад', color: 'bg-red-500' },
              { user: 'Григорий Хилс', action: 'Новый отзыв', time: '1 час назад', color: 'bg-indigo-500' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200 font-medium">{activity.user}</p>
                  <p className="text-xs text-gray-400">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}