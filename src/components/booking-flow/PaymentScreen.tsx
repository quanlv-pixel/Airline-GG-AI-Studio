import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Wallet, Building2, ShieldCheck, 
  Lock, ArrowRight, ChevronLeft, CheckCircle2,
  Loader2, Fingerprint, Eye, EyeOff, Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/hooks/useToast';

interface PaymentScreenProps {
  bookingData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function PaymentScreen({ bookingData, onNext, onBack }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'wallet' | 'bank' | 'member'>('card');
  const [showCvv, setShowCvv] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const { showToast } = useToast();
  const finalTotal = bookingData.totalPrice + (bookingData.seatPrice || 0);

  const simulatePayment = () => {
    showToast("Thanh toán thành công! Đang khởi tạo vé điện tử...");
    onNext({ ...bookingData, totalPrice: finalTotal });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      setCardData({ ...cardData, number: parts.join(' ') });
    } else {
      setCardData({ ...cardData, number: value });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <AnimatePresence />

      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-primary transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Thanh toán An toàn</h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Giao dịch được bảo vệ bởi JetJet Security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Method Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PaymentMethod 
              icon={<CreditCard className="w-5 h-5" />} 
              label="Thẻ Quốc tế" 
              active={selectedMethod === 'card'} 
              onClick={() => setSelectedMethod('card')}
            />
            <PaymentMethod 
              icon={<Wallet className="w-5 h-5" />} 
              label="Ví điện tử" 
              active={selectedMethod === 'wallet'} 
              onClick={() => setSelectedMethod('wallet')}
            />
            <PaymentMethod 
              icon={<Building2 className="w-5 h-5" />} 
              label="Ngân hàng" 
              active={selectedMethod === 'bank'} 
              onClick={() => setSelectedMethod('bank')}
            />
            <PaymentMethod 
              icon={<Sparkles className="w-5 h-5" />} 
              label="Dặm Miles" 
              active={selectedMethod === 'member'} 
              onClick={() => setSelectedMethod('member')}
            />
          </div>

          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black text-gray-900 tracking-tight">Thông tin Thẻ</h4>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
                </div>
                <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="MC" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Virtual Card Preview */}
              <motion.div 
                layout
                className="aspect-[1.6/1] bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                
                <div className="relative z-10 flex justify-between items-start">
                   <div className="w-12 h-10 bg-yellow-500/20 backdrop-blur rounded-lg flex items-center justify-center border border-yellow-500/30">
                      <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm" />
                   </div>
                   <Fingerprint className="w-8 h-8 opacity-20" />
                </div>

                <div className="relative z-10 space-y-2">
                  <p className="text-xl font-black tracking-[0.25em] font-mono leading-none">
                    {cardData.number || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end pt-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase opacity-40">Chủ thẻ</p>
                      <p className="text-xs font-black tracking-widest uppercase">
                        {cardData.holder || 'JOHN DOE'}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black uppercase opacity-40">Hết hạn</p>
                      <p className="text-xs font-black tracking-widest leading-none">
                        {cardData.expiry || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form Inputs */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chủ thẻ (In nổi)</label>
                  <input 
                    type="text" 
                    placeholder="VD: NGUYEN VAN A" 
                    value={cardData.holder}
                    onChange={(e) => setCardData({...cardData, holder: e.target.value.toUpperCase()})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all uppercase" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số thẻ tín dụng</label>
                  <div className="relative">
                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="**** **** **** ****" 
                      value={cardData.number}
                      onChange={handleCardNumberChange}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày hết hạn</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      value={cardData.expiry}
                      maxLength={5}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                        setCardData({...cardData, expiry: v});
                      }}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all font-mono text-center" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVV / CVC</label>
                    <div className="relative">
                      <input 
                        type={showCvv ? "text" : "password"} 
                        placeholder="***" 
                        value={cardData.cvv}
                        maxLength={3}
                        onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all font-mono text-center" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                      >
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-0.5">Mã hóa AES-256</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase leading-relaxed">Toàn bộ thông tin thẻ được bảo vệ bởi tiêu chuẩn PCI-DSS Level 1. Chúng tôi không lưu trữ mã CVV của bạn.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-2xl space-y-10 sticky top-8">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">Chi tiết đơn hàng</h4>
            
            <div className="space-y-6">
               <div className="space-y-4">
                 <SummaryItem label="Mã đặt chỗ (PNR)" value="Đang tạo..." />
                 <SummaryItem label="Chuyến bay" value={bookingData.flight.number} />
                 <SummaryItem label="Hành khách" value={bookingData.passenger.name} />
                 <SummaryItem label="Số ghế" value={bookingData.seats.join(', ')} />
               </div>
               
               <div className="pt-8 border-t border-gray-100 space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <span>Giá vé & Thuế</span>
                   <span>${bookingData.totalPrice.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <span>Phụ phí ghế</span>
                   <span>${(bookingData.seatPrice || 0).toLocaleString()}</span>
                 </div>
                 <div className="h-px bg-gray-50 my-2" />
                 <div className="flex justify-between items-end pt-2">
                   <div className="space-y-0.5">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
                     <p className="text-[9px] font-bold text-gray-400 italic">Bao gồm VAT</p>
                   </div>
                   <span className="text-4xl font-black text-brand-primary">${finalTotal.toLocaleString()}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={simulatePayment}
                className="w-full py-6 jj-gradient text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Thanh toán an toàn <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center gap-4 py-2 grayscale opacity-30">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="Paypal" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Norton_by_Symantec_logo.svg" className="h-4" alt="Norton" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="MC" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-gray-900" />
              <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">PCI-DSS COMPLIANT PLATFORM</span>
            </div>
            <p className="text-[8px] text-gray-400 text-center font-bold px-12 leading-relaxed">
              Dữ liệu của bạn được mã hóa hoàn toàn và không bao giờ được chia sẻ với bên thứ ba
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentMethod({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 text-center relative group overflow-hidden",
        active 
          ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10" 
          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all", 
        active ? "bg-brand-primary text-white shadow-lg" : "bg-gray-50 group-hover:bg-gray-100"
      )}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="method-indicator"
          className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full shadow-sm" 
        />
      )}
    </button>
  );
}

function SummaryItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-gray-900">{value}</span>
    </div>
  );
}

