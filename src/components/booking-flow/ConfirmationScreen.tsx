import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, QrCode, Plane, Printer, Download, Mail, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ConfirmationScreenProps {
  data: any;
  onNext: () => void;
}

export default function ConfirmationScreen({ data, onNext }: ConfirmationScreenProps) {
  const pnr = 'JJ' + Math.random().toString(36).substr(2, 4).toUpperCase();
  const ticketId = Math.floor(Math.random() * 1000000000);

  return (
    <div className="min-h-[800px] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-12"
        >
          <div className="relative inline-block">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
              className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200"
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Đặt vé thành công!</h3>
            <p className="text-gray-400 font-medium text-lg">Mã đặt chỗ (PNR) của bạn đã được xác nhận và gửi tới email.</p>
          </div>

          <div className="glass-card p-10 rounded-[48px] bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-10 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full" />
             
             <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Mã đặt chỗ (PNR)</p>
                  <p className="text-3xl font-black text-brand-primary mt-2">{pnr}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Số vé (Ticket ID)</p>
                  <p className="text-sm font-black text-gray-900 mt-1">{ticketId}</p>
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Chuyến bay</p>
                  <p className="text-sm font-black text-gray-900 mt-2">{data.flight.number} • {data.flight.origin}-{data.flight.destination}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Hành khách</p>
                  <p className="text-sm font-black text-gray-900 mt-1">{data.passenger.name}</p>
                </div>
             </div>

             <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                <QrCode className="w-20 h-20 text-gray-900 mb-4" />
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quét tại quầy Kiosk</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <ActionButton icon={<Printer className="w-4 h-4" />} label="In vé cứng" />
             <ActionButton icon={<Download className="w-4 h-4" />} label="Tải PDF" />
             <ActionButton icon={<Mail className="w-4 h-4" />} label="Gửi Email" />
             <button 
              onClick={onNext}
              className="flex items-center gap-3 px-10 py-5 jj-gradient text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-200 hover:scale-[1.05] active:scale-[0.95] transition-all"
             >
                Xem thẻ lên tàu <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-3 px-8 py-5 bg-white border border-gray-100 text-gray-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-brand-primary transition-all shadow-sm">
      {icon} {label}
    </button>
  );
}
