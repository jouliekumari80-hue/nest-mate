const variants = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  neutral: "bg-white/[0.05] text-[#8A8F98] border-white/[0.06]",
  accent: "bg-[#5E6AD2]/10 text-[#5E6AD2] border-[#5E6AD2]/30",
};

export default function Badge({ variant = "accent", children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
