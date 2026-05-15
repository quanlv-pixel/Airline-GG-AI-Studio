import React, { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { Armchair, Coffee, Disc, MapPin, X, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Seat {
  id: string;
  type: 'business' | 'economy';
  status: 'available' | 'reserved' | 'selected';
  price: number;
}

const generateSeats = (rows: number, cols: string[]): Seat[] => {
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const isBusiness = r <= 3;
      seats.push({
        id: `${r}${c}`,
        type: isBusiness ? 'business' : 'economy',
        status: Math.random() < 0.25 ? 'reserved' : 'available',
        price: isBusiness ? 120 : 45
      });
    }
  }
  return seats;
};

const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const INITIAL_SEATS = generateSeats(15, COLS);

export default function SeatSelector() {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  const toggleSeat = (id: string) => {
    setSeats(prev => prev.map(s => {
      if (s.id === id) {
        if (s.status === 'available') return { ...s, status: 'selected' as const };
        if (s.status === 'selected') return { ...s, status: 'available' as const };
      }
      return s;
    }));
  };

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none">
      <div className="flex-1 glass-card p-6 md:p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sơ đồ Chuyến bay</h3>
              <p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.3em] mt-1">Airbus A321 Extended v2.0</p>
            </div>
            <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-100 w-fit">
              <button 
                onClick={() => setActiveTab('map')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'map' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400"
                )}
              >
                Trực quan
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === 'list' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400"
                )}
              >
                Danh sách
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <LegendItem color="bg-gray-100" label="Còn trống" border="border-gray-200" />
            <LegendItem color="bg-brand-primary" label="Đang chọn" />
            <LegendItem color="bg-gray-200" label="Đã đặt" isReserved />
          </div>

          <div className="flex flex-col items-center bg-gray-50/50 rounded-[40px] py-20 px-4 border border-gray-100 relative overflow-x-auto custom-scrollbar">
             {/* Dynamic Seat Grid Section */}
             <div className="flex flex-col items-center">
                {/* Aircraft Nose/Cockpit */}
                <div className="w-48 h-14 bg-white border border-gray-100 rounded-t-[60px] rounded-b-xl flex items-center justify-center shadow-sm mb-12 relative">
                  <div className="absolute -top-1 w-24 h-1 bg-gray-200 rounded-full blur-[1px]" />
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Cockpit</span>
                </div>

                {/* Exit/Utility indicators */}
                <div className="w-full max-w-[320px] flex justify-between mb-8">
                  <UtilityItem icon={<Coffee className="w-3.5 h-3.5" />} label="Bếp" />
                  <UtilityItem icon={<Disc className="w-3.5 h-3.5" />} label="WC" />
                </div>

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Column Indicators */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8" />
                    <div className="flex items-center gap-2">
                      {COLS.map((col, idx) => (
                        <React.Fragment key={col}>
                          <div className="w-10 text-center text-[10px] font-black text-gray-300">{col}</div>
                          {idx === 2 && <div className="w-10" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Seats Grid */}
                  {Array.from({ length: 15 }).map((_, rowIndex) => {
                    const rowNum = rowIndex + 1;
                    const isBusiness = rowNum <= 3;
                    const isExitRow = rowNum === 8;

                    return (
                      <div key={rowNum} className="flex flex-col gap-2">
                        {isExitRow && (
                          <div className="flex items-center justify-between px-4 py-2 my-2 border-y border-dashed border-red-100 bg-red-50/30 rounded-lg">
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest whitespace-nowrap">Lối thoát hiểm / Exit Row</span>
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest whitespace-nowrap">Lối thoát hiểm / Exit Row</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 text-[11px] font-black text-gray-400 text-center">{rowNum}</div>
                          <div className="flex items-center gap-2">
                            {COLS.map((col, colIdx) => {
                              const seatId = `${rowNum}${col}`;
                              const seat = seats.find(s => s.id === seatId)!;
                              const isReserved = seat.status === 'reserved';
                              const isSelected = seat.status === 'selected';

                              return (
                                <React.Fragment key={col}>
                                  <motion.button
                                    whileHover={!isReserved ? { scale: 1.05, translateY: -2 } : {}}
                                    whileTap={!isReserved ? { scale: 0.95 } : {}}
                                    onClick={() => !isReserved && toggleSeat(seatId)}
                                    disabled={isReserved}
                                    className={cn(
                                      "w-10 h-11 rounded-xl flex flex-col items-center justify-center transition-all relative border-b-4",
                                      isReserved 
                                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                                        : isSelected
                                          ? "bg-brand-primary text-white border-brand-primary shadow-xl shadow-red-200"
                                          : isBusiness
                                            ? "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                                            : "bg-white border-gray-200 text-gray-400 hover:border-brand-primary/30 shadow-sm"
                                    )}
                                  >
                                    {isReserved && <X className="w-3 h-3 absolute top-1 right-1 text-gray-300" />}
                                    {isBusiness && !isSelected && !isReserved && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />}
                                    <Armchair className={cn("w-4 h-4", isSelected ? "text-white" : isBusiness ? "text-slate-500" : "text-gray-300")} />
                                    <span className="text-[8px] font-black mt-0.5">{col}</span>
                                  </motion.button>
                                  {colIdx === 2 && <div className="w-10 flex items-center justify-center"><User className="w-3 h-3 text-gray-200" /></div>}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rear Exit */}
                <div className="mt-12 px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Cửa sau / Aft Exit</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      <div className="lg:w-[400px] flex flex-col gap-6">
        <div className="glass-card p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 space-y-8 h-fit">
          <div>
            <h4 className="text-xl font-black text-gray-900 tracking-tight">Chi tiết Chọn chỗ</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Hành lý & Ghế ngồi</p>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {selectedSeats.length > 0 ? (
                selectedSeats.map(seat => (
                  <motion.div 
                    key={seat.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black",
                        seat.type === 'business' ? "bg-slate-900 text-yellow-400" : "bg-white text-brand-primary"
                      )}>
                        {seat.id}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase">Hạng {seat.type === 'business' ? 'Thương gia' : 'Phổ thông'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Khu vực {parseInt(seat.id) <= 8 ? 'Phía trên' : 'Phía dưới'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">${seat.price}</p>
                      <button onClick={() => toggleSeat(seat.id)} className="text-[10px] font-black text-red-400 hover:text-red-500 transition-colors uppercase mt-1 opacity-0 group-hover:opacity-100">Bỏ chọn</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center space-y-4 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                    <Armchair className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-8">Vui lòng chọn chỗ ngồi trên sơ đồ</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng chi phí dự kiến</span>
              <span className="text-3xl font-black text-gray-900">${totalPrice}</span>
            </div>
            
            <button 
              disabled={selectedSeats.length === 0}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                selectedSeats.length > 0 
                  ? "jj-gradient text-white shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              Tiếp tục Thanh toán <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[32px] bg-brand-accent/30 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Chính sách Hoàn vé</p>
            <p className="text-[9px] text-gray-500 font-medium">Miễn phí thay đổi trước 24h đối với hạng Thương gia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, border = "", isReserved = false }: { color: string, label: string, border?: string, isReserved?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shadow-sm relative", color, border && `border ${border}`)}>
        {isReserved && <X className="w-3 h-3 text-gray-400" />}
      </div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">{label}</span>
    </div>
  );
}

function UtilityItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-brand-primary transition-colors shadow-sm">
        {icon}
      </div>
      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
    </div>
  );
}

