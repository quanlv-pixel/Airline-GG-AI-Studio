import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Users, 
  TrendingUp, 
  BadgeDollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Clock,
  MapPin,
  RefreshCw,
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const INITIAL_STATS = [
  { label: 'Total Flights', value: '0', change: '+12.5%', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Passengers', value: '0', change: '+18.2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Active Bookings', value: '0', change: '-2.4%', icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-red-50' },
  { label: 'Total Revenue', value: '$0', change: '+24.5%', icon: BadgeDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
];

const chartData = [
  { name: 'Mon', revenue: 4000, bookings: 2400 },
  { name: 'Tue', revenue: 3000, bookings: 1398 },
  { name: 'Wed', revenue: 2000, bookings: 9800 },
  { name: 'Thu', revenue: 2780, bookings: 3908 },
  { name: 'Fri', revenue: 1890, bookings: 4800 },
  { name: 'Sat', revenue: 2390, bookings: 3800 },
  { name: 'Sun', revenue: 3490, bookings: 4300 },
];

const recentFlights = [
  { id: 'JJ121', origin: 'SGN', dest: 'HAN', time: '10:30 AM', status: 'On Time', gate: 'B12', seats: '12/180' },
  { id: 'JJ342', origin: 'HAN', dest: 'DAD', time: '11:45 AM', status: 'Delayed', gate: 'A05', seats: '156/180' },
  { id: 'JJ551', origin: 'SGN', dest: 'PQC', time: '12:15 PM', status: 'Boarding', gate: 'C02', seats: '178/180' },
  { id: 'JJ882', origin: 'DAD', dest: 'SGN', time: '01:30 PM', status: 'On Time', gate: 'B08', seats: '0/180' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('Last 7 Days');

  const stats = useMemo(() => {
    return [
      { label: 'Tổng số Chuyến bay', value: '42', change: '+12.5%', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Tổng số Hành khách', value: '1,280', change: '+18.2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Yêu cầu Đặt chỗ', value: '854', change: '-2.4%', icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-red-50' },
      { label: 'Tổng Doanh thu', value: '$124.5k', change: '+24.5%', icon: BadgeDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    ];
  }, []);

  const topFlights = [
    { id: 'JJ121', origin: 'SGN', dest: 'HAN', time: '10:30 AM', status: 'Đúng giờ', gate: 'B12', seats: '168/180' },
    { id: 'JJ342', origin: 'HAN', dest: 'DAD', time: '11:45 AM', status: 'Chậm chuyến', gate: 'A05', seats: '156/180' },
    { id: 'JJ551', origin: 'SGN', dest: 'PQC', time: '12:15 PM', status: 'Đang lên máy bay', gate: 'C02', seats: '178/180' },
    { id: 'JJ882', origin: 'DAD', dest: 'SGN', time: '01:30 PM', status: 'Đúng giờ', gate: 'B08', seats: '142/180' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Bảng Điều khiển</h2>
          <p className="text-sm text-gray-400 font-medium">Báo cáo trực thực thực tế về đội bay và doanh thu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            {[
              { id: 'Weekly', label: 'Hàng tuần' },
              { id: 'Monthly', label: 'Hàng tháng' }
            ].map((t) => (
              <button 
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                  timeframe.includes(t.id) ? "bg-brand-primary text-white shadow-md shadow-red-100" : "text-gray-400"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button 
            className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="glass-card p-6 rounded-[32px] relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-brand-primary/5 transition-all shadow-xl shadow-gray-200/20"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl shadow-sm", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight",
                stat.change.startsWith('+') ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              )}>
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ chính */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 rounded-[32px] shadow-xl shadow-gray-200/20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Hiệu suất Doanh thu</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Tổng hợp thu nhập toàn cầu</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <span className="text-[11px] font-black text-gray-900 uppercase">NĂM TÀI CHÍNH 2026</span>
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ed1c24" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ed1c24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ed1c24" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Các đường bay phổ biến */}
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] shadow-xl shadow-gray-200/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Tuyến bay</h3>
            <TrendingUp className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="space-y-8">
            {[
              { route: 'SGN -> HAN', value: 85, color: 'bg-brand-primary', sub: 'Lưu lượng cao' },
              { route: 'SGN -> DAD', value: 65, color: 'bg-blue-500', sub: 'Cao điểm mùa vụ' },
              { route: 'HAN -> PQC', value: 45, color: 'bg-purple-500', sub: 'Nhu cầu nghỉ dưỡng' },
              { route: 'DAD -> SGN', value: 30, color: 'bg-indigo-500', sub: 'Chuyến bay đêm' },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{item.route}</span>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <span className="text-xs font-black text-brand-primary">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: 'easeOut' }}
                    className={cn("h-full rounded-full shadow-inner", item.color)} 
                  />
                </div>
              </div>
            ))}
            <button className="w-full py-4 mt-4 text-[10px] font-black text-brand-primary bg-brand-accent rounded-2xl hover:bg-red-100 transition-all uppercase tracking-[0.2em] shadow-lg shadow-red-100/50">
              Báo cáo Tối ưu hóa
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bảng chuyến bay */}
      <motion.div variants={itemVariants} className="glass-card rounded-[32px] shadow-xl shadow-gray-200/20 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Giám sát Điều phối</h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Kiểm soát hoạt động sân đỗ trực tiếp</p>
          </div>
          <button className="px-6 py-3 text-[10px] font-black text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest border border-gray-100">
            Xem Nhật ký
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-6">Mã Tàu bay</th>
                <th className="px-10 py-6">Tuyến vận hành</th>
                <th className="px-10 py-6">Giờ Dự kiến</th>
                <th className="px-10 py-6">Cửa</th>
                <th className="px-10 py-6">Trạng thái</th>
                <th className="px-10 py-6 text-right">Lượng khách</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topFlights.map((flight, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center border border-brand-primary/5">
                        <Plane className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-sm font-black text-gray-900">{flight.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-gray-900 tracking-widest">{flight.origin}</span>
                      <div className="flex-1 w-8 border-t border-dashed border-gray-200" />
                      <span className="text-xs font-black text-gray-900 tracking-widest">{flight.dest}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-sm font-black text-gray-500">{flight.time}</td>
                  <td className="px-10 py-5">
                    <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black tracking-widest">CỬA {flight.gate}</span>
                  </td>
                  <td className="px-10 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-2",
                      flight.status === 'Đúng giờ' && "bg-green-50 text-green-600 border border-green-100",
                      flight.status === 'Chậm chuyến' && "bg-red-50 text-red-600 border border-red-100",
                      flight.status === 'Đang lên máy bay' && "bg-blue-50 text-blue-600 border border-blue-100",
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                        flight.status === 'Đúng giờ' ? "bg-green-600" : 
                        flight.status === 'Chậm chuyến' ? "bg-red-600" : "bg-blue-600"
                      )} />
                      {flight.status}
                    </span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-xs font-black text-gray-900">{flight.seats}</span>
                       <div className="w-16 h-1 bg-gray-50 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary w-[85%]" />
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
