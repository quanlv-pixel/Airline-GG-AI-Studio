import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Plane, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  RefreshCw,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  Database,
  Mail,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const REVENUE_DATA = [
  { day: 'Thứ 2', revenue: 420000 },
  { day: 'Thứ 3', revenue: 580000 },
  { day: 'Thứ 4', revenue: 490000 },
  { day: 'Thứ 5', revenue: 720000 },
  { day: 'Thứ 6', revenue: 680000 },
  { day: 'Thứ 7', revenue: 850000 },
  { day: 'Chủ Nhật', revenue: 920000 },
];

const TOP_ROUTES = [
  { route: 'SGN \u2192 HAN', flights: 142, passengers: '24.2K', revenue: '$2.4M', loadFactor: '92%', status: 'Xuất sắc' },
  { route: 'SGN \u2192 ICN', flights: 86, passengers: '18.5K', revenue: '$4.1M', loadFactor: '88%', status: 'Xuất sắc' },
  { route: 'HAN \u2192 DAD', flights: 64, passengers: '10.8K', revenue: '$1.1M', loadFactor: '84%', status: 'Ổn định' },
  { route: 'DAD \u2192 PQC', flights: 42, passengers: '6.2K', revenue: '$0.8M', loadFactor: '78%', status: 'Ổn định' },
  { route: 'SGN \u2192 SIN', flights: 38, passengers: '5.4K', revenue: '$1.8M', loadFactor: '72%', status: 'Cảnh báo' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Statistics() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full bg-[#F6F7FB] px-6 py-4 space-y-4 font-sans overflow-hidden flex flex-col"
    >
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Thống kê & Phân tích</h2>
          <p className="text-[11px] text-[#9AA4B2] font-medium mt-0.5">Tổng quan hiệu suất thương mại</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white border border-[#ECEEF2] px-3 py-2 rounded-xl text-[11px] font-bold text-[#0F172A] hover:bg-gray-50 transition-all shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#9AA4B2]" />
            <span>30 ngày qua</span>
          </button>
          <button className="flex items-center gap-1.5 bg-[#FF3B4A] px-4 py-2 rounded-xl text-[11px] font-bold text-white shadow-md shadow-red-100 hover:scale-105 active:scale-95 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Tổng Doanh thu" value="$4.8M" change="+18.4%" isUp={true} icon={<DollarSign className="w-4 h-4" />} color="text-red-500" />
        <KPICard title="Tổng Chuyến bay" value="12,842" change="+8.2%" isUp={true} icon={<Plane className="w-4 h-4" />} color="text-blue-500" />
        <KPICard title="Hành khách" value="324K" change="+12.1%" isUp={true} icon={<Users className="w-4 h-4" />} color="text-purple-500" />
        <KPICard title="Hệ số lấp đầy" value="82%" change="+3.8%" isUp={true} icon={<TrendingUp className="w-4 h-4" />} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {/* 3. MAIN ANALYTICS AREA - LEFT */}
        <motion.div variants={itemVariants} className="col-span-2 bg-white p-5 rounded-[24px] shadow-sm border border-[#ECEEF2] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Hiệu suất Doanh thu</h3>
              <p className="text-[10px] font-bold text-[#9AA4B2] uppercase tracking-wide mt-0.5">Tổng quan hàng tuần</p>
            </div>
            <div className="flex items-center gap-1 bg-[#F6F7FB] p-1 rounded-lg">
               <button className="px-3 py-1 bg-white shadow-sm rounded-md text-[9px] font-black uppercase text-[#0F172A]">Doanh thu</button>
               <button className="px-3 py-1 text-[9px] font-black uppercase text-[#9AA4B2]">Chi phí</button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B4A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF3B4A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEEF2" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#9AA4B2' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#9AA4B2' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FF3B4A" strokeWidth={3} fill="url(#revenueGradient)" dot={{ fill: '#FF3B4A', strokeWidth: 1.5, r: 3, stroke: '#fff' }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 3. MAIN ANALYTICS AREA - RIGHT */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#ECEEF2] flex-1 min-h-0 flex flex-col">
            <h4 className="text-[10px] font-black text-[#9AA4B2] uppercase tracking-wider mb-4">Thông tin chi tiết</h4>
            <div className="space-y-2 flex-1">
              <InsightItem label="Tuyến Bay Số 1" value="SGN \u2192 ICN" color="bg-blue-50 text-blue-600" />
              <InsightItem label="Tỷ Lệ Lấp Đầy" value="96%" color="bg-green-50 text-green-600" />
              <InsightItem label="Trễ Chuyến" value="4" color="bg-orange-50 text-orange-600" />
              <InsightItem label="Giá Trung Bình" value="$312" color="bg-purple-50 text-purple-600" />
            </div>
          </div>
          <div className="bg-[#0F172A] p-5 rounded-[24px] shadow-lg relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
             <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Hiệu suất đội bay</p>
             <h4 className="text-md font-black text-white leading-tight">Hoạt động ở <span className="text-[#FF3B4A]">94%</span> công suất.</h4>
             <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-[#FF3B4A] rounded-full" />
             </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE TABLE & BOTTOM SECTION ROW */}
      <div className="grid grid-cols-3 gap-4 min-h-0 shrink-0">
        <motion.div variants={itemVariants} className="col-span-2 bg-white rounded-[24px] shadow-sm border border-[#ECEEF2] overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b border-[#ECEEF2] bg-gray-50/50 flex justify-between items-center">
             <h3 className="text-xs font-black text-[#0F172A] tracking-tight">Tuyến bay hàng đầu</h3>
             <span className="text-[9px] font-bold text-[#9AA4B2] uppercase tracking-wider">Trạng thái hệ số tải</span>
          </div>
          <div className="overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F6F7FB] border-b border-[#ECEEF2]">
                  <th className="px-6 py-2 text-[8px] font-black text-[#9AA4B2] uppercase tracking-widest">Tuyến</th>
                  <th className="px-6 py-2 text-[8px] font-black text-[#9AA4B2] uppercase tracking-widest text-center">Chuyến bay</th>
                  <th className="px-6 py-2 text-[8px] font-black text-[#9AA4B2] uppercase tracking-widest text-center">Tải</th>
                  <th className="px-6 py-2 text-[8px] font-black text-[#9AA4B2] uppercase tracking-widest text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF2]">
                {TOP_ROUTES.slice(0, 4).map((route, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#FF3B4A]" />
                        <span className="text-[11px] font-bold text-[#0F172A] truncate max-w-[120px]">{route.route}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-center text-[10px] font-bold text-[#0F172A]">{route.flights}</td>
                    <td className="px-6 py-2.5 text-center text-[10px] font-bold text-[#0F172A]">{route.loadFactor}</td>
                    <td className="px-6 py-2.5 text-right">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                        route.status === 'Xuất sắc' ? "bg-green-50 text-green-600" : 
                        route.status === 'Ổn định' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {route.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#ECEEF2] flex flex-col justify-between">
           <h3 className="text-xs font-black text-[#0F172A] tracking-tight mb-2">Trạng thái Hệ thống</h3>
           <div className="space-y-3">
              <SystemStatusItem label="Đặt vé" status="Trực tuyến" color="bg-green-500" icon={<Database className="w-3.5 h-3.5" />} />
              <SystemStatusItem label="Thanh toán" status="Ổn định" color="bg-green-500" icon={<ShieldCheck className="w-3.5 h-3.5" />} />
              <SystemStatusItem label="API Gateway" status="Khỏe mạnh" color="bg-green-500" icon={<Activity className="w-3.5 h-3.5" />} />
           </div>
        </div>
      </div>

      {/* 6. FOOTER */}
      <div className="flex justify-between items-center text-[#9AA4B2] text-[8px] font-black tracking-widest uppercase">
         <p>\u00A9 2026 JETJET AIR ANALYTICS</p>
         <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           <p>DỮ LIỆU THỜI GIAN THỰC</p>
         </div>
      </div>
    </motion.div>
  );
}

function KPICard({ title, value, change, isUp, icon, color }: { title: string, value: string, change: string, isUp: boolean, icon: React.ReactNode, color: string }) {
  return (
    <motion.div variants={itemVariants} className="bg-white p-4 rounded-[20px] shadow-sm border border-[#ECEEF2] hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-8 h-8 bg-[#F6F7FB] rounded-lg flex items-center justify-center group-hover:bg-[#FF3B4A] group-hover:text-white transition-all", color)}>
          {icon}
        </div>
        <div className={cn("flex items-center gap-0.5 text-[9px] font-black", isUp ? "text-green-500" : "text-red-500")}>
          {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {change}
        </div>
      </div>
      <p className="text-[9px] font-black text-[#9AA4B2] uppercase tracking-wider mb-0.5">{title}</p>
      <h3 className="text-xl font-black text-[#0F172A]">{value}</h3>
    </motion.div>
  );
}

function InsightItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-[#F6F7FB]/50 rounded-xl border border-[#ECEEF2]">
      <span className="text-[9px] font-black text-[#9AA4B2] uppercase tracking-[0.1em]">{label}</span>
      <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase", color)}>{value}</span>
    </div>
  );
}

function SystemStatusItem({ label, status, color, icon }: { label: string, status: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#F6F7FB] rounded-lg flex items-center justify-center text-[#9AA4B2]">
            {icon}
          </div>
          <span className="text-[11px] font-bold text-[#0F172A]">{label}</span>
       </div>
       <div className="flex items-center gap-1.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#0F172A]">{status}</span>
       </div>
    </div>
  );
}

