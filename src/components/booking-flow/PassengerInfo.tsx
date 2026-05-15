import React from 'react';
import { motion } from 'motion/react';
import { User, Contact, FileText, Globe, ArrowRight, ChevronLeft, CreditCard } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PassengerInfoProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function PassengerInfo({ onNext, onBack }: PassengerInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onNext({ 
      passenger: { 
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone')
      } 
    });
  };

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
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Thông tin Hành khách</h3>
          <p className="text-sm text-gray-400">Bước 4: Cung cấp thông tin giấy tờ đi lại</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Thông tin Cá nhân" icon={<User className="w-4 h-4 text-brand-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="fullName" label="Họ và Tên (như hộ chiếu)" placeholder="NGUYEN VAN A" required />
              <InputField name="dob" label="Ngày sinh" placeholder="DD/MM/YYYY" required />
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Giới tính</label>
                <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-brand-primary/20 transition-all">
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>
              <InputField name="nationality" label="Quốc tịch" placeholder="Việt Nam" required />
            </div>
          </Section>

          <Section title="Thông tin Liên hệ" icon={<Contact className="w-4 h-4 text-brand-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="email" label="Địa chỉ Email" placeholder="example@email.com" required type="email" />
              <InputField name="phone" label="Số điện thoại" placeholder="+84 9xx xxx xxx" required type="tel" />
            </div>
          </Section>

          <Section title="Giấy tờ Du lịch" icon={<FileText className="w-4 h-4 text-brand-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="passport" label="Số Hộ chiếu / CCCD" placeholder="C1234567" required />
              <InputField name="expiry" label="Ngày hết hạn" placeholder="DD/MM/YYYY" required />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 space-y-8 sticky top-8">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">Tóm tắt đặt vé</h4>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <Globe className="w-5 h-5 text-brand-primary" />
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Loại chuyến bay</p>
                   <p className="text-xs font-black text-gray-900 uppercase">Quốc nội (Domestic)</p>
                 </div>
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between items-center px-2">
                   <span className="text-[10px] font-black text-gray-400 uppercase">Trạng thái ghế</span>
                   <span className="text-[10px] font-black text-orange-500 uppercase">Đang chờ chọn</span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <span className="text-[10px] font-black text-gray-400 uppercase">Hành lý dự kiến</span>
                   <span className="text-[10px] font-black text-gray-900 uppercase">7kg xách tay</span>
                 </div>
               </div>
            </div>

            <button type="submit" className="w-full py-5 jj-gradient text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Tiếp tục chọn ghế <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="glass-card p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
        <div className="w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center">{icon}</div>
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, placeholder, name, required = false, type = "text" }: { label: string, placeholder: string, name: string, required?: boolean, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/20 transition-all placeholder:text-gray-300"
      />
    </div>
  );
}
