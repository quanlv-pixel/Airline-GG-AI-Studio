import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  Plus, 
  Download, 
  RefreshCw,
  Clock,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Timer,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Modal from './ui/Modal';
import { useToast } from '@/src/hooks/useToast';
import ToastContainer from './ui/Toast';
import { useFirestoreCollection } from '@/src/hooks/useFirebase';

const INITIAL_FLIGHTS = [
  { id: 'JJ121', type: 'Airbus A321neo', origin: 'SGN', dest: 'HAN', departure: '2026-05-13 10:30', arrival: '12:45', status: 'Đúng giờ', price: '$120', cabin: 'Đầy', seats: 180 },
  { id: 'JJ342', type: 'Boeing 737 Max', origin: 'HAN', dest: 'DAD', departure: '2026-05-13 11:45', arrival: '13:00', status: 'Chậm chuyến', price: '$85', cabin: '85%', seats: 180 },
  { id: 'JJ551', type: 'Airbus A320', origin: 'SGN', dest: 'PQC', departure: '2026-05-13 12:15', arrival: '13:15', status: 'Đang lên máy bay', price: '$95', cabin: '98%', seats: 180 },
  { id: 'JJ882', origin: 'DAD', dest: 'SGN', departure: '2026-05-13 13:30', arrival: '15:00', status: 'Đúng giờ', price: '$110', cabin: '0%', seats: 180 },
  { id: 'JJ901', origin: 'SGN', dest: 'ICN', departure: '2026-05-13 22:30', arrival: '05:45', status: 'Đã lên lịch', price: '$250', cabin: '45%', seats: 210 },
];

export default function Flights() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flightsList, setFlightsList] = useState(INITIAL_FLIGHTS);
  const { toasts, showToast } = useToast();

  const filteredFlights = useMemo(() => {
    return flightsList.filter(f => {
      const matchesSearch = f.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.dest.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, flightsList]);

  const handleAddFlight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFlight = {
      id: formData.get('flightId') as string,
      type: formData.get('type') as string,
      origin: formData.get('origin') as string,
      dest: formData.get('dest') as string,
      departure: '2026-05-13 ' + formData.get('departure'),
      arrival: formData.get('arrival') as string,
      status: 'Đã lên lịch',
      price: '$' + formData.get('price'),
      cabin: '0%',
      seats: 180
    };
    
    setFlightsList([newFlight, ...flightsList]);
    setIsModalOpen(false);
    showToast(`Chuyến bay ${newFlight.id} đã được lên lịch thành công.`);
  };

  const handleDeleteFlight = (flightId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy chuyến bay ${flightId}?`)) {
      setFlightsList(prev => prev.filter(f => f.id !== flightId));
      showToast(`Đã loại bỏ chuyến bay ${flightId} khỏi lịch trình.`);
    }
  };

  const handleUpdateStatus = (flightId: string, newStatus: string) => {
    setFlightsList(prev => prev.map(f => f.id === flightId ? { ...f, status: newStatus } : f));
    showToast(`Trạng thái chuyến bay ${flightId} đã cập nhật thành ${newStatus}.`);
  };

  return (
    <div className="p-8 space-y-8">
      <ToastContainer toasts={toasts} />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Điều phối Bay</h2>
          <p className="text-sm text-gray-400">Quản lý và giám sát lịch trình bay thương mại</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            <span>Xuất Danh sách</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 jj-gradient px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-red-200 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chuyến bay</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo Mã chuyến hoặc Tuyến bay..." 
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/10 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border-r border-gray-100 pr-4 mr-2">
          <button onClick={() => setView('list')} className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-brand-accent text-brand-primary" : "text-gray-400 hover:bg-gray-50")}><ListIcon className="w-4 h-4" /></button>
          <button onClick={() => setView('grid')} className={cn("p-2.5 rounded-xl transition-all", view === 'grid' ? "bg-brand-accent text-brand-primary" : "text-gray-400 hover:bg-gray-50")}><LayoutGrid className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2.5 outline-none text-gray-600">
            <option value="All">Trạng thái: Tất cả</option>
            <option value="Đúng giờ">Đúng giờ</option>
            <option value="Chậm chuyến">Chậm chuyến</option>
            <option value="Đang lên máy bay">Đang lên máy bay</option>
            <option value="Đã lên lịch">Đã lên lịch</option>
          </select>
          <button onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-brand-accent rounded-xl transition-all"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="px-8 py-5">Thông tin</th>
                  <th className="px-8 py-5">Tuyến bay</th>
                  <th className="px-8 py-5">Lượng khách</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredFlights.map((flight, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center"><Plane className="w-5 h-5 text-brand-primary" /></div>
                        <div><p className="text-sm font-bold text-gray-900">{flight.id}</p><p className="text-[10px] text-gray-400 uppercase font-bold">{flight.type}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-black text-gray-900">{flight.origin}</p>
                        <div className="w-8 border-t border-dashed border-gray-200" />
                        <p className="text-xs font-black text-gray-900">{flight.dest}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 w-16 bg-gray-50 rounded-full overflow-hidden"><div className="h-full bg-brand-primary" style={{ width: flight.cabin === 'Đầy' ? '100%' : flight.cabin }} /></div>
                        <span className="text-[10px] font-bold text-gray-500">{flight.cabin}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <select 
                        value={flight.status} 
                        onChange={(e) => handleUpdateStatus(flight.id, e.target.value)}
                        className={cn(
                          "px-3 py-1 rounded-xl text-[10px] font-black uppercase outline-none border-none",
                          flight.status === 'Đúng giờ' && "bg-green-50 text-green-600",
                          flight.status === 'Chậm chuyến' && "bg-red-50 text-red-600",
                          flight.status === 'Đang lên máy bay' && "bg-blue-50 text-blue-600",
                          flight.status === 'Đã lên lịch' && "bg-gray-50 text-gray-500"
                        )}
                      >
                        <option>Đúng giờ</option>
                        <option>Chậm chuyến</option>
                        <option>Đang lên máy bay</option>
                        <option>Đã lên lịch</option>
                        <option>Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteFlight(flight.id)}
                        className="p-2 text-gray-300 hover:text-brand-primary transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 rotate-45" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights.map((flight, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl relative overflow-hidden border-2 border-transparent hover:border-brand-primary/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 jj-gradient-soft rounded-2xl flex items-center justify-center"><Plane className="w-5 h-5 text-brand-primary" /></div><div><h4 className="text-sm font-bold text-gray-900">{flight.id}</h4><p className="text-[10px] font-bold text-gray-400 capitalize">{flight.status}</p></div></div>
                  <Plane className="w-4 h-4 text-brand-primary animate-pulse" />
                </div>
                <div className="flex items-center justify-between py-4">
                  <p className="text-xl font-black text-gray-900">{flight.origin}</p>
                  <Plane className="w-3 h-3 text-gray-300 mx-2" />
                  <p className="text-xl font-black text-gray-900">{flight.dest}</p>
                </div>
                <div className="flex items-center justify-between mt-4"><p className="text-xs font-bold text-gray-400">CABIN: {flight.cabin}</p><p className="text-sm font-black text-brand-primary">{flight.price}</p></div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lên lịch Chuyến bay Mới" footer={<><button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Hủy</button><button form="add-flight-form" type="submit" className="px-8 py-2.5 jj-gradient text-white rounded-xl text-sm font-bold shadow-lg">Xác nhận</button></>}>
        <form id="add-flight-form" onSubmit={handleAddFlight} className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><input name="flightId" placeholder="Mã Chuyến bay (VD: JJ101)" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /><select name="type" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none"><option>Airbus A321neo</option><option>Airbus A320</option><option>Boeing 737</option></select></div>
          <div className="grid grid-cols-2 gap-4"><input name="origin" placeholder="Điểm đi (SGN)" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /><input name="dest" placeholder="Điểm đến (HAN)" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /></div>
          <div className="grid grid-cols-2 gap-4"><input name="departure" type="time" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /><input name="arrival" type="time" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" /></div>
          <input name="price" type="number" placeholder="Giá vé (USD)" required className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none" />
        </form>
      </Modal>
    </div>
  );
}
