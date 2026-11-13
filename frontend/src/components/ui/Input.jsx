import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-[#EDEDEF]">{label}</label>}
    <input
      ref={ref}
      className={`w-full bg-[#0F0F12] rounded-lg px-4 py-2.5 text-sm text-[#EDEDEF] border ${error ? "border-red-500/50" : "border-white/10"} placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2] focus:ring-1 focus:ring-[#5E6AD2]/30 transition-all duration-200 ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

Input.displayName = "Input";
export default Input;
