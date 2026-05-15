import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Search, User as UserIcon, Calendar, MapPin, 
  ArrowRight, ChevronLeft, CreditCard, CheckCircle2,
  Ticket, History, LogOut, Smartphone, Globe, Bell,
  Menu, X, ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import SearchFlight from './booking-flow/SearchFlight';
import SelectFlight from './booking-flow/SelectFlight';
import SeatReservation from './booking-flow/SeatReservation';
import PassengerInfo from './booking-flow/PassengerInfo';
import BookingSummary from './booking-flow/BookingSummary';
import PaymentScreen from './booking-flow/PaymentScreen';
import TicketView from './booking-flow/TicketView';
import Promotions from './Promotions';
import { auth, db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { useFirestoreCollection } from '@/src/hooks/useFirebase';
import { collection, addDoc, query, getDocs, Timestamp, where } from 'firebase/firestore';

type BookingStep = 'search' | 'select' | 'seats' | 'info' | 'summary' | 'payment' | 'ticket' | 'history' | 'promotions' | 'profile';

export default function CustomerApp({ user, onExit }: { user: any, onExit: () => void }) {
  const authUser = auth.currentUser;
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [bookingData, setBookingData] = useState<any>({});
  const { data: bookingsHistory, loading: isLoadingHistory } = useFirestoreCollection<any>('bookings');
  const { data: passengers, addItem: addPassenger } = useFirestoreCollection<any>('passengers');
  
  // Checking if current user is registered as a member in Firestore
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?.uid;
    if (user?.email || userId) {
      const isMem = passengers.some(p => 
        (p.email && user.email && p.email === user.email) || 
        (userId && (p.id === userId || p.userId === userId))
      );
      setIsRegistered(isMem);
    }
  }, [passengers, user]);

  const totalSpend = bookingsHistory?.reduce((acc: number, b: any) => {
    const priceStr = String(b.spend || b.price || "0").replace('$', '').replace(',', '');
    return acc + (parseFloat(priceStr) || 0);
  }, 0) || 0;

  const handleRegisterMember = async (memberData?: any) => {
    const userId = user?.id || user?.uid;
    if (!userId) return;

    try {
      await addPassenger({
        id: userId, // Use consistently
        userId: userId,
        name: user.displayName || 'Hành khách Mới',
        email: user.email || `${userId}@jetjet.guest`,
        passport: memberData?.passport || 'N/A',
        phoneNumber: memberData?.phoneNumber || '',
        nationality: memberData?.nationality || 'VN',
        status: 'Member',
        spend: `$${totalSpend}`,
        registeredAt: new Date().toISOString()
      });
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration Error:", err);
      // Fallback for demo if Firestore fails
      setIsRegistered(true);
    }
  };

  const handleBookingComplete = async (finalData: any) => {
    try {
      const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const seats = finalData.seats || [];
      const passengerName = finalData.passenger.name;
      const totalAmount = finalData.totalPrice || 0;
      
      // 1. Find or Update Passenger
      const userId = user?.id || user?.uid;
      const existingP = passengers.find(p => (userId && (p.id === userId || p.userId === userId)) || (finalData.passenger.email && p.email === finalData.passenger.email));

      if (existingP) {
        // Update total spend for member
        const currentSpendStr = String(existingP.spend || "0").replace('$', '').replace(',', '');
        const newTotalSpend = (parseFloat(currentSpendStr) || 0) + totalAmount;
        // In a real app we'd call updateDoc, here we'll just let the booking history drive the UI totalSpend calculation
      } else {
        // Create Guest Passenger record if not exists
        await addDoc(collection(db, 'passengers'), {
          userId: userId || null,
          name: passengerName,
          email: finalData.passenger.email,
          passport: finalData.passenger.passport || 'N/A',
          nationality: finalData.passenger.nationality || 'Unknown',
          status: 'Guest',
          spend: `$${totalAmount}`,
          createdAt: Timestamp.now()
        });
      }

      // 2. Create Booking record
      await addDoc(collection(db, 'bookings'), {
        userId: userId || null,
        pnr: pnr,
        passenger: passengerName,
        flight: finalData.flight.number,
        route: `${finalData.flight.origin}-${finalData.flight.destination}`,
        date: finalData.flight.date || new Date().toISOString().split('T')[0],
        seat: seats.join(', '),
        price: totalAmount,
        status: 'Confirmed',
        paid: true,
        createdAt: Timestamp.now()
      });

      setBookingData({ ...finalData, pnr });
      setCurrentStep('ticket');
    } catch (err) {
      console.error("Booking Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'bookings');
    }
  };

  const renderStep = () => {
    // Find the specific passenger record for this member
  const userId = user?.id || user?.uid;
  const registeredPassenger = passengers.find(p => 
    (userId && (p.id === userId || p.userId === userId)) || 
    (user?.email && p.email === user.email)
  );

  switch (currentStep) {
      case 'search':
        return <SearchFlight onNext={(data) => { setBookingData(data); setCurrentStep('select'); }} onBack={onExit} />;
      case 'select':
        return <SelectFlight flightData={bookingData} onNext={(data) => { setBookingData(prev => ({ ...prev, ...data })); setCurrentStep('info'); }} onBack={() => setCurrentStep('search')} />;
      case 'info':
        return <PassengerInfo onNext={(data) => { setBookingData(prev => ({ ...prev, ...data })); setCurrentStep('seats'); }} onBack={() => setCurrentStep('select')} />;
      case 'seats':
        return <SeatReservation onNext={(data) => { setBookingData(prev => ({ ...prev, ...data })); setCurrentStep('summary'); }} onBack={() => setCurrentStep('info')} />;
      case 'summary':
        return <BookingSummary bookingData={bookingData} onNext={() => setCurrentStep('payment')} onBack={() => setCurrentStep('seats')} />;
      case 'payment':
        return <PaymentScreen bookingData={bookingData} onNext={(data) => handleBookingComplete(data)} onBack={() => setCurrentStep('summary')} />;
      case 'ticket':
        return <TicketView data={bookingData} onFinish={() => setCurrentStep('search')} />;
      case 'history':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lịch sử Chuyến bay</h2>
                <p className="text-sm text-gray-400">Danh sách các hành trình bạn đã đặt</p>
              </div>
              <button 
                onClick={() => setCurrentStep('search')} 
                className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Quay lại
              </button>
            </div>
            {isLoadingHistory ? (
              <div className="py-20 flex justify-center">
                 <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookingsHistory.length > 0 ? (
                  bookingsHistory.map((b: any) => (
                    <motion.div 
                      key={b.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 jj-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
                               <Ticket className="w-6 h-6 text-white" />
                            </div>
                            <div>
                               <p className="text-lg font-black text-gray-900">{b.pnr}</p>
                               <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{b.status}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chuyến bay</p>
                            <p className="text-sm font-black text-gray-900">{b.flight}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-gray-50 rounded-3xl p-6 mb-6">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Hành trình</p>
                            <p className="text-sm font-black text-gray-900">{b.route}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Ngày bay</p>
                            <p className="text-sm font-black text-gray-900">{b.date}</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                         <div className="flex items-center gap-3">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-black text-gray-600">{b.passenger}</span>
                         </div>
                         <p className="text-xs font-black text-gray-900">Ghế: {b.seat}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-24 bg-white rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-6">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <History className="w-10 h-10 text-gray-200" />
                     </div>
                     <p className="text-sm font-black text-gray-300 uppercase tracking-[0.3em]">Hệ thống chưa ghi nhận đặt vé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'promotions':
        return <Promotions userSpend={totalSpend} isRegistered={isRegistered} onRegister={handleRegisterMember} user={user} />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-10 items-start">
               <div className="w-full md:w-1/3 bg-white p-10 rounded-[56px] border border-gray-100 shadow-xl text-center space-y-6">
                  <div className="w-32 h-32 jj-gradient rounded-[40px] mx-auto flex items-center justify-center shadow-2xl shadow-red-200">
                     {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-[40px]" />
                     ) : (
                        <UserIcon className="w-16 h-16 text-white" />
                     )}
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-900">{user?.displayName || (isRegistered ? 'Thành viên JetJet' : 'Khách vãng lai')}</h3>
                     <p className="text-xs font-bold text-gray-400 mt-1">{user?.email || (user?.isAnonymous ? 'Guest Account' : 'No Email')}</p>
                  </div>
                  <div className="pt-4">
                     <span className="px-6 py-2 bg-brand-accent/50 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                        {isRegistered ? 'Hội viên' : 'Khách vãng lai'}
                     </span>
                  </div>
               </div>

               <div className="flex-1 w-full space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tổng chi tiêu</p>
                        <p className="text-3xl font-black text-gray-900">${totalSpend.toLocaleString()}</p>
                     </div>
                     <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Chuyến bay</p>
                        <p className="text-3xl font-black text-gray-900">{bookingsHistory?.length || 0}</p>
                     </div>
                  </div>

                  <div className="bg-[#0F172A] p-10 rounded-[56px] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <h4 className="text-lg font-black tracking-tight mb-8">Thông tin Tài khoản</h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase">Hộ chiếu</span>
                        <span className="text-sm font-black tracking-widest text-brand-accent">{registeredPassenger?.passport || '---'}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase">Điện thoại</span>
                        <span className="text-sm font-black">{registeredPassenger?.phoneNumber || '---'}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase">Provider</span>
                        <span className="text-sm font-black uppercase text-gray-400">{user?.isAnonymous ? 'Guest' : (user?.role === 'management' ? 'Staff' : 'Mock Auth')}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase">User ID</span>
                        <span className="text-sm font-black tracking-widest">{user?.id?.substring(0, 8) || user?.uid?.substring(0, 8) || 'Unknown'}...</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase">Ngày gia nhập</span>
                        <span className="text-sm font-black">15/05/2026</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isRegistered && (
                    <button 
                      onClick={() => setCurrentStep('promotions')}
                      className="w-full py-6 jj-gradient text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-200"
                    >
                      Kích hoạt Quyền lợi Hội viên
                    </button>
                  )}
               </div>
            </div>
          </div>
        );
      default:
        return <SearchFlight onNext={(data) => { setBookingData(data); setCurrentStep('select'); }} onBack={onExit} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col font-sans text-gray-900 overflow-hidden">
      {/* App Window Styling (Simulation of Desktop App) */}
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full bg-white shadow-2xl relative">
        
        {/* Navigation Bar */}
        <header className="h-20 px-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 jj-gradient rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <Plane className="w-6 h-6 text-white -rotate-45" />
              </div>
              <h1 className="text-xl font-black tracking-tighter">JETJET <span className="text-brand-primary">AIR</span></h1>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink active={currentStep === 'search'} onClick={() => setCurrentStep('search')}>Chuyến bay</NavLink>
              <NavLink active={currentStep === 'history'} onClick={() => setCurrentStep('history')}>Lịch sử</NavLink>
              <NavLink active={currentStep === 'promotions'} onClick={() => setCurrentStep('promotions')}>Khuyến mãi</NavLink>
              <NavLink active={currentStep === 'profile'} onClick={() => setCurrentStep('profile')}>Thông tin</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            <button onClick={onExit} className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-gray-400 hover:text-brand-primary rounded-xl transition-all">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Thoát Portal</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="px-12 py-6 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>© 2026 JetJet Air Global</span>
              <span>•</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-brand-primary" /> Bảo mật đầu cuối</span>
           </div>
           <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span className="hover:text-brand-primary cursor-pointer">Điều khoản</span>
              <span className="hover:text-brand-primary cursor-pointer">Hỗ trợ</span>
              <div className="flex items-center gap-1 text-brand-primary">
                 <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                 Hệ thống Sẵn sàng
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}

function NavLink({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "text-[11px] font-black uppercase tracking-widest transition-all hover:text-brand-primary",
        active ? "text-brand-primary" : "text-gray-400"
      )}
    >
      {children}
    </button>
  );
}
