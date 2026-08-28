import { AlertTriangle, Trash2, Check, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: 'info' | 'danger' | 'warning';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'info',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  const colors = {
    info: {
      bgIcon: 'bg-blue-50 text-sys-blue',
      btnConfirm: 'bg-sys-blue hover:bg-sys-blue-hover text-white shadow-blue-100',
      icon: <Check className="w-6 h-6" />
    },
    danger: {
      bgIcon: 'bg-red-50 text-red-500',
      btnConfirm: 'bg-red-500 hover:bg-red-600 text-white',
      icon: <Trash2 className="w-6 h-6" />
    },
    warning: {
      bgIcon: 'bg-yellow-50 text-yellow-600',
      btnConfirm: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      icon: <AlertTriangle className="w-6 h-6" />
    }
  };

  const currentStyle = colors[type];

  return (
    <div className="fixed inset-0 bg-black/60 z-300 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center border border-gray-100 animate-modal-enter text-sm">
        
        {/*Ícone Dinâmico*/}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${currentStyle.bgIcon}`}>
          {currentStyle.icon}
        </div>

        {/*Textos*/}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>

        {/*Botões de Ação*/}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="grow py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`grow py-2.5 rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${currentStyle.btnConfirm}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}