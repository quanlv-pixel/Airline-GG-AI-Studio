import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Armchair, Coffee, Disc, User, ChevronLeft, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SeatReservationProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Seat {
  id: string;
  type: 'economy' | 'business';
  status: 'available' | 'reserved' | 'selected' | 'booked';
  price: number;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const INITIAL_SEATS = (() => {
  const seats: Seat[] = [];
  for (let r = 1; r <= 30; r++) {
    for (const c of COLS) {
      const isBusiness = r <= 3;
      const rand = Math.random();
      seats.push({
        id: `${r}${c}`,
        type: isBusiness ? 'business' : 'economy',
        status: rand < 0.2 ? 'booked' : rand < 0.25 ? 'reserved' : 'available',
        price: isBusiness ? 150 : (r === 12 || r === 13) ? 45 : 25
      });
    }
  }
  return seats;
})();

export default function SeatReservation({ onNext, onBack }: SeatReservationProps) {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);

  const toggleSeat = (id: string) => {
    setSeats(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (s.status === 'booked' || s.status === 'reserved') return s;
      return { ...s, status: s.status === 'selected' ? 'available' : 'selected' };
    }));
  };

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

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
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sơ đồ Chỗ ngồi</h3>
          <p className="text-sm text-gray-400">Bước 5: Lựa chọn vị trí yêu thích</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Seat Map Area */}
        <div className="flex-1 glass-card p-10 rounded-[48px] bg-white shadow-2xl shadow-gray-100/50 relative overflow-hidden">
          <div className="flex flex-col items-center bg-gray-50/50 rounded-[40px] py-16 px-4 border border-gray-100 relative overflow-x-auto custom-scrollbar h-[800px]">
             <div className="min-w-[450px] flex flex-col items-center">
                {/* Nose */}
                <div className="w-56 h-16 bg-white border border-gray-100 rounded-t-[80px] rounded-b-2xl flex items-center justify-center shadow-sm mb-12 relative">
                  <div className="absolute -top-1 w-24 h-1 bg-gray-200 rounded-full blur-[1px]" />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Tổ lái / Cockpit</span>
                </div>

                {/* Legend Indicators */}
                <div className="flex items-center gap-8 mb-12">
                   <LegendItem color="bg-white border-gray-200" label="Trống" />
                   <LegendItem color="bg-yellow-400" label="Đang chờ" />
                   <LegendItem color="bg-brand-primary" label="Đang chọn" />
                   <LegendItem color="bg-gray-200" label="Đã đặt" isBooked />
                </div>

                <div className="flex flex-col gap-3">
                  {Array.from({ length: 30 }).map((_, rowIndex) => {
                    const rowNum = rowIndex + 1;
                    const isBusiness = rowNum <= 3;
                    const isExit = rowNum === 12 || rowNum === 13;

                    return (
                      <React.Fragment key={rowNum}>
                        {isExit && rowIndex === 11 && (
                          <div className="flex items-center justify-between px-6 py-2 my-2 border-y border-dashed border-red-100 bg-red-50/30 rounded-xl">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap">Lối thoát hiểm / Exit Row</span>
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap">Lối thoát hiểm / Exit Row</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-[11px] font-black text-gray-400 text-center">{rowNum}</div>
                          <div className="flex items-center gap-2">
                            {COLS.map((col, colIdx) => {
                              const seatId = `${rowNum}${col}`;
                              const seat = seats.find(s => s.id === seatId)!;
                              const isSelected = seat.status === 'selected';
                              const isBooked = seat.status === 'booked';
                              const isReserved = seat.status === 'reserved';

                              return (
                                <React.Fragment key={col}>
                                  <motion.button
                                    whileHover={(!isBooked && !isReserved) ? { scale: 1.1, y: -2 } : {}}
                                    onClick={() => toggleSeat(seatId)}
                                    disabled={isBooked || isReserved}
                                    className={cn(
                                       "w-10 h-11 rounded-xl flex flex-col items-center justify-center transition-all relative border-b-4",
                                       isBooked ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed" :
                                       isReserved ? "bg-yellow-100 border-yellow-200 text-yellow-600" :
                                       isSelected ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-red-200" :
                                       isBusiness ? "bg-slate-900 border-slate-700 text-slate-400 hover:text-white" :
                                       "bg-white border-gray-200 text-gray-400 hover:border-brand-primary"
                                    )}
                                  >
                                    <Armchair className={cn("w-4 h-4", isSelected ? "text-white" : "text-current opacity-40")} />
                                    <span className="text-[8px] font-black mt-0.5">{col}</span>
                                  </motion.button>
                                  {colIdx === 2 && <div className="w-12 flex items-center justify-center"><User className="w-3 h-3 text-gray-200" /></div>}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
             </div>
          </div>
        </div>

        {/* Selected Seats Summary */}
        <div className="lg:w-[400px] space-y-6">
          <div className="glass-card p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 space-y-8">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">Ghế đã chọn</h4>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(seat => (
                    <motion.div 
                      key={seat.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg",
                          seat.type === 'business' ? "bg-slate-900 text-yellow-500" : "bg-white text-brand-primary"
                        )}>
                          {seat.id}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{seat.type === 'business' ? 'Hạng Thương gia' : 'Hạng Phổ thông'}</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">{seat.id.startsWith('12') || seat.id.startsWith('13') ? 'Lối thoát hiểm' : 'Tiêu chuẩn'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-gray-900">${seat.price}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center space-y-3">
                    <Armchair className="w-10 h-10 text-gray-200 mx-auto" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-10">Vui lòng chọn chỗ ngồi trên sơ đồ máy bay</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Phụ phí ghế ngồi</span>
                 <span className="text-3xl font-black text-gray-900">${totalPrice}</span>
               </div>
               
               <button 
                 onClick={() => onNext({ seats: selectedSeats.map(s => s.id), seatPrice: totalPrice })}
                 disabled={selectedSeats.length === 0}
                 className={cn(
                   "w-full py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                   selectedSeats.length > 0 
                     ? "jj-gradient text-white shadow-2xl shadow-red-200 hover:scale-[1.02]" 
                     : "bg-gray-100 text-gray-400 cursor-not-allowed"
                 )}
               >
                 Xác nhận chỗ ngồi <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-[32px] bg-yellow-50 border border-yellow-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-[10px] text-yellow-700 font-medium leading-relaxed">Ghế lối thoát hiểm yêu cầu hành khách có sức khỏe và khả năng hỗ trợ trong trường hợp khẩn cấp.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LegendItem({ color, label, isBooked }: { color: string, label: string, isBooked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded-md shadow-sm", color)} />
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
