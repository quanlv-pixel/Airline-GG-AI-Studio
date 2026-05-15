import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ToastType } from '@/src/hooks/useToast';

interface ToastContainerProps {
  toasts: { id: string; message: string; type: ToastType }[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "p-4 pr-12 rounded-2xl shadow-xl border bg-white min-w-[300px] pointer-events-auto relative flex items-center gap-4",
              toast.type === 'success' && "border-green-100",
              toast.type === 'error' && "border-red-100",
              toast.type === 'info' && "border-blue-100",
              toast.type === 'warning' && "border-orange-100"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              toast.type === 'success' && "bg-green-50 text-green-600",
              toast.type === 'error' && "bg-red-50 text-red-600",
              toast.type === 'info' && "bg-blue-50 text-blue-600",
              toast.type === 'warning' && "bg-orange-50 text-orange-600"
            )}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{toast.type.toUpperCase()}</p>
              <p className="text-xs text-gray-500 font-medium">{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
