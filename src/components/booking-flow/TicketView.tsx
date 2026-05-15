import React from 'react';
import { motion } from 'motion/react';
import { Plane, QrCode, Share2, Download, Home, Mail, CheckCircle2, Ticket as TicketIcon, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/hooks/useToast';

interface TicketViewProps {
  data: any;
  onFinish: () => void;
}

export default function TicketView({ data, onFinish }: TicketViewProps) {
  const { showToast } = useToast();
  const pnr = data.pnr || 'JJ' + Math.random().toString(36).substr(2, 4).toUpperCase();
  const ticketId = Math.floor(Math.random() * 1000000000).toString();
  const securityHash = Math.random().toString(36).substring(2, 15).toUpperCase();
  const flightDate = data.flight.date || '15/05/2026';
  const flightOriginCity = data.flight.originFull || 'TP. Hồ Chí Minh';
  const flightDestCity = data.flight.destinationFull || 'Hà Nội';
  const boardingTime = "07:15"; // Mock time
  const cabinClass = data.flight.cabin || "Economy";
  const gate = "12A";
  const terminal = "T2";
  const zone = "Zone 4";

  const handleSendEmail = () => {
    showToast("Email xác nhận đã được gửi thành công kèm vé điện tử!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto py-12 px-4 space-y-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Thẻ lên tàu Điện tử</h3>
          <p className="text-sm text-gray-400">Boarding Pass Ready to Use</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSendEmail} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-primary transition-all shadow-sm">
            <Mail className="w-5 h-5" />
          </button>
          <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-primary transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={onFinish}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-brand-primary transition-all"
          >
            <Home className="w-4 h-4" /> Về trang chủ
          </button>
        </div>
      </div>

      {/* Main Boarding Pass Design */}
      <div className="relative group">
        {/* Glow behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-[50px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative flex flex-col md:flex-row bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
           {/* Left Part: Flight Info */}
           <div className="flex-1 p-12 space-y-12">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg">
                       <Plane className="text-white w-6 h-6 -rotate-45" />
                    </div>
                    <div>
                       <p className="text-xl font-black text-gray-900 tracking-tight">JETJET AIR</p>
                       <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Premium Economy</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flight No.</p>
                    <p className="text-2xl font-black text-gray-900 leading-none mt-1">{data.flight.number}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="space-y-2">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{flightOriginCity}</p>
                    <p className="text-6xl font-black text-gray-900 tracking-tighter">{data.flight.origin}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-2">{flightDate}</p>
                 </div>
                 
                 <div className="flex-1 px-12 relative flex flex-col items-center">
                    <Plane className="text-brand-primary w-8 h-8 -rotate-45 mb-4" />
                    <div className="w-full border-t-4 border-dotted border-gray-100" />
                    <CheckCircle2 className="w-5 h-5 text-green-500 bg-white absolute left-1/2 -top-1 -translate-x-1/2 translate-y-1/2" />
                 </div>

                 <div className="space-y-2 text-right">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{flightDestCity}</p>
                    <p className="text-6xl font-black text-gray-900 tracking-tighter">{data.flight.destination}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-2">10:15 / Gate {gate}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-10 border-t border-gray-50">
                 <TicketInfoItem label="Hành khách" value={data.passenger.name.split(' ').pop() || 'Passenger'} sub={data.passenger.name} />
                 <TicketInfoItem label="Số ghế / Vùng" value={data.seats.join(', ') || 'N/A'} sub={zone} highlighted />
                 <TicketInfoItem label="Cửa / Ga" value={`${gate} / ${terminal}`} sub={`Boarding ${boardingTime}`} />
                 <TicketInfoItem label="Hạng / Cabin" value={cabinClass} sub="Class Y" />
                 <TicketInfoItem label="Giá vé" value={`$${(data.totalPrice || 0).toLocaleString()}`} sub="Paid - Verified" highlighted />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-8 border-t border-gray-50 mt-4">
                 <TicketInfoItem label="Mã PNR" value={pnr} sub="Booking Ref" />
                 <TicketInfoItem label="Mã bảo mật" value={securityHash.substring(0, 6)} sub="Security Hash" />
                 <TicketInfoItem label="Ngày xuất vé" value={new Date().toLocaleDateString('vi-VN')} sub="Issue Date" />
                 <TicketInfoItem label="Loại vé" value="Vé Điện tử" sub="E-Ticket" />
                 <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-[8px] font-black text-green-600 uppercase tracking-widest leading-none">Thanh toán<br />Đã xác minh</span>
                 </div>
              </div>

              <div className="mt-12 p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Clock className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian dự kiến</p>
                       <p className="text-sm font-black text-gray-900">Bay 2h 15m • Hạ cánh 11:30</p>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    {[...Array(24)].map((_, i) => (
                       <div key={i} className={cn("w-1 h-8 rounded-full", i % 4 === 0 ? "bg-gray-300" : "bg-gray-200")} />
                    ))}
                 </div>
                 <div className="text-center md:text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã vạch điện tử</p>
                    <p className="text-xs font-mono font-bold tracking-[0.3em] text-gray-400">*{ticketId}*</p>
                 </div>
              </div>
           </div>

           {/* Right Part: QR & Barcode */}
           <div className="w-full md:w-80 bg-gray-50/50 border-l-2 border-dashed border-gray-100 p-12 flex flex-col items-center justify-between relative">
              {/* Notches for ticket effect */}
              <div className="absolute -top-6 left-0 w-12 h-12 bg-[#F3F4F6] rounded-full -ml-6 border border-gray-100 hidden md:block" />
              <div className="absolute -bottom-6 left-0 w-12 h-12 bg-[#F3F4F6] rounded-full -ml-6 border border-gray-100 hidden md:block" />

              <div className="bg-white p-5 rounded-[32px] shadow-sm mb-6 border border-gray-100">
                 <QrCode className="w-32 h-32 text-gray-900" />
              </div>
              
              <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã PNR</p>
                    <p className="text-2xl font-black text-gray-900 tracking-[0.2em]">{pnr}</p>
                 </div>
                 <div className="pt-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Mã vé số điện tử</p>
                    <p className="text-xs font-black text-gray-500 leading-none mt-2">{ticketId}</p>
                 </div>
              </div>

              <div className="w-full pt-10 mt-auto flex flex-col items-center gap-3">
                 <div className="w-full h-10 flex gap-0.5 justify-center">
                    {Array.from({ length: 40 }).map((_, i) => (
                       <div key={i} className={cn("w-[2px] bg-gray-900", Math.random() > 0.5 ? "h-10" : "h-6")} />
                    ))}
                 </div>
                 <p className="text-[8px] font-black text-gray-400 tracking-[0.5em] uppercase">Security Check Pass</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <InstructionCard label="Ra sân bay" text="Vui lòng có mặt tại quầy thủ tục ít nhất 90 phút trước giờ khởi hành." icon={<Plane className="w-5 h-5" />} />
         <InstructionCard label="Hành lý" text="Hành khách mang theo hành lý xách tay tiêu chuẩn dưới 07kg/khách." icon={<Clock className="w-5 h-5" />} />
         <InstructionCard label="Vé điện tử" text="Xuất trình thẻ này qua điện thoại tại cửa khởi hành để lên máy bay." icon={<TicketIcon className="w-5 h-5" />} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 print:hidden">
        <button 
           onClick={() => window.print()}
           className="flex-1 py-5 bg-white border-2 border-gray-100 rounded-3xl font-black text-[11px] uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
           <Plane className="w-5 h-5 -rotate-45" /> Tải về / In vé
        </button>
        <button 
          onClick={handleSendEmail}
          className="flex-1 py-5 jj-gradient text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5" /> Gửi Email Xác nhận <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function TicketInfoItem({ label, value, sub, highlighted }: { label: string, value: string, sub: string, highlighted?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <div className="flex flex-col">
        <span className={cn("text-xl font-black", highlighted ? "text-brand-primary" : "text-gray-900")}>{value}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase">{sub}</span>
      </div>
    </div>
  );
}

function InstructionCard({ label, text, icon }: { label: string, text: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-[32px] border border-gray-100 flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
