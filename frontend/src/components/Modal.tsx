import { useEffect, useRef } from "react";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, children, disableClose = false }: any) => {
  const ignoreClick = useRef(true);

  useEffect(() => {
    if (isOpen) {
      ignoreClick.current = true;

      // Allow normal behavior after a short delay
      setTimeout(() => {
        ignoreClick.current = false;
      }, 100);
    }
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (ignoreClick.current || disableClose) return;   // 🔥 Prevent immediate close on mobile tap
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-2xl p-5 lg:p-7 w-full min-h-[22rem] max-w-sm lg:max-w-md relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
