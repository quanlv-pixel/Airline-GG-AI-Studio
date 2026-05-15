import React from 'react';
import { motion } from 'motion/react';
import { Plane, User, Armchair, CreditCard, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BookingSummaryProps {
  bookingData: any;
  onNext: () => void;
  onBack: () => void;
}

export default function BookingSummary({ bookingData, onNext, onBack }: BookingSummaryProps) {
  const { flight, seats, seatPrice, passenger, totalPrice } = bookingData;

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
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Xác nhận Thông tin</h3>
          <p className="text-sm text-gray-400">Vui lòng kiểm tra kỹ trước khi thanh toán</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Details */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-brand-primary" />
                <h4 className="text-sm font-black uppercase tracking-tight">Chi tiết Chuyến bay</h4>
             </div>
             <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl">
                <div>
                   <p className="text-2xl font-black text-gray-900">{flight.depTime}</p>
                   <p className="text-sm font-black text-gray-400">{flight.origin}</p>
                </div>
                <div className="flex flex-col items-center flex-1 px-10">
                   <p className="text-[10px] font-black text-gray-300 uppercase mb-2">{flight.duration}</p>
                   <div className="w-full border-t-2 border-dashed border-gray-200" />
                   <Plane className="w-4 h-4 text-brand-primary mt-2" />
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-gray-900">{flight.arrTime}</p>
                   <p className="text-sm font-black text-gray-400">{flight.destination}</p>
                </div>
             </div>
          </div>

          {/* Passenger & Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                   <User className="w-5 h-5 text-brand-primary" />
                   <h4 className="text-sm font-black uppercase tracking-tight">Hành khách</h4>
                </div>
                <div className="space-y-2">
                   <p className="text-lg font-black text-gray-900">{passenger.name}</p>
                   <p className="text-xs font-medium text-gray-400">{passenger.email}</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                   <Armchair className="w-5 h-5 text-brand-primary" />
                   <h4 className="text-sm font-black uppercase tracking-tight">Chỗ ngồi</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                   {seats.map((seatId: string) => (
                     <span key={seatId} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-black">{seatId}</span>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
             <h4 className="text-xl font-black text-gray-900">Chi tiết Thanh toán</h4>
             
             <div className="space-y-4">
                <PriceRow label="Giá vé máy bay" value={flight.price} />
                <PriceRow label="Phí chọn ghế" value={seatPrice} />
                <PriceRow label="Thuế & Phí dịch vụ" value={57} />
                <div className="pt-6 border-t border-gray-100">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng thanh toán</span>
                      <span className="text-4xl font-black text-brand-primary">${totalPrice + seatPrice}</span>
                   </div>
                </div>
             </div>

             <button 
               onClick={onNext}
               className="w-full py-5 jj-gradient text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
             >
               Thanh toán ngay <CreditCard className="w-4 h-4" />
             </button>
          </div>

          <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
             <p className="text-[10px] text-green-700 font-medium leading-relaxed">Giao dịch của bạn được bảo mật bởi chuẩn mã hóa quốc tế SSL/TLS 1.2</p>
          </div>
        </div>
      </div>
    </motion.div>
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
