import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={cn(
                "bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]",
                className
              )}
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-brand-primary transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-1 px-8 py-8">
                {children}
              </div>

              {footer && (
                <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
