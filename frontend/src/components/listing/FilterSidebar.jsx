import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

export default function FilterSidebar({ filters, onChange, onClear }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0C] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#EDEDEF]">Filters</h3>
        <Button size="sm" variant="ghost" onClick={onClear}>Clear</Button>
      </div>

      {["city", "area"].map((f) => (
        <div key={f}>
          <label className="block text-xs font-medium text-[#8A8F98] mb-1.5 capitalize">{f}</label>
          <input value={filters[f] || ""} onChange={(e) => update(f, e.target.value)}
            placeholder={`e.g. ${f === "city" ? "Mumbai" : "Andheri"}`}
            className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Min Rent</label>
          <input type="number" value={filters.minRent || ""} onChange={(e) => update("minRent", e.target.value)} placeholder="₹5000"
            className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Max Rent</label>
          <input type="number" value={filters.maxRent || ""} onChange={(e) => update("maxRent", e.target.value)} placeholder="₹50000"
            className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 placeholder:text-[#5A5F66] focus:outline-none focus:border-[#5E6AD2]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Sharing</label>
        <select value={filters.sharing || "Any"} onChange={(e) => update("sharing", e.target.value)}
          className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
          {["Any", "Single", "Double", "Triple"].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#8A8F98] mb-1.5">Gender</label>
        <select value={filters.gender || "Any"} onChange={(e) => update("gender", e.target.value)}
          className="w-full bg-[#0F0F12] rounded-lg px-3 py-2 text-sm text-[#EDEDEF] border border-white/10 focus:outline-none focus:border-[#5E6AD2]">
          {["Any", "Male", "Female"].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
