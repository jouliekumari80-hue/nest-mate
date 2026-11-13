import Badge from "../ui/Badge";

export default function LifestyleCard({ traits = [] }) {
  if (traits.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-card">
      <h2 className="text-sm font-semibold text-[#EDEDEF] mb-4">Lifestyle</h2>
      <div className="flex flex-wrap gap-2">
        {traits.map((t) => <Badge key={t.label}>{t.label}: {t.value}</Badge>)}
      </div>
    </div>
  );
}
