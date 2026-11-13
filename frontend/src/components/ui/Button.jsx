import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-[#5E6AD2] text-white shadow-accent hover:bg-[#6872D9] hover:shadow-glow active:scale-[0.98]",
  secondary: "bg-white/[0.05] text-[#EDEDEF] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] active:scale-[0.98]",
  ghost: "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05] active:scale-[0.98]",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef(({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-expo-out ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    {...props}
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </button>
));

Button.displayName = "Button";
export default Button;
