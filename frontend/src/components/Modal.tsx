import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4" onClick={onClose}>
      <div className="bg-white rounded-md shadow-lg p-4 lg:p-6 w-full min-h-[22rem] max-w-sm lg:max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}>

          <X className="w-4 h-4 border border-gray-400" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
