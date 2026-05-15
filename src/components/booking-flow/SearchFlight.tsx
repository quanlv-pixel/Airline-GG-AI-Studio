import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, Briefcase, ArrowRight, Plane } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SearchFlightProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const FEATURED_FLIGHTS = [
  { id: 1, number: 'JJ101', type: 'Airbus A321 Neo', origin: 'SGN', destination: 'HAN', depTime: '08:00', arrTime: '10:15', duration: '2h 15m', seats: 42, price: 120, status: 'On Time' },
  { id: 2, number: 'JJ205', type: 'Boeing 787-9', origin: 'SGN', destination: 'HAN', depTime: '12:30', arrTime: '14:45', duration: '2h 15m', seats: 12, price: 185, status: 'On Time' },
  { id: 3, number: 'JJ309', type: 'Airbus A321 Neo', origin: 'SGN', destination: 'HAN', depTime: '18:45', arrTime: '21:00', duration: '2h 15m', seats: 156, price: 95, status: 'Delayed' },
];

export default function SearchFlight({ onNext, onBack }: SearchFlightProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Tìm kiếm Chuyến bay</h3>
          <p className="text-sm text-gray-400 mt-1">Bước 1: Chọn điểm khởi hành và thời gian</p>
        </div>
        <button onClick={onBack} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary transition-all">Quay lại</button>
      </div>

      <div className="glass-card p-10 rounded-[40px] shadow-2xl shadow-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <SearchField icon={<MapPin className="w-4 h-4" />} label="Điểm đi" placeholder="SGN (TP. Hồ Chí Minh)" />
          <SearchField icon={<MapPin className="w-4 h-4" />} label="Điểm đến" placeholder="HAN (Hà Nội)" />
          <SearchField icon={<Calendar className="w-4 h-4" />} label="Ngày đi" placeholder="14/05/2026" />
          <SearchField icon={<Users className="w-4 h-4" />} label="Hành khách" placeholder="1 người lớn" />
          <SearchField icon={<Briefcase className="w-4 h-4" />} label="Hạng ghế" placeholder="Phổ thông" />
        </div>
        <button className="w-full mt-8 py-5 jj-gradient text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3">
          <Search className="w-4 h-4" /> Tìm kiếm chuyến bay
        </button>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Kết quả tìm kiếm (3 chuyến bay khả dụng)</h4>
        <div className="grid gap-4">
          {FEATURED_FLIGHTS.map((flight) => (
            <motion.div 
              key={flight.id}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-6 md:p-8 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer"
              onClick={() => onNext({ flight })}
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 -rotate-12 group-hover:rotate-0 transition-transform">
                  <Plane className="text-white w-7 h-7 -rotate-45" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900 leading-none">{flight.number}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5">{flight.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-12 flex-1 justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">{flight.depTime}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flight.origin}</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-8 relative flex-1 max-w-[150px]">
                  <p className="text-[9px] font-black text-gray-300 uppercase">{flight.duration}</p>
                  <div className="w-full border-t-2 border-dashed border-gray-100" />
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                    <span className="text-[8px] font-black text-brand-primary uppercase">Trực tiếp</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">{flight.arrTime}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flight.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase">Chỉ từ</p>
                  <p className="text-2xl font-black text-brand-primary">${flight.price}</p>
                </div>
                <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-brand-primary transition-colors flex items-center gap-2">
                  Chọn <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SearchField({ icon, label, placeholder }: { icon: React.ReactNode, label: string, placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black outline-none focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/20 transition-all placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
