import React from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  Users, 
  Ticket, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  user?: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'flights', label: 'Chuyến bay', icon: Plane },
  { id: 'passengers', label: 'Hành khách', icon: Users },
  { id: 'bookings', label: 'Đặt chỗ', icon: Ticket },
  { id: 'statistics', label: 'Thống kê', icon: BarChart3 },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 jj-gradient rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
          <Plane className="text-white w-6 h-6 -rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 border-b-2 border-brand-primary leading-tight">JETJET</h1>
          <p className="text-[10px] font-bold text-brand-primary tracking-[0.2em] uppercase">Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group text-sm font-medium border border-transparent",
                isActive 
                  ? "bg-brand-accent text-brand-primary border-brand-primary/10" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-50 space-y-2">
        {user && (
          <div className="px-4 py-3 bg-gray-50 rounded-2xl flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                {user.displayName?.charAt(0).toUpperCase()}
             </div>
             <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{user.displayName}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate">{user.email}</p>
             </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:text-brand-primary hover:bg-brand-accent rounded-2xl transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất Hệ thống</span>
        </button>
      </div>
    </aside>
  );
}
