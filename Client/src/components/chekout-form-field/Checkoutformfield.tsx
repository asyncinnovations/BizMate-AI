import React from "react";

interface CheckoutFormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
}

const CheckoutFormField: React.FC<CheckoutFormFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  maxLength,
  required,
  autoComplete,
  inputMode,
  hint,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="block text-xs font-semibold text-text-primary tracking-wide">
        {label}
        {required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      {hint && <span className="text-[10px] text-text-muted">{hint}</span>}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      required={required}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-all duration-200 bg-bg-base"
    />
  </div>
);

export default CheckoutFormField;