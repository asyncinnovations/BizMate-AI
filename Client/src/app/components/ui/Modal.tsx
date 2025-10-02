import React from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  size: "sm" | "md" | "lg" | "xl";
  titleIcon?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick,
  showCloseButton,
  className,
  overlayClassName,
  size,
  titleIcon,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onclose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={twMerge(
        `fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50  backdrop-blur-sm ${overlayClassName}`
      )}
    >
      <div
        className={twMerge(
          `w-full ${sizeClasses[size]} bg-white rounded-xl shadow-2xl animate-in fade-in-90 zoom-in-90 ${className}`
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-[#E1E8F5]">
            {title && (
              <div className="flex items-center gap-3">
                {titleIcon && (
                  <div className="bg-gradient-to-r from-[#2E69A4] to-[#1B2A49] p-2 rounded-lg">
                    {titleIcon}
                  </div>
                )}
                <h2 className="text-xl font-bold text-[#1B2A49]">{title}</h2>
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F4F7FA] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#344767]" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
