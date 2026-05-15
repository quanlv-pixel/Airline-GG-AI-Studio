import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone,
  ShieldCheck,
  CreditCard,
  Key,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useToast } from '@/src/hooks/useToast';
import ToastContainer from './ui/Toast';

export default function Settings() {
  const { toasts, showToast } = useToast();
  const [language, setLanguage] = useState('Tiếng Việt');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [securitySettings, setSecuritySettings] = useState({
    token: true,
    notifications: true,
    biometrics: false
  });

  const handleSave = () => {
    showToast('Cấu hình hệ thống đã được cập nhật thành công.');
  };

  const toggleSecurity = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full px-8 py-6 space-y-6 overflow-hidden flex flex-col font-sans">
      <ToastContainer toasts={toasts} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Cài đặt Hệ thống</h2>
          <p className="text-[13px] text-[#9AA4B2] font-medium">Cấu hình môi trường điều hành bay</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-[12px] font-black text-gray-400 hover:text-brand-primary uppercase tracking-wider transition-all">Huỷ</button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#FF3B4A] text-white rounded-xl text-[12px] font-black uppercase tracking-wider shadow-lg shadow-red-100 hover:scale-105 active:scale-95 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Column: Profile & Interface */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-6 rounded-[28px] border border-[#ECEEF2] shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F6F7FB] flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-black text-[#0F172A]">JetJet Admin</p>
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-[12px] text-[#9AA4B2]">console-ops-01@jetjet.com</p>
              </div>
            </div>
            <button className="p-3 hover:bg-gray-50 rounded-xl transition-all">
              <User className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[28px] border border-[#ECEEF2] shadow-sm flex-1 space-y-8">
            <h3 className="text-[12px] font-black text-[#9AA4B2] uppercase tracking-widest">Cài đặt Giao diện</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-[14px] font-extrabold text-[#0F172A]">Ngôn ngữ</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#F6F7FB] border-none rounded-xl text-[12px] font-black text-[#0F172A] px-4 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
              >
                <option value="Tiếng Việt">Tiếng Việt (VN)</option>
                <option value="English">English (US)</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-8">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  theme === 'light' ? "bg-orange-50 text-orange-500" : "bg-indigo-50 text-indigo-500"
                )}>
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <span className="text-[14px] font-extrabold text-[#0F172A]">Chế độ hiển thị</span>
              </div>
              <div className="flex items-center bg-[#F6F7FB] p-1.5 rounded-xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn("p-2 rounded-lg transition-all", theme === 'light' ? "bg-white shadow-md text-orange-500" : "text-gray-400 hover:text-orange-300")}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn("p-2 rounded-lg transition-all", theme === 'dark' ? "bg-white shadow-md text-indigo-500" : "text-gray-400 hover:text-indigo-300")}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security */}
        <div className="bg-white p-8 rounded-[28px] border border-[#ECEEF2] shadow-sm space-y-6 flex flex-col">
          <h3 className="text-[12px] font-black text-[#9AA4B2] uppercase tracking-widest mb-2">Bảo mật & Truy cập</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { id: 'token', label: 'Khóa Chuyến bay Đám mây', icon: Key, description: 'Tự động xoay vòng khóa phiên bảo mật' },
              { id: 'notifications', label: 'Thông báo Đẩy', icon: Bell, description: 'Cảnh báo vận hành thời gian thực' },
              { id: 'biometrics', label: 'Sinh trắc học', icon: Smartphone, description: 'Truy cập FaceID / Vân tay' },
            ].map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-[#F6F7FB] flex items-center justify-between group hover:border-[#ECEEF2] hover:bg-gray-50/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#F6F7FB] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <item.icon className="w-5 h-5 text-[#9AA4B2] group-hover:text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0F172A]">{item.label}</p>
                    <p className="text-[10px] text-[#9AA4B2] font-medium leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={securitySettings[item.id as keyof typeof securitySettings]} 
                    onChange={() => toggleSecurity(item.id as keyof typeof securitySettings)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-4.5 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#FF3B4A]" />
                </label>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-50 flex items-center gap-2.5 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            <Lock className="w-3.5 h-3.5" /> Mã hóa Không gian làm việc Nâng cao
          </div>
        </div>
      </div>
    </div>
  );
}
