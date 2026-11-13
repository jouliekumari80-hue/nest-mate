import Button from "./Button";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-[#5E6AD2] text-white" : "text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.05]"}`}>
          {i + 1}
        </button>
      ))}
      <Button size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  );
}
