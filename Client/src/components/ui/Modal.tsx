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
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={twMerge(
        `fixed inset-0 bg-text-heading/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm ${overlayClassName}`,
      )}
    >
      <div
        className={twMerge(
          `w-full ${sizeClasses[size]} bg-surface border border-border overflow-hidden rounded-xl shadow-raised animate-in fade-in-90 zoom-in-90 ${className}`,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && (
              <div className="flex items-center gap-3">
                {titleIcon && (
                  <div className="bg-brand p-2 rounded-lg">{titleIcon}</div>
                )}
                <h2 className="text-base font-bold text-text-heading">
                  {title}
                </h2>
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-bg-base rounded-lg transition-colors text-text-muted hover:text-text-heading"
              >
                <X className="w-4 h-4" />
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
