import { AnimatePresence } from 'framer-motion';
import Toast from '../components/ui/Toast';
import { useAppStore } from '../store/useAppStore';

export function ToastProvider({ children }) {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  return (
    <>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                id={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={removeToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export function useToast() {
  const showToast = useAppStore((state) => state.showToast);
  return { showToast };
}
