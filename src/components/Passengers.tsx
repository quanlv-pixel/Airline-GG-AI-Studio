import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Globe,
  Award,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Modal from './ui/Modal';
import { useToast } from '@/src/hooks/useToast';
import ToastContainer from './ui/Toast';
import { useFirestoreCollection } from '@/src/hooks/useFirebase';

const INITIAL_PASSENGERS = [
  { id: 'PAS001', name: 'Lê Văn Quân', nationality: 'Việt Nam', passport: 'C1234567', email: 'quanle@jj-air.com', status: 'Bạch kim', spend: '$2,400' },
  { id: 'PAS002', name: 'James Wilson', nationality: 'Anh', passport: 'K9821332', email: 'james.w@sky.com', status: 'Bạc', spend: '$850' },
  { id: 'PAS003', name: 'Nguyễn Thu Hà', nationality: 'Việt Nam', passport: 'B8821102', email: 'ha.nt@jj-air.com', status: 'Vàng', spend: '$1,200' },
  { id: 'PAS004', name: 'Yoo Si Jin', nationality: 'Hàn Quốc', passport: 'M3342001', email: 'yoosj@kmail.com', status: 'Bạch kim', spend: '$5,100' },
  { id: 'PAS005', name: 'Emma Watson', nationality: 'Mỹ', passport: 'U1123382', email: 'emma.w@jj-air.com', status: 'Thành viên', spend: '$120' },
];

export default function Passengers() {
  const { data: firestorePassengers, addItem } = useFirestoreCollection<any>('passengers');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, showToast } = useToast();

  const passengersList = useMemo(() => {
    // Merge initial mock data with firestore data
    const existingNames = new Set(firestorePassengers.map(p => p.name));
    const uniqueInitial = INITIAL_PASSENGERS.filter(p => !existingNames.has(p.name));
    return [...firestorePassengers, ...uniqueInitial];
  }, [firestorePassengers]);

  const filteredPassengers = useMemo(() => {
    return passengersList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.passport?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, passengersList]);

  const handleAddPassenger = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassenger = {
      name: formData.get('name') as string,
      nationality: formData.get('nationality') as string,
      passport: formData.get('passport') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as string,
      spend: '$0'
    };
    await addItem(newPassenger);
    setIsModalOpen(false);
    showToast(`Đã đăng ký hành khách ${newPassenger.name} thành công.`);
  };

  return (
    <div className="p-8 space-y-8">
      <ToastContainer toasts={toasts} />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Khách hàng & Thành viên</h2>
          <p className="text-sm text-gray-400">Hồ sơ hành khách và hạng thành viên thân thiết</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Tìm kiếm hành khách..." 
              className="bg-white border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none w-[280px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card rounded-[32px] overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">Danh bạ Thành viên</h3>
            <button onClick={() => setSearchTerm('')} className="p-2 text-gray-400 hover:text-brand-primary transition-all"><RefreshCw className="w-4 h-4" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider"><th className="px-8 py-4">Họ và Tên</th><th className="px-8 py-4">Giấy tờ</th><th className="px-8 py-4">Hạng</th><th className="px-8 py-4">Chi tiêu</th><th className="px-8 py-4">Thao tác</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPassengers.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">{p.name[0]}</div><div><p className="text-sm font-bold text-gray-900">{p.name}</p><p className="text-[10px] text-gray-400">{p.email}</p></div></div></td>
                    <td className="px-8 py-5"><p className="text-xs font-bold text-gray-700">{p.passport}</p><p className="text-[10px] text-gray-400 uppercase">{p.nationality}</p></td>
                    <td className="px-8 py-5"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase", p.status === 'Bạch kim' ? "bg-slate-900 text-white" : "bg-brand-accent text-brand-primary")}>{p.status}</span></td>
                    <td className="px-8 py-5 text-sm font-black text-gray-700">{p.spend}</td>
                    <td className="px-8 py-5"><button className="p-1.5 text-gray-300 hover:text-brand-primary transition-colors"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] text-center bg-brand-accent/30 border-brand-primary/10">
            <Award className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h4 className="text-xl font-black text-gray-900 leading-tight">Phân tích Hội viên</h4>
            <p className="text-[11px] text-gray-500 mt-2 mb-6">Hệ thống tự động xếp hạng dựa trên chi tiêu thực tế.</p>
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase"><span>Tỉ lệ Vàng/Bạch kim</span><span>42%</span></div>
               <div className="h-2 bg-white rounded-full overflow-hidden"><div className="h-full w-[42%] bg-brand-primary" /></div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng ký Thành viên Mới" footer={<><button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Hủy</button><button form="add-p-form" type="submit" className="px-8 py-2.5 jj-gradient text-white rounded-xl text-sm font-bold shadow-lg">Đăng ký</button></>}>
        <form id="add-p-form" onSubmit={handleAddPassenger} className="space-y-4">
          <input name="name" placeholder="Họ và Tên" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" />
          <div className="grid grid-cols-2 gap-4"><input name="passport" placeholder="Số Hộ chiếu" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /><input name="nationality" placeholder="Quốc tịch" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /></div>
          <input name="email" type="email" placeholder="Địa chỉ Email" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" />
          <select name="status" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none"><option>Thành viên</option><option>Bạc</option><option>Vàng</option><option>Bạch kim</option></select>
        </form>
      </Modal>
    </div>
  );
}
