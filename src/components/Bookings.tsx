import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2, 
  Printer, 
  Mail,
  ChevronRight,
  Plane,
  CheckCircle2,
  Clock,
  Ticket as TicketIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/hooks/useToast';
import ToastContainer from './ui/Toast';

// Booking Flow Screens
import SearchFlight from './booking-flow/SearchFlight';
import SelectFlight from './booking-flow/SelectFlight';
import PendingBooking from './booking-flow/PendingBooking';
import PassengerInfo from './booking-flow/PassengerInfo';
import SeatReservation from './booking-flow/SeatReservation';
import PaymentScreen from './booking-flow/PaymentScreen';
import ConfirmationScreen from './booking-flow/ConfirmationScreen';
import TicketView from './booking-flow/TicketView';

import { useFirestoreCollection } from '@/src/hooks/useFirebase';

const INITIAL_BOOKINGS = [
  { pnr: 'JJXL92', passenger: 'Le Van Quan', flight: 'JJ121', route: 'SGN-HAN', seat: '12A', paymentStatus: 'Paid', status: 'Confirmed', price: 120, date: '14 May 2026' },
  { pnr: 'JJAS21', passenger: 'Nguyen Thu Ha', flight: 'JJ342', route: 'HAN-DAD', seat: '04C', paymentStatus: 'Unpaid', status: 'Pending', price: 85, date: '15 May 2026' },
  { pnr: 'JJPQ88', passenger: 'Tran Van Binh', flight: 'JJ551', route: 'SGN-PQC', seat: '22F', paymentStatus: 'Paid', status: 'Confirmed', price: 95, date: '14 May 2026' },
];

export type BookingStep = 'dashboard' | 'search' | 'select' | 'pending' | 'passenger' | 'seat' | 'payment' | 'confirm' | 'ticket';

export default function Bookings() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('dashboard');
  const { data: firestoreBookings, loading, addItem } = useFirestoreCollection<any>('bookings');
  const [bookingData, setBookingData] = useState<any>({});
  const { toasts, showToast } = useToast();

  const handleStartBooking = () => setCurrentStep('search');
  const handleNextStep = (next: BookingStep, data: any = {}) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
    setCurrentStep(next);
  };

  const handleFinalizeBooking = async (finalData: any) => {
    const newBooking = {
      pnr: 'JJ' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      passenger: finalData.passenger.name,
      flight: finalData.flight.number,
      route: `${finalData.flight.origin}-${finalData.flight.destination}`,
      seat: finalData.seats.join(', '),
      paymentStatus: 'Paid',
      status: 'Confirmed',
      price: finalData.totalPrice,
      date: finalData.flight.date || new Date().toISOString().split('T')[0]
    };
    await addItem(newBooking);
    setCurrentStep('confirm');
    showToast(`Đặt chỗ ${newBooking.pnr} đã được xác nhận thành công!`);
  };

  const allBookings = useMemo(() => {
    // Merge initial mock data with firestore data
    const existingPnr = new Set(firestoreBookings.map(b => b.pnr));
    const uniqueInitial = INITIAL_BOOKINGS.filter(b => !existingPnr.has(b.pnr));
    return [...firestoreBookings, ...uniqueInitial].sort((a, b) => b.pnr.localeCompare(a.pnr));
  }, [firestoreBookings]);

  return (
    <div className="p-8">
      <ToastContainer toasts={toasts} />
      
      <AnimatePresence mode="wait">
        {currentStep === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Đặt chỗ</h2>
                <p className="text-sm text-gray-400 mt-1">Theo dõi và quản lý danh sách hành khách đặt vé</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                  <Download className="w-4 h-4" /> Xuất dữ liệu
                </button>
                <button 
                  onClick={handleStartBooking}
                  className="flex items-center gap-2 px-8 py-3 jj-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" /> Đặt chỗ Mới
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo mã PNR, tên khách, email hoặc số hiệu bay..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <select className="bg-gray-50 border-none rounded-2xl px-6 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer">
                  <option>Tất cả trạng thái</option>
                  <option>Đã xác nhận</option>
                  <option>Đang chờ</option>
                  <option>Đã hủy</option>
                </select>
                <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-brand-primary transition-all">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="glass-card rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã PNR</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hành khách</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chuyến bay / Tuyến</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Số ghế</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allBookings.map((b: any, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="font-black text-brand-primary text-xs tracking-widest">{b.pnr}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-gray-900">{b.passenger}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{b.date}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-black text-gray-800">{b.flight}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{b.route}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 bg-slate-900 text-white w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            <Plane className="w-3 h-3" /> {b.seat}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            b.paymentStatus === 'Paid' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {b.paymentStatus === 'Paid' ? 'Đã trả' : 'Chờ trả'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            b.status === 'Confirmed' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                          )}>
                            {b.status === 'Confirmed' ? 'Thành công' : 'Đang xử lý'}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-gray-900 text-sm">${b.price}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 text-gray-400 hover:text-brand-primary transition-all rounded-xl hover:bg-gray-50"><Eye className="w-4 h-4" /></button>
                             <button className="p-2 text-gray-400 hover:text-blue-500 transition-all rounded-xl hover:bg-gray-50"><Edit2 className="w-4 h-4" /></button>
                             <button className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-xl hover:bg-gray-50"><Printer className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Wizard Screens */}
        {currentStep === 'search' && <SearchFlight onNext={(data) => handleNextStep('select', data)} onBack={() => setCurrentStep('dashboard')} />}
        {currentStep === 'select' && <SelectFlight flightData={bookingData} onNext={(data) => handleNextStep('pending', data)} onBack={() => setCurrentStep('search')} />}
        {currentStep === 'pending' && <PendingBooking onComplete={() => setCurrentStep('passenger')} />}
        {currentStep === 'passenger' && <PassengerInfo onNext={(data) => handleNextStep('seat', data)} onBack={() => setCurrentStep('select')} />}
        {currentStep === 'seat' && <SeatReservation onNext={(data) => handleNextStep('payment', data)} onBack={() => setCurrentStep('passenger')} />}
        {currentStep === 'payment' && <PaymentScreen bookingData={bookingData} onNext={handleFinalizeBooking} onBack={() => setCurrentStep('seat')} />}
        {currentStep === 'confirm' && <ConfirmationScreen data={bookingData} onNext={() => handleNextStep('ticket')} />}
        {currentStep === 'ticket' && <TicketView data={bookingData} onFinish={() => setCurrentStep('dashboard')} />}
      </AnimatePresence>
    </div>
  );
}
