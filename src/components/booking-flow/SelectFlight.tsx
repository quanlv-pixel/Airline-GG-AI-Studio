import React from 'react';
import { motion } from 'motion/react';
import { Plane, Map, Clock, Info, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SelectFlightProps {
  flightData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function SelectFlight({ flightData, onNext, onBack }: SelectFlightProps) {
  const flight = flightData.flight;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-primary transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết Chuyến bay</h3>
          <p className="text-sm text-gray-400">Bước 2: Xác nhận lịch trình dự kiến</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
             
             <div className="relative z-10 space-y-12">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                     <Plane className="text-white w-6 h-6 -rotate-45" />
                   </div>
                   <div>
                     <p className="text-lg font-black text-gray-900">{flight.number}</p>
                     <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{flight.type}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</p>
                   <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase mt-1 inline-block">Đang mở bán</span>
                 </div>
               </div>

               <div className="flex items-center justify-between py-10">
                 <div className="space-y-2">
                   <p className="text-5xl font-black text-gray-900">{flight.depTime}</p>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">{flight.origin}</p>
                   <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Tân Sơn Nhất (Ga quốc nội)</p>
                 </div>

                 <div className="flex-1 px-16 relative flex flex-col items-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">{flight.duration}</p>
                    <div className="w-full border-t-2 border-dashed border-gray-100" />
                    <div className="w-12 h-12 bg-white border-2 border-gray-50 rounded-full flex items-center justify-center absolute left-1/2 -top-1 -translate-x-1/2 -translate-y-1/2 shadow-sm">
                      <Plane className="text-brand-primary w-5 h-5" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest underline underline-offset-4 decoration-brand-primary/30">Bay thẳng (Direct)</span>
                    </div>
                 </div>

                 <div className="space-y-2 text-right">
                   <p className="text-5xl font-black text-gray-900">{flight.arrTime}</p>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">{flight.destination}</p>
                   <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Nội Bài (Ga quốc nội)</p>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-50">
                 <DetailItem icon={<Map className="w-4 h-4" />} label="Lộ trình" value="7,240 km / 4,498 miles" />
                 <DetailItem icon={<Clock className="w-4 h-4" />} label="Dự kiến" value="Đúng giờ (On-time)" />
                 <DetailItem icon={<ShieldCheck className="w-4 h-4" />} label="Bảo hiểm" value="Đã bao gồm trong giá" />
               </div>
             </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] bg-blue-50/50 border border-blue-100 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-tight">Quy định về Hành lý</p>
              <ul className="mt-2 space-y-1">
                <li className="text-[10px] text-blue-500 font-medium">• Miễn phí 07kg hành lý xách tay.</li>
                <li className="text-[10px] text-blue-500 font-medium">• Ưu đãi mua thêm hành lý ký gửi ngay khi đặt chỗ.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 space-y-8">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">Tổng kết Chi phí</h4>
            
            <div className="space-y-4">
              <PriceRow label="Giá vé cơ bản" value={flight.price} />
              <PriceRow label="Thuế & Phí sân bay" value={45} />
              <PriceRow label="Phí quản trị hệ thống" value={12} />
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-4xl font-black text-gray-900">${flight.price + 45 + 12}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNext({ totalPrice: flight.price + 57 })}
              className="w-full py-5 jj-gradient text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Tiếp tục đặt chỗ <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="px-8 flex items-center gap-4 py-2 opacity-50">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Giá vé có thể thay đổi sau 10 phút</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-[11px] font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold text-gray-400">{label}</span>
      <span className="text-sm font-black text-gray-900">${value}</span>
    </div>
  );
}
