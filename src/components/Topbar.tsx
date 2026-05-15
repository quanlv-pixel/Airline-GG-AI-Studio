import React from 'react';
import { Search, Bell, Calendar, User, Globe } from 'lucide-react';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-semibold capitalize text-gray-800">{title === 'dashboard' ? 'Tổng quan' : title}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span>Bảng Điều khiển</span>
          <span>/</span>
          <span className="text-brand-primary font-medium">{title}</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm chuyến bay, hành khách hoặc mã đặt chỗ..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 border-r border-gray-100 pr-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Trụ sở SGN - JJ822</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Hệ thống Trực tuyến</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-brand-accent rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-primary border-2 border-white rounded-full" />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-2" />

          <button className="flex items-center gap-3 group">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">Quản trị viên JetJet</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Điều phối bay</p>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
