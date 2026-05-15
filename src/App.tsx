import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Flights from './components/Flights';
import Passengers from './components/Passengers';
import Bookings from './components/Bookings';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import CustomerApp from './components/CustomerApp';
import { AnimatePresence, motion } from 'motion/react';
import { Plane, ShieldCheck, Lock, Mail, Phone, User as UserIcon, LogIn, Smartphone, Loader2, Monitor, Layout, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { auth, loginAnonymously } from './lib/firebase';

export default function App() {
  const [appMode, setAppMode] = useState<'management' | 'customer' | 'select'>('select');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // "Mock" login logic
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email: email || (appMode === 'management' ? 'admin@jetjet.com' : 'guest@jetjet.com'),
        displayName: email.split('@')[0] || (appMode === 'management' ? 'JetJet Staff' : 'Hành khách JetJet'),
        role: appMode
      });
      setIsLoading(false);
    }, 800);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'flights': return <Flights />;
      case 'passengers': return <Passengers />;
      case 'bookings': return <Bookings />;
      case 'statistics': return <Statistics />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  // 1. Initial State: App Selection (Even if not authenticated)
  if (appMode === 'select') {
    return (
      <div className="fixed inset-0 jj-gradient flex items-center justify-center p-6 selection:bg-white selection:text-brand-primary overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Management Portal Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            onClick={() => { setAppMode('management'); setIsAuthenticated(false); }}
            className="bg-white p-12 rounded-[56px] shadow-2xl cursor-pointer group relative overflow-hidden h-[500px] flex items-center"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-brand-primary/5 transition-colors" />
            <div className="relative z-10 space-y-10 w-full">
               <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-gray-200 group-hover:bg-brand-primary transition-colors">
                  <Layout className="w-10 h-10 text-white" />
               </div>
               <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Management Portal</h2>
                  <p className="text-gray-400 font-medium mt-2">Hệ thống điều hành bay & Quản trị nội bộ</p>
               </div>
               <div className="flex items-center gap-4 pt-6">
                  <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Access</div>
                  <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Ops</div>
               </div>
               <button className="flex items-center gap-3 text-sm font-black text-brand-primary uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                  Truy cập Terminal <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>

          {/* Customer App Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -10 }}
            onClick={() => { setAppMode('customer'); setIsAuthenticated(false); }}
            className="bg-white p-12 rounded-[56px] shadow-2xl cursor-pointer group relative overflow-hidden h-[500px] flex items-center"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/30 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-brand-primary/5 transition-colors" />
            <div className="relative z-10 space-y-10 w-full">
               <div className="w-20 h-20 jj-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-red-200 -rotate-6 group-hover:rotate-0 transition-transform">
                  <Plane className="w-10 h-10 text-white -rotate-45" />
               </div>
               <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">JetJetAir App</h2>
                  <p className="text-gray-400 font-medium mt-2">Giao dịch đặt vé & Trải nghiệm hành khách</p>
               </div>
               <div className="flex items-center gap-4 pt-6">
                  <div className="px-4 py-2 bg-brand-accent/50 rounded-xl text-[10px] font-black text-brand-primary uppercase tracking-widest">Customer App</div>
                  <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Flow</div>
               </div>
               <button className="flex items-center gap-3 text-sm font-black text-brand-primary uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                  Bắt đầu đặt vé <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Hệ thống Đa nền tảng JetJet v2.5</span>
        </div>
      </div>
    );
  }

  // 2. Authentication Screen (After Mode Selection)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 jj-gradient flex items-center justify-center p-6 selection:bg-white selection:text-brand-primary overflow-y-auto">
        <motion.div 
          layout
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white p-10 md:p-14 rounded-[48px] w-full max-w-[500px] shadow-2xl relative overflow-hidden my-auto"
        >
          <button 
             onClick={() => setAppMode('select')}
             className="absolute top-6 left-6 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Branding */}
          <div className="text-center mb-10 relative">
            <div className="w-20 h-20 jj-gradient rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-red-200 mb-6 -rotate-6 group hover:rotate-0 transition-transform duration-500">
              <Plane className="w-10 h-10 text-white -rotate-45" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">JETJET AIR</h1>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mt-3 opacity-80">
               {appMode === 'management' ? 'Cổng quản lý nội bộ' : 'Dành cho khách hàng'}
            </p>
          </div>

          {/* Auth Switcher */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100 relative z-10">
            <button 
              onClick={() => setAuthMode('login')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                authMode === 'login' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400"
              )}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                authMode === 'register' ? "bg-white text-brand-primary shadow-sm" : "text-gray-400"
              )}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            <div className="space-y-4">
              {authMode === 'register' && (
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder={appMode === 'management' ? "Họ tên quản lý" : "Họ và tên khách hàng"}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/20 outline-none transition-all"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={appMode === 'management' ? "Email doanh nghiệp" : "Email khách hàng"}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/20 outline-none transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu truy cập"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-14 pr-5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 jj-gradient text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> 
                  {authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'} {appMode === 'management' ? 'Vận hành' : 'JetJet'}
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-wider">
             {appMode === 'management' 
               ? "Hệ thống hạn chế truy cập nội bộ." 
               : "Trải nghiệm bay đẳng cấp cùng JetJet Air."}
          </p>
        </motion.div>
      </div>
    );
  }

  // 3. Authenticated State: Show App
  if (appMode === 'customer' && isAuthenticated) {
    return <CustomerApp user={user} onExit={() => { setIsAuthenticated(false); setAppMode('select'); }} />;
  }

  return (
    <div className="flex min-h-screen bg-brand-muted selection:bg-brand-primary selection:text-white">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { setIsAuthenticated(false); }} />
      
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        <Topbar title={activeTab} />
        
        <header className="absolute top-4 right-8 z-50">
           <button 
             onClick={() => setAppMode('select')}
             className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-brand-primary transition-all shadow-sm"
           >
              <Monitor className="w-3.5 h-3.5" /> Chuyển Portal
           </button>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
          
          <footer className="p-8 mt-auto flex items-center justify-between border-t border-gray-100 bg-white/50">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              © 2026 HỆ THỐNG QUẢN TRỊ JETJET / LƯU HÀNH NỘI BỘ
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[10px] font-black text-gray-400 hover:text-brand-primary transition-colors tracking-widest uppercase">Chính sách Bảo mật</a>
              <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase bg-brand-accent px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                PHIÊN BẢN 2.5.0 ỔN ĐỊNH
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
