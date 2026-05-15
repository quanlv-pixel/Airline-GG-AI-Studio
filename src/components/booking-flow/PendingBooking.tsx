import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PendingBookingProps {
  onComplete: () => void;
}

export default function PendingBooking({ onComplete }: PendingBookingProps) {
  const [seconds, setSeconds] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    
    // Simulate processing for 3 seconds then show "completed" to let user continue
    const timeout = setTimeout(() => {
      // In a real app we might auto-proceed or wait for user click
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-12 text-center">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 bg-white border-8 border-brand-primary/10 rounded-full mx-auto flex items-center justify-center relative"
          >
            <Loader2 className="w-24 h-24 text-brand-primary animate-spin" />
            <div className="absolute inset-0 border-8 border-brand-primary border-t-transparent rounded-full animate-spin-slow" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 space-y-4"
          >
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Đang tạo đặt chỗ tạm thời...</h3>
            <p className="text-gray-400 font-medium">Hệ thống đang giữ chỗ cho hành khách trên chuyến bay.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[32px] border border-gray-100 flex items-center gap-6 text-left">
            <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-brand-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Đặt chỗ hết hạn sau</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatTime(seconds)}</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-gray-100 flex items-center gap-6 text-left">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Trạng thái hiện tại</p>
              <p className="text-xl font-black text-green-600 mt-1 uppercase">Pending</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-6">
             <StepIndicator num={1} label="Chọn chuyến" completed />
             <div className="w-12 h-1 bg-brand-primary rounded-full" />
             <StepIndicator num={2} label="Giữ chỗ" active />
             <div className="w-12 h-1 bg-gray-100 rounded-full" />
             <StepIndicator num={3} label="Thông tin" />
           </div>

           <button 
             onClick={onComplete}
             className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-gray-200"
           >
             Tiếp tục khi hoàn tất
           </button>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ num, label, active, completed }: { num: number, label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
        completed ? "bg-green-500 text-white" : active ? "bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/30" : "bg-gray-100 text-gray-400"
      )}>
        {completed ? <CheckCircle2 className="w-4 h-4" /> : num}
      </div>
      <span className={cn("text-[9px] font-black uppercase tracking-widest", (active || completed) ? "text-gray-900" : "text-gray-300")}>{label}</span>
    </div>
  );
}
