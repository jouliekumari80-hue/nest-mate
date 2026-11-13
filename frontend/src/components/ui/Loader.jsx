export default function Loader({ size = "md", className = "" }) {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  return <div className={`${sizes[size]} animate-pulse rounded-full bg-[#5E6AD2]/30 ${className}`} />;
}
