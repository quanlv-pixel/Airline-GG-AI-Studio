import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Gift, Star, Zap, 
  ChevronRight, Sparkles, Clock, 
  UserPlus, ShieldCheck, Gem, Smartphone, X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PromotionProps {
  userSpend: number;
  onRegister: (memberData: any) => Promise<void>;
  isRegistered: boolean;
  user: any;
}

export default function Promotions({ userSpend, onRegister, isRegistered, user }: PromotionProps) {
  const [showRegModal, setShowRegModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    passport: '',
    nationality: 'Việt Nam',
    phoneNumber: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const getTier = (spend: number) => {
    if (spend >= 15000) return { name: 'Bạch kim', color: 'bg-slate-900', text: 'text-white', icon: <Gem className="w-6 h-6" />, next: null };
    if (spend >= 5000) return { name: 'Vàng', color: 'bg-yellow-400', text: 'text-gray-900', icon: <Star className="w-6 h-6" />, next: 15000 };
    if (spend >= 1000) return { name: 'Bạc', color: 'bg-gray-300', text: 'text-gray-800', icon: <Award className="w-6 h-6" />, next: 5000 };
    return { name: 'Thành viên mới', color: 'bg-blue-500', text: 'text-white', icon: <Zap className="w-6 h-6" />, next: 1000 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRegister(formData);
      setShowRegModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tier = getTier(userSpend);
  const progress = tier.next ? (userSpend / tier.next) * 100 : 100;

  const benefits = [
    { tier: 'Thành viên mới', perks: ['Giảm 5% cho chuyến bay đầu tiên', 'Tích lũy dặm bay cơ bản', 'Thông báo khuyến mãi sớm'] },
    { tier: 'Bạc', perks: ['Thêm 10kg hành lý ký gửi', 'Giảm 10% giá vé', 'Lựa chọn ghế ngồi miễn phí'] },
    { tier: 'Vàng', perks: ['Sử dụng phòng chờ hạng thương gia', 'Ưu tiên làm thủ tục & lên máy bay', 'Giảm 15% giá vé'] },
    { tier: 'Bạch kim', perks: ['Nâng hạng ghế miễn phí (nếu còn chỗ)', 'Xe đưa đón riêng tại sân bay', 'Giảm 25% giá vé', 'Hỗ trợ 24/7 riêng biệt'] },
  ];

  return (
    <div className="space-y-10 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-brand-primary text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Kích hoạt thành công!</p>
              <p className="text-[10px] font-bold text-white/70 uppercase">Chào mừng bạn đến với JetJet Elite</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <Gift className="w-8 h-8 text-brand-primary" /> Đặc quyền & Khuyến mãi
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isRegistered ? `Chào mừng trở lại hội viên Elite, ${user?.displayName}!` : 'Cấp độ hội viên dựa trên chi tiêu của bạn trong năm 2026'}
          </p>
        </div>
        {!isRegistered && (
          <button 
            onClick={() => setShowRegModal(true)}
            className="flex items-center gap-3 jj-gradient px-8 py-4 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Kích hoạt Hội viên
          </button>
        )}
      </div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[48px] w-full max-w-[500px] shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowRegModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 jj-gradient rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Star className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Gia nhập JetJet Elite</h3>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">Hoàn tất hồ sơ hội viên</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Số Hộ chiếu</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                      required
                      type="text"
                      value={formData.passport}
                      onChange={(e) => setFormData({...formData, passport: e.target.value})}
                      placeholder="VD: B1234567"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Số Điện thoại</label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                      required
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="VD: 0988 123 456"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4.5 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 jj-gradient text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang kích hoạt...' : 'Xác nhận Đăng ký'}
                </button>
                <p className="text-[9px] text-center text-gray-400 uppercase font-black tracking-widest px-8 leading-relaxed">
                  Bằng cách nhấn đăng ký, bạn đồng ý với các điều khoản bảo mật của hệ thống JetJet Air
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier Status Card */}
        <div className="lg:col-span-1 space-y-6">
          {isRegistered ? (
            <motion.div 
               initial={{ rotateY: 20, opacity: 0 }}
               animate={{ rotateY: 0, opacity: 1 }}
               className="bg-[#0F172A] p-10 rounded-[56px] text-white aspect-[3/4] flex flex-col justify-between relative overflow-hidden shadow-2xl group"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-brand-primary/30 transition-all duration-700" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] -ml-32 -mb-32" />
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-brand-primary" />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Cấp bậc</p>
                        <p className="text-xl font-black italic">{tier.name}</p>
                     </div>
                  </div>
                  <h4 className="text-2xl font-black tracking-tighter mb-1 uppercase tracking-widest">{user?.displayName}</h4>
                  <p className="text-xs font-bold text-white/40 tracking-widest">ELITE MEMBER • 2026</p>
               </div>

               <div className="relative z-10 space-y-6">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Mã hội viên</p>
                     <p className="text-3xl font-black tracking-[0.2em] font-mono">JJ-{user?.id?.substring(0, 4)}-{Math.floor(Math.random() * 9000 + 1000)}</p>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full" />
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tích lũy</p>
                        <p className="text-xl font-black">${userSpend.toLocaleString()}</p>
                     </div>
                     <div className="w-12 h-12 bg-white rounded-xl p-2">
                        <img src="https://www.svgrepo.com/show/491321/qr-code.svg" className="w-full h-full opacity-80" alt="QR" />
                     </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl relative overflow-hidden group">
               <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10 -mr-10 -mt-10 rounded-full", tier.color)} />
               
               <div className="relative z-10 space-y-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", tier.color, tier.text)}>
                     {tier.icon}
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hạng hiện tại</p>
                     <h3 className="text-3xl font-black text-gray-900 mt-1">Chưa đăng ký</h3>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-brand-primary" />
                     <p className="text-[10px] font-black text-slate-700 uppercase leading-relaxed">Đăng ký ngay để nhận ưu đãi lên đến 15%</p>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-[#0F172A] p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
             <h4 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-primary" /> Ưu đãi sắp hết hạn
             </h4>
             <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 font-black">-15%</div>
                   <div>
                      <p className="text-xs font-black">Bay Hàn Quốc</p>
                      <p className="text-[9px] text-gray-400">Còn lại 2 ngày</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 font-black">FREE</div>
                   <div>
                      <p className="text-xs font-black">Nâng hạng ghế</p>
                      <p className="text-[9px] text-gray-400">Dành riêng cho bạn</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Lộ trình Quyền lợi JetJet</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-8 rounded-[40px] border transition-all duration-300",
                    isRegistered && tier.name === b.tier 
                      ? "bg-white border-brand-primary shadow-xl ring-4 ring-brand-primary/5" 
                      : "bg-white/50 border-gray-100 grayscale-[0.8] opacity-60"
                  )}
                >
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">{b.tier}</h4>
                      {isRegistered && tier.name === b.tier && (
                        <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                           <ShieldCheck className="w-5 h-5" />
                        </span>
                      )}
                   </div>
                   <ul className="space-y-4">
                      {b.perks.map((perks, j) => (
                        <li key={j} className="flex items-start gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                           <p className="text-xs font-bold text-gray-600 leading-relaxed">{perks}</p>
                        </li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
